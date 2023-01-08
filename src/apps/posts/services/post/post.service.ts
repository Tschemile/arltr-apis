import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserToken } from "apps/auth";
import { GroupService, memberRelation, MemberService } from "apps/groups";
import { MEMBER_STATUS } from "apps/groups/constants";
import { POST_MODE, POST_STATUS } from "apps/posts/constants";
import { CreatePostInput, UpdatePostInput } from "apps/posts/dtos";
import { Post } from "apps/posts/entities";
import { RelationService, RELATION_TYPE } from "apps/profiles";
import { BaseService } from "base";
import { Repository } from "typeorm";
import { HTTP_STATUS } from "utils";
import { CommentService } from "../comment";

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
  ) {
    super(postRepo)
  }

  async validGroup(user: UserToken, groupId: string) {
    const group = await this.groupService.findOne({ id: groupId })
    if (!group) {
      return {
        status: HTTP_STATUS.Not_Found,
      }
    }

    const member = await this.memberService.findOne({
      user: { id: user.profile.id },
      group: { id: group.id }
    }, memberRelation)

    if (!member || member.status !== MEMBER_STATUS.ACTIVE) {
      return {
        status: HTTP_STATUS.Forbidden
      }
    }

    return { group, status: HTTP_STATUS.OK }
  }

  async create(user: UserToken, input: CreatePostInput) {
    const { group: groupId, ...rest } = input

    const createdPost = this.postRepo.create({
      ...rest,
      author: user.profile,
    })

    if (groupId) {
      const { status, group } = await this.validGroup(user, groupId)
      if (status !== HTTP_STATUS.OK) {
        return { status }
      }

      createdPost.group = group
    }

    await this.postRepo.save(createdPost)
    return {
      status: HTTP_STATUS.Forbidden,
      post: createdPost
    }
  }

  async findById(user: UserToken, id: string) {
    const post = await this.findOne({ id }, postRelation)
    switch (post.mode) {
      case POST_MODE.PRIVATE: {
        if (post.author.id !== user.profile.id) {
          return { status: HTTP_STATUS.Forbidden }
        }
        break
      }
      case POST_MODE.FRIEND: {
        const relations = await this.relationService.findOne([
          { requester: { id: post.author.id }, user: { id: user.profile.id } },
          { user: { id: post.author.id }, requester: { id: user.profile.id } }
        ])
        if (!relations || relations.type !== RELATION_TYPE.FRIEND) {
          return { status: HTTP_STATUS.Forbidden }
        }
        break
      }
    }
    if (post.status !== POST_STATUS.ACTIVE) {
      return { status: HTTP_STATUS.Gone }
    }

    return {
      status: HTTP_STATUS.OK,
      post,
    }
  }

  async update(
    user: UserToken,
    id: string,
    input: UpdatePostInput,
  ) {
    const post = await this.findOne({ id }, postRelation)
    if (!post) {
      return {
        status: HTTP_STATUS.Not_Found
      }
    }

    if (post.author.id !== user.profile.id) {
      return {
        status: HTTP_STATUS.Forbidden
      }
    }

    await this.postRepo.save({
      ...input,
      id,
    })

    return {
      status: HTTP_STATUS.OK,
      post: { ...post, ...input }
    }
  }

  async remove(user: UserToken, id: string) {
    const post = await this.findOne({ id }, postRelation)
    if (!post) {
      return {
        status: HTTP_STATUS.Not_Found
      }
    }

    if (post.author.id !== user.profile.id) {
      return {
        status: HTTP_STATUS.Forbidden
      }
    }

    await this.postRepo.save({
      isDeleted: true,
      deletedAt: new Date(),
      id,
    })

    return {
      status: HTTP_STATUS.OK,
    }
  }

  async incrementReacts(id: string, total: number) {
    await this.postRepo.save({
      id,
      totalReacts: total,
    })
  }

  async incrementComments(id: string, total: number) {
    await this.postRepo.save({
      id,
      totalComments: total,
    })
  }
}