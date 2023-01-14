import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserToken } from "apps/auth";
import { CreateReplyInput, UpdateReplyInput } from "apps/forum/dtos";
import { Reply } from "apps/forum/entities";
import { BaseError, BaseService } from "base";
import { FindOptionsWhere, Repository } from "typeorm";
import { BlogService } from "../blog";

const MODULE_NAME = 'Reply'

export const replyRelation = {
  user: true,
  blog: true,
}

@Injectable()
export class ReplyService extends BaseService<Reply> {
  constructor(
    @InjectRepository(Reply) private replyRepo: Repository<Reply>,
    private blogService: BlogService,
  ) { 
    super(replyRepo)
  }

  async create(user: UserToken, input: CreateReplyInput) {
    const { blog: blogId, content } = input
    
    const blog = await this.blogService.findOne({ id: blogId })
    if (!blog) {
      BaseError('Blog', HttpStatus.NOT_FOUND)
    }

    const createdReply = this.replyRepo.create({
      user: user.profile,
      blog,
      content
    })
    await this.replyRepo.save(createdReply)

    return { reply: createdReply }
  }

  async findAll(blogId: string) {
    const where: FindOptionsWhere<Reply> = {}

    where.blog = { id: blogId }

    const { data: replies, total } = await this.find({
      where,
      relations: replyRelation,
    })

    return { replies, total }
  }

  async update(
    user: UserToken,
    id: string,
    input: UpdateReplyInput
  ) {
    const reply = await this.findOne({ id }, replyRelation)
    if (!reply) {
      BaseError(MODULE_NAME, HttpStatus.NOT_FOUND)
    } else if (reply.user.id !== user.profile.id) {
      BaseError(MODULE_NAME, HttpStatus.FORBIDDEN)
    }

    await this.replyRepo.save({
      ...input,
      id,
    })

    const updatedReply = { ...reply, ...input }

    return { reply: updatedReply }
  }

  async remove(user: UserToken, id: string) {
    const reply = await this.findOne({ id }, replyRelation)
    if (!reply) {
      BaseError(MODULE_NAME, HttpStatus.NOT_FOUND)
    } else if (reply.user.id !== user.profile.id) {
      BaseError(MODULE_NAME, HttpStatus.FORBIDDEN)
    }

    await this.replyRepo.softRemove(reply)
  }

  async updateVote(id: string, votes: number) {
    await this.replyRepo.save({
      votes,
      id,
    })
  }
}