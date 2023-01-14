import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserToken } from "apps/auth";
import { UpsertVoteInput } from "apps/forum/dtos";
import { Vote } from "apps/forum/entities";
import { BaseError, BaseService } from "base";
import { Repository } from "typeorm";
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

  async upsert(user: UserToken, input: UpsertVoteInput) {
    const { vote, blog: blogId, reply: replyId } = input

    if (blogId) {
      const blog = await this.blogService.findOne({ id: blogId })
      if (!blog) {
        BaseError('Blog', HttpStatus.NOT_FOUND)
      }
  
      let total = blog.votes || 0
  
      const voted = await this.findOne({
        user: { id: user.profile.id },
        blog: { id: blog.id }
      }, voteRelations)
  
      if (voted) {
        if (voted.vote === vote) {
          await this.voteRepo.remove(voted)
          total = vote ? total - 1 : total + 1
        } else {
          await this.voteRepo.save({
            vote,
            id: voted.id,
          })
          total = vote ? total + 2 : total - 2
        }
      } else {
        const createdVote = this.voteRepo.create({
          user: user.profile,
          blog,
          vote,
        })
        await this.voteRepo.save(createdVote)
        total = vote ? total + 1 : total - 1
      }
  
      await this.blogService.updateVote(blog.id, total)
    }
    if (replyId) {
      const reply = await this.replyService.findOne({ id: replyId })
      if (!reply) {
        BaseError('Reply', HttpStatus.NOT_FOUND)
      }
  
      let total = reply.votes || 0
  
      const voted = await this.findOne({
        user: { id: user.profile.id },
        reply: { id: reply.id }
      }, voteRelations)
  
      if (voted) {
        if (voted.vote === vote) {
          await this.voteRepo.remove(voted)
          total = vote ? total - 1 : total + 1
        } else {
          await this.voteRepo.save({
            vote,
            id: voted.id,
          })
          total = vote ? total + 2 : total - 2
        }
      } else {
        const createdVote = this.voteRepo.create({
          user: user.profile,
          reply,
          vote,
        })
        await this.voteRepo.save(createdVote)
        total = vote ? total + 1 : total - 1
      }
  
      await this.replyService.updateVote(reply.id, total)
    }
  }
}