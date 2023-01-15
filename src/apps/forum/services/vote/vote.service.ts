import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserToken } from "apps/auth";
import { UpsertVoteInput } from "apps/forum/dtos";
import { Vote } from "apps/forum/entities";
import { BaseError, BaseService } from "base";
import { FindOptionsWhere, Repository } from "typeorm";
import { TableName } from "utils";
import { BlogService } from "../blog";
import { ReplyService } from "../reply";

export const voteRelations = {
  user: true,
  blog: true,
  reply: true,
}

@Injectable()
export class VoteService extends BaseService<Vote> {
  constructor(
    @InjectRepository(Vote) private voteRepo: Repository<Vote>,
    private blogService: BlogService,
    private replyService: ReplyService,
  ) {
    super(voteRepo)
  }

  async validInput(input: UpsertVoteInput) {
    let id: string
    let isBlog: boolean

    const where: FindOptionsWhere<Vote> = {}

    const { blog: blogId, reply: replyId } = input
    if (blogId) {
      const blog = await this.blogService.findOne({ id: blogId })
      if (!blog) {
        BaseError(TableName.BLOG, HttpStatus.NOT_FOUND)
      }

      id = blog.id
      isBlog = true
      where.blog = { id: blog.id }
    }
    if (replyId) {
      const reply = await this.replyService.findOne({ id: replyId })
      if (!reply) {
        BaseError(TableName.REPLY, HttpStatus.NOT_FOUND)
      }

      id = reply.id
      isBlog = false
      where.reply = { id: reply.id }
    }

    return { id, isBlog, where, vote: input.vote }
  }

  async upsert(user: UserToken, input: UpsertVoteInput) {
    const {
      id,
      isBlog,
      vote,
      where,
    } = await this.validInput(input)

    const voted = await this.findOne({
      ...where,
      user: { id: user.profile.id },
    }, voteRelations)

    if (voted) {
      if (voted.vote) {
        if (isBlog) {
          await this.blogService.changeProperty({ id }, 'votes', vote ? 1 : 2, 'DECREMENT')
        } else {
          await this.replyService.changeProperty({ id }, 'votes', vote ? 1 : 2, 'DECREMENT')
        }
        return vote
          ? await this.voteRepo.softRemove(voted)
          : await this.voteRepo.save({
            vote,
            id: voted.id,
          })
      } else {
        if (isBlog) {
          await this.blogService.changeProperty({ id }, 'votes', vote ? 2 : 1, 'INCREMENT')
        } else {
          await this.replyService.changeProperty({ id }, 'votes', vote ? 2 : 1, 'INCREMENT')
        }
        return vote
          ? await this.voteRepo.save({
            vote,
            id: voted.id,
          })
          : await this.voteRepo.softRemove(voted)
      }
    } else {
      const createdVote = this.voteRepo.create({
        user: user.profile,
        vote,
      })
      if (vote) {
        if (isBlog) {
          await this.blogService.changeProperty({ id }, 'votes', 1, 'DECREMENT')
        } else {
          await this.replyService.changeProperty({ id }, 'votes', 1, 'DECREMENT')
        }
      } else {
        if (isBlog) {
          await this.blogService.changeProperty({ id }, 'votes', 1, 'INCREMENT')
        } else {
          await this.replyService.changeProperty({ id }, 'votes', 1, 'INCREMENT')
        }
      }
      return await this.voteRepo.save(createdVote)
    }
  }
}