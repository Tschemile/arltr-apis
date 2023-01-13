import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserToken } from "apps/auth";
import { CreateCommentInput, UpdateCommentInput } from "apps/posts/dtos";
import { Comment, Post } from "apps/posts/entities";
import { BaseService } from "base";
import { FindOptionsWhere, Repository } from "typeorm";
import { HTTP_STATUS } from "utils";
import { PostService } from "../post";

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
      return {
        status: HTTP_STATUS.Not_Found
      }
    }

    const createdComment = this.commentRepo.create({
      ...input,
      user: user.profile,
      post,
    })
    await this.commentRepo.save(createdComment)
    const total = post.totalComments || 0
    await this.postService.incrementComments(post.id, total + 1)

    return {
      status: HTTP_STATUS.Created,
      comment: createdComment,
    }
  }

  async findAll(postId: string, take?: number) {
    const where: FindOptionsWhere<Comment> = {}
    where.post = { id: postId }

    const { data: comments, total } = await this.find({
      where,
      relations: commentRelation,
      take,
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
      return {
        status: HTTP_STATUS.Not_Found
      }
    }

    if (comment.user.id !== user.profile.id) {
      return {
        status: HTTP_STATUS.Forbidden
      }
    }

    await this.commentRepo.save({
      ...input,
      id,
    })

    return {
      status: HTTP_STATUS.OK,
      comment: { ...comment, ...input }
    }
  }

  async remove(user: UserToken, id: string) {
    const comment = await this.findOne({ id }, commentRelation)
    if (!comment) {
      return {
        status: HTTP_STATUS.Not_Found
      }
    }

    if (comment.user.id !== user.profile.id) {
      return {
        status: HTTP_STATUS.Forbidden
      }
    }

    await this.commentRepo.softRemove(comment)

    const total = comment.post.totalComments || 0
    await this.postService.incrementComments(comment.post.id, total - 1)

    return {
      status: HTTP_STATUS.OK,
    }
  }

  async incrementReacts(id: string, total: number) {
    await this.commentRepo.save({
      id,
      totalReacts: total,
    })
  }
}