import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserToken } from "apps/auth";
import { UpsertReactInput } from "apps/posts/dtos";
import { React } from "apps/posts/entities";
import { BaseService } from "base";
import { Repository } from "typeorm";
import { HTTP_STATUS } from "utils";
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
    super(reactRepo)
  }

  async upsert(user: UserToken, input: UpsertReactInput) {
    const { type, post: postId, comment: commentId } = input

    if (postId) {
      const post = await this.postService.findOne({ id: postId })
      if (!post) {
        return {
          status: HTTP_STATUS.Not_Found
        }
      }

      let total = post.totalReacts || 0
      const reacted = await this.findOne({
        post: { id: post.id },
        user: { id: user.profile.id }
      })

      if (reacted) {
        if (reacted.type === type) {
          await this.reactRepo.remove(reacted)
          total = total - 1
        } else {
          await this.reactRepo.save({
            type,
            id: reacted.id,
          })
        }
      } else {
        const createdReact = this.reactRepo.create({
          post,
          user: user.profile,
          type,
        })
        await this.reactRepo.save(createdReact)
        total = total + 1
      }
      await this.postService.incrementReacts(post.id, total)
    }
    if (commentId) {
      const comment = await this.commentService.findOne({ id: commentId })
      if (!comment) {
        return {
          status: HTTP_STATUS.Not_Found
        }
      }

      let total = comment.totalReacts || 0
      const reacted = await this.findOne({
        comment: { id: comment.id },
        user: { id: user.profile.id }
      })

      if (reacted) {
        if (reacted.type === type) {
          await this.reactRepo.remove(reacted)
          total = total - 1
        } else {
          await this.reactRepo.save({
            type,
            id: reacted.id,
          })
        }
      } else {
        const createdReact = this.reactRepo.create({
          comment,
          user: user.profile,
          type,
        })
        await this.reactRepo.save(createdReact)
        total = total + 1
      }
      await this.commentService.incrementReacts(comment.id, total)
    }

    return { status: HTTP_STATUS.Created }
  }
}