import { forwardRef, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserToken } from "apps/auth";
import { GroupService, memberRelation, MemberService } from "apps/groups";
import { MEMBER_STATUS } from "apps/groups/constants";
import { POST_MODE, POST_STATUS, POST_TYPE } from "apps/posts/constants";
import { CreatePostInput, QueryPostInput, UpdatePostInput } from "apps/posts/dtos";
import { Post } from "apps/posts/entities";
import { Profile, ProfileService, relateRelations, RelationService, RELATION_TYPE } from "apps/profiles";
import { BaseError, BaseService } from "base";
import { FindOptionsWhere, In, Not, Repository } from "typeorm";
import { CommentService } from "../comment";

const MODULE_NAME = 'Post'

export const postRelation = {
  author: true,
  group: true,
}

@Injectable()
export class PostService extends BaseService<Post> {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @Inject(forwardRef(() => GroupService)) private groupService: GroupService,
    @Inject(forwardRef(() => MemberService)) private memberService: MemberService,
    @Inject(forwardRef(() => CommentService)) private commentService: CommentService,
    @Inject(forwardRef(() => RelationService)) private relationService: RelationService,
    @Inject(forwardRef(() => ProfileService)) private profileService: ProfileService,
  ) {
    super(postRepo)
  }

  async validGroup(user: UserToken, groupId: string) {
    const group = await this.groupService.findOne({ id: groupId })
    if (!group) {
      BaseError(`Group`, HttpStatus.NOT_FOUND)
    }

    const member = await this.memberService.findOne({
      user: { id: user.profile.id },
      group: { id: group.id }
    }, memberRelation)

    if (!member || member.status !== MEMBER_STATUS.ACTIVE) {
      BaseError(MODULE_NAME, HttpStatus.FORBIDDEN)
    }

    return { group }
  }

  async create(user: UserToken, input: CreatePostInput) {
    const { group: groupId, ...rest } = input

    const createdPost = this.postRepo.create({
      ...rest,
      author: user.profile,
    })

    if (groupId) {
      const { group } = await this.validGroup(user, groupId)

      createdPost.group = group
    }

    await this.postRepo.save(createdPost)
    return {
      post: createdPost
    }
  }

  async findAll(user: UserToken, query: QueryPostInput) {
    const { limit, type, } = query
    const singleWhere: FindOptionsWhere<Post> = {}  
    singleWhere.type = type || POST_TYPE.POST

    const { relations } = await this.relationService.getRelations(user)
    const { friends, followings } = relations

    const friendIds = friends.map(x => x.id)
    const followingIds = followings.map(x => x.id)

    const where: FindOptionsWhere<Post>[] = [
      {
        author: { id: In(friendIds) },
        mode: Not(POST_MODE.PRIVATE),
        ...singleWhere,
      },
      {
        author: { id: In(followingIds) },
        mode: POST_MODE.PUBLIC,
        ...singleWhere,
      }
    ]

    const { data: posts, total } = await this.find({
      where,
      relations: postRelation,
      limit,
    })

    return { posts, total }
  }

  async findByUser(user: UserToken, profile: Profile, limit: number) {
    const relation = await this.relationService.findOne([
      { requester: { id: user.profile.id }, user: { id: profile.id  }, type: RELATION_TYPE.FRIEND }, 
      { requester: { id: profile.id  }, user: { id: user.profile.id }, type: RELATION_TYPE.FRIEND },
    ], relateRelations)

    const where: FindOptionsWhere<Post> = {
      group: { id: null },
      author: { 
        id: profile.id,
      }
    }
    if (user.profile.id !== profile.id) {
      if (relation) {
        where.mode = Not(POST_MODE.PRIVATE)
      } else {
        where.mode = POST_MODE.PUBLIC
      }
    } 

    const { data: posts, total } = await this.find({
      where,
      relations: postRelation,
      limit,
    })

    return { posts, total }
  }

  async findById(user: UserToken, id: string) {
    const post = await this.findOne({ id }, postRelation)
    switch (post.mode) {
      case POST_MODE.PRIVATE: {
        if (post.author.id !== user.profile.id) {
          BaseError(MODULE_NAME, HttpStatus.FORBIDDEN)
        }
        break
      }
      case POST_MODE.FRIEND: {
        const relations = await this.relationService.findOne([
          { requester: { id: post.author.id }, user: { id: user.profile.id } },
          { user: { id: post.author.id }, requester: { id: user.profile.id } }
        ])
        if (!relations || relations.type !== RELATION_TYPE.FRIEND) {
          BaseError(MODULE_NAME, HttpStatus.FORBIDDEN)
        }
        break
      }
    }
    if (post.status !== POST_STATUS.ACTIVE) {
      BaseError(MODULE_NAME, HttpStatus.GONE)
    }

    return { post }
  }

  async update(
    user: UserToken,
    id: string,
    input: UpdatePostInput,
  ) {
    const post = await this.findOne({ id }, postRelation)
    if (!post) {
      BaseError(MODULE_NAME, HttpStatus.NOT_FOUND)
    }

    if (post.author.id !== user.profile.id) {
      BaseError(MODULE_NAME, HttpStatus.FORBIDDEN)
    }

    await this.postRepo.save({
      ...input,
      id,
    })

    return {
      post: { ...post, ...input }
    }
  }

  async remove(user: UserToken, id: string) {
    const post = await this.findOne({ id }, postRelation)
    if (!post) {
      BaseError(MODULE_NAME, HttpStatus.NOT_FOUND)
    }

    if (post.author.id !== user.profile.id) {
      BaseError(MODULE_NAME, HttpStatus.FORBIDDEN)
    }

    await this.postRepo.softRemove(post)
  }
}