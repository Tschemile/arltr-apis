import { forwardRef, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserToken } from "apps/auth";
import { GroupService, MemberService } from "apps/groups";
import { GROUP_MODE, MEMBER_STATUS } from "apps/groups/constants";
import { POST_MODE, POST_STATUS, POST_TYPE } from "apps/posts/constants";
import { CreatePostInput, QueryPostInput, UpdatePostInput } from "apps/posts/dtos";
import { Post } from "apps/posts/entities";
import { ProfileService, RelationService, RELATION_TYPE } from "apps/profiles";
import { BaseError, BaseService } from "base";
import { FindOptionsOrder, FindOptionsWhere, In, LessThan, Like, Not, Repository } from "typeorm";
import { isSameArray, TableName, timeIn } from "utils";
import { CommentService } from "../comment";
import { ReactService } from "../react";
import { TagService } from "../tag";
import { formatData } from "./formatData";

export const postRelation = {
  author: true,
  group: true,
  event: true,
}

@Injectable()
export class PostService extends BaseService<Post> {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @Inject(forwardRef(() => ReactService)) private reactService: ReactService,
    @Inject(forwardRef(() => GroupService)) private groupService: GroupService,
    @Inject(forwardRef(() => MemberService)) private memberService: MemberService,
    @Inject(forwardRef(() => CommentService)) private commentService: CommentService,
    @Inject(forwardRef(() => RelationService)) private relationService: RelationService,
    @Inject(forwardRef(() => ProfileService)) private profileService: ProfileService,
    @Inject(forwardRef(() => TagService)) private tagService: TagService,
  ) {
    super(postRepo, postRelation)
  }

  async validGroup(user: UserToken, groupId: string) {
    const group = await this.groupService.findOne({ id: groupId })
    if (!group) {
      BaseError(TableName.GROUP, HttpStatus.NOT_FOUND)
    }

    const member = await this.memberService.findOne({
      user: { id: user.profile.id },
      group: { id: group.id }
    })

    if (!member || member.status !== MEMBER_STATUS.ACTIVE) {
      BaseError(TableName.POST, HttpStatus.FORBIDDEN)
    }

    return { group }
  }

  async create(user: UserToken, input: CreatePostInput) {
    const { group: groupId, tags, ...rest } = input

    const createdPost = this.postRepo.create({
      ...rest,
      author: user.profile,
    })

    if (groupId) {
      const { group } = await this.validGroup(user, groupId)

      createdPost.group = group
    }

    await this.postRepo.save(createdPost)

    if (tags && tags.length > 0) {
      await this.tagService.create({ tags, post: createdPost })
    }

    return {
      post: createdPost
    }
  }

  async findAll(user: UserToken, query: QueryPostInput) {
    const {
      type,
      queryType,
      search,
      user: userId,
      group: groupId,
      limit,
      page,
    } = query

    const commonWhere: FindOptionsWhere<Post> = {
      type: type || POST_TYPE.POST,
    }
    const order: FindOptionsOrder<Post> = {
      createdAt: 'DESC'
    }

    if (type && type === POST_TYPE.STORY) {
      const time24Ago = timeIn({ duration: 24, unit: 'hour', action: 'sub' })
      commonWhere.createdAt = LessThan(time24Ago)

      order.createdAt = 'ASC'
    }

    if (search) {
      commonWhere.content = Like(`%${search}%`)
    }

    const where: FindOptionsWhere<Post>[] = []
    switch(queryType) {
      case 'COMMUNITY': {
        commonWhere.group = null
        const { relations } = await this.relationService.getRelations(user)
        const { friends, followings } = relations
        
        const friendIds = friends.map(x => x.id)
        where.push({
          author: { id: In(friendIds) },
          mode: Not(POST_MODE.PRIVATE),
          ...commonWhere,
        })

        const followingIds = followings.map(x => x.id)
        where.push({
          author: { id: In(followingIds) },
          mode: POST_MODE.PUBLIC,
          ...commonWhere
        })
        break
      }
      case 'GROUP': {
        const group = await this.groupService.findOne({ id: groupId })
        if (!group) {
          BaseError(TableName.GROUP, HttpStatus.NOT_FOUND)
        }
        if (group.mode !== GROUP_MODE.PUBLIC) {
          const isMember = await this.memberService.isMember(user, group.id)
          if (!isMember) {
            BaseError(TableName.GROUP, HttpStatus.FORBIDDEN)
          }
        }
        where.push({
          group: { id: group.id },
        })
        break
      }
      case 'USER': {
        const profile = await this.profileService.findOne({ id: userId })
        if (!profile) {
          BaseError(TableName.PROFILE, HttpStatus.NOT_FOUND)
        }
        if (user.profile.id === profile.id) {
          where.push({ author: { id: profile.id }})
        } else {
          const isFriend = await this.relationService.isFriend(user, profile)
          where.push({
            author: { id: profile.id },
            mode: isFriend ? Not(POST_MODE.PRIVATE) : POST_MODE.PUBLIC
          })
        }
        break
      }
    }

    const { data, total } = await this.find({
      where,
      limit,
      order,
      page,
    })

    const postIds = data.map((x) => x.id)

    const reacts = await this.reactService.reacted(user, postIds, 'POST')
    const tags = await this.tagService.findAll(postIds, 'POST')

    const posts = formatData({ posts: data, reacts, tags })

    return { posts, total }
  }

  async findById(user: UserToken, id: string) {
    const post = await this.findOne({ id })
    switch (post.mode) {
      case POST_MODE.PRIVATE: {
        if (post.author.id !== user.profile.id) {
          BaseError(TableName.POST, HttpStatus.FORBIDDEN)
        }
        break
      }
      case POST_MODE.FRIEND: {
        const relations = await this.relationService.findOne([
          { requester: { id: post.author.id }, user: { id: user.profile.id } },
          { user: { id: post.author.id }, requester: { id: user.profile.id } }
        ])
        if (!relations || relations.type !== RELATION_TYPE.FRIEND) {
          BaseError(TableName.POST, HttpStatus.FORBIDDEN)
        }
        break
      }
    }
    if (post.status !== POST_STATUS.ACTIVE) {
      BaseError(TableName.POST, HttpStatus.GONE)
    }

    return { post }
  }

  async update(
    user: UserToken,
    id: string,
    input: UpdatePostInput,
  ) {
    const { tags: tagIds = [], ...rest } = input || {}
    const post = await this.findOne({ id })
    if (!post) {
      BaseError(TableName.POST, HttpStatus.NOT_FOUND)
    }

    if (post.author.id !== user.profile.id) {
      BaseError(TableName.POST, HttpStatus.FORBIDDEN)
    }

    const tagsOfPosts = await this.tagService.findAll([post.id], 'POST')
    const tagOfPostIds = tagsOfPosts.map((x) => x.user.id)

    if (!isSameArray(tagIds, tagOfPostIds)) {
      const newTags = tagIds.filter(value => !tagOfPostIds.includes(value));
      const removeTags = tagOfPostIds.filter(value => !tagIds.includes(value));

      if (newTags.length > 0) {
        await this.tagService.create({
          tags: newTags,
          post
        })
      }

      if (removeTags.length > 0) {
        await this.tagService.remove({
          tags: removeTags,
          post: post,
        })
      }
    }

    await this.postRepo.save({
      ...rest,
      id,
    })

    return {
      post: { ...post, ...input }
    }
  }

  async remove(user: UserToken, id: string) {
    const post = await this.findOne({ id })
    if (!post) {
      BaseError(TableName.POST, HttpStatus.NOT_FOUND)
    }

    if (post.author.id !== user.profile.id) {
      BaseError(TableName.POST, HttpStatus.FORBIDDEN)
    }

    return {
      post: await this.postRepo.softRemove(post)
    }
  }
}