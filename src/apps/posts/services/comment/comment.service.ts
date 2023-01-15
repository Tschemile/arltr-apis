import { forwardRef, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserToken } from "apps/auth";
import { CreateCommentInput, UpdateCommentInput } from "apps/posts/dtos";
import { Comment } from "apps/posts/entities";
import { BaseError, BaseService } from "base";
import { FindOptionsWhere, Repository } from "typeorm";
import { PostService } from "../post";

const MODULE_NAME = 'Comment'

export const commentRelation = {
  user: true,
  post: true,
}

@Injectable()
export class CommentService extends BaseService<Comment> {
  constructor(
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @Inject(forwardRef(() => PostService)) private postService: PostService,
  ) {
    super(commentRepo)
  }

  async create(user: UserToken, input: CreateCommentInput) {
    const { post: postId } = input

    const post = await this.postService.findOne({ id: postId })
    if (!post) {
      BaseError(`Post`, HttpStatus.NOT_FOUND)
    }

    const createdComment = this.commentRepo.create({
      ...input,
      user: user.profile,
      post,
    })
    await this.commentRepo.save(createdComment)
    const total = post.totalComments || 0
    await this.postService.changeProperty({ id: post.id }, 'totalComments', total, 'INCREMENT')

    return {
      comment: createdComment,
    }
  }

  async findAll(postId: string, limit?: number) {
    const where: FindOptionsWhere<Comment> = {}
    where.post = { id: postId }

    const { data: comments, total } = await this.find({
      where,
      relations: commentRelation,
      limit,
    })

    return { comments, total }
  }

  async update(
    user: UserToken,
    id: string,
    input: UpdateCommentInput,
  ) {
    const comment = await this.findOne({ id }, commentRelation)
    if (!comment) {
      BaseError(MODULE_NAME, HttpStatus.NOT_FOUND)
    }

    if (comment.user.id !== user.profile.id) {
      BaseError(MODULE_NAME, HttpStatus.FORBIDDEN)
    }

    await this.commentRepo.save({
      ...input,
      id,
    })

    return {
      comment: { ...comment, ...input }
    }
  }

  async remove(user: UserToken, id: string) {
    const comment = await this.findOne({ id }, commentRelation)
    if (!comment) {
      BaseError(MODULE_NAME, HttpStatus.NOT_FOUND)
    }

    if (comment.user.id !== user.profile.id) {
      BaseError(MODULE_NAME, HttpStatus.FORBIDDEN)
    }

    await this.commentRepo.softRemove(comment)

    const total = comment.post.totalComments || 0
    await this.postService.changeProperty({ id: comment.post.id }, 'totalComments', total - 1, 'DECREMENT')
  }

  async incrementReacts(id: string, total: number) {
    await this.commentRepo.save({
      id,
      totalReacts: total,
    })
  }
}