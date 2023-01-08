import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserToken } from "apps/auth";
import { CreateReplyInput, UpdateReplyInput } from "apps/forum/dtos";
import { Reply } from "apps/forum/entities";
import { FindOptionsWhere, Repository } from "typeorm";
import { HTTP_STATUS } from "utils";
import { BlogService } from "../blog";

const relations = {
  user: true,
  blog: true,
}

@Injectable()
export class ReplyService {
  constructor(
    @InjectRepository(Reply) private replyRepo: Repository<Reply>,
    private blogService: BlogService,
  ) { }

  async findOne(where: FindOptionsWhere<Reply> | FindOptionsWhere<Reply>[]) {
    const reply = await this.replyRepo.findOne({ relations, where })
    return reply
  }

  async create(user: UserToken, input: CreateReplyInput) {
    const { blog: blogId, content } = input
    
    const blog = await this.blogService.findOne({ id: blogId })
    if (!blog) {
      return {
        status: HTTP_STATUS.Not_Found,
      }
    }

    const createdReply = this.replyRepo.create({
      user: user.profile,
      blog,
      content
    })
    await this.replyRepo.save(createdReply)

    return {
      status: HTTP_STATUS.Created,
      reply: createdReply
    }
  }

  async findAll(blogId: string) {
    const where: FindOptionsWhere<Reply> = {
      isDeleted: false,
    }

    where.blog = { id: blogId }

    const [replies, total] = await Promise.all([
      this.replyRepo.find({ relations, where }),
      this.replyRepo.count({ where })
    ])

    return { replies, total }
  }

  async update(
    user: UserToken,
    id: string,
    input: UpdateReplyInput
  ) {
    const reply = await this.findOne({ id })
    if (!reply) {
      return { 
        status: HTTP_STATUS.Not_Found 
      }
    } else if (reply.user.id !== user.profile.id) {
      return { 
        status: HTTP_STATUS.Forbidden 
      }
    }

    await this.replyRepo.save({
      ...input,
      id,
    })

    const updatedReply = { ...reply, ...input }

    return {
      status: HTTP_STATUS.OK,
      reply: updatedReply
    }
  }

  async remove(user: UserToken, id: string) {
    const reply = await this.findOne({ id })
    if (!reply) {
      return { 
        status: HTTP_STATUS.Not_Found 
      }
    } else if (reply.user.id !== user.profile.id) {
      return { 
        status: HTTP_STATUS.Forbidden 
      }
    }

    await this.replyRepo.save({
      isDeleted: true,
      deletedAt: new Date(),
      id,
    })

    return {
      status: HTTP_STATUS.OK,
    }
  }

  async updateVote(id: string, votes: number) {
    await this.replyRepo.save({
      votes,
      id,
    })
  }
}