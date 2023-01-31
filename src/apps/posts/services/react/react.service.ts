import { forwardRef, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserToken } from "apps/auth";
import { QueryReactInput, UpsertReactInput } from "apps/posts/dtos";
import { React } from "apps/posts/entities";
import { BaseError, BaseService } from "base";
import { FindOptionsWhere, In, Repository } from "typeorm";
import { DBName, TableName } from "utils";
import { CommentService } from "../comment";
import { PostService } from "../post";

export const reactRelation = {
  post: true,
  comment: true,
  user: true,
}

@Injectable()
export class ReactService extends BaseService<React> {
  constructor(
    @InjectRepository(React) private reactRepo: Repository<React>,
    @Inject(forwardRef(() => PostService)) private postService: PostService,
    @Inject(forwardRef(() => CommentService)) private commentService: CommentService,
  ) {
    super(reactRepo, reactRelation)
  }

  async validInput(input: UpsertReactInput) {
    let id: string
    let isPost: boolean

    const where: FindOptionsWhere<React> = {}

    const { post: postId, comment: commentId } = input
    if (postId) {
      const post = await this.postService.findOne({ id: postId })
      if (!post) {
        BaseError(TableName.POST, HttpStatus.NOT_FOUND)
      }

      id = post.id
      isPost = true
      where.post = { id: post.id }
    }
    if (commentId) {
      const comment = await this.commentService.findOne({ id: commentId })
      if (!comment) {
        BaseError(TableName.COMMENT, HttpStatus.NOT_FOUND)
      }

      id = comment.id
      isPost = false
      where.comment = { id: comment.id }
    }

    return { id, isPost, type: input.type, where }
  }

  async upsert(user: UserToken, input: UpsertReactInput) {
    const {
      id,
      isPost,
      type,
      where,
    } = await this.validInput(input)

    const reacted = await this.findOne({
      ...where,
      user: { id: user.profile.id },
    })

    if (reacted) {
      // Un reacted
      if (reacted.type === type) {
        if (isPost) {
          await this.postService.changeProperty({ id }, 'totalReacts', 1, 'DECREMENT')
        } else {
          await this.commentService.changeProperty({ id }, 'totalReacts', 1, 'DECREMENT')
        }
        return {
          react: await this.reactRepo.softRemove(reacted)
        }
      } else {
        // Change react
        return {
          react: await this.reactRepo.save({
            type,
            id: reacted.id,
          })
        }
      }
    } else {
      const createdReact = this.reactRepo.create({
        type,
        user: user.profile,
        post: isPost ? { id: id } : null,
        comment: isPost ? null : { id: id }
      })
      if (isPost) {
        await this.postService.changeProperty({ id }, 'totalReacts', 1, 'INCREMENT')
      } else {
        await this.commentService.changeProperty({ id }, 'totalReacts', 1, 'INCREMENT')
      }
      return {
        react: await this.reactRepo.save(createdReact)
      }
    }
  }

  async findAll(query: QueryReactInput) {
    const { 
      type, 
      post: postId, 
      comment: commentId, 
      limit 
    } = query
    const where: FindOptionsWhere<React> = {}

    if (type) {
      where.type = type
    }

    if (postId) {
      where.post = { id: postId }  
    }

    const { data: reacts, total } = await this.find({ where })

    const total = await this.group(where, 'type')
    total.push({
      type: 'ALL',
      total: totalReacts
    })

    return { users, total }
  }

  async postLiked(user: UserToken, postIds: string[]) {
    const where: FindOptionsWhere<React> = {
      user: { id: user.profile.id },
      post: { id: In(postIds) }
    }

    const { data: reacts } = await this.find({ where })

    return reacts
  }
}