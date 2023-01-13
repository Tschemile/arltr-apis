import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserToken } from "apps/auth";
import { CreateReplyInput, UpdateReplyInput } from "apps/forum/dtos";
import { Reply } from "apps/forum/entities";
import { BaseService } from "base";
import { FindOptionsWhere, Repository } from "typeorm";
import { HTTP_STATUS } from "utils";
import { BlogService } from "../blog";

const replyRelation = {
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
    const { status, data: reply } = await this.validUpsert(
      { id },
      { user: { id: user.profile.id }},
      replyRelation,
    )
    if (status !== HTTP_STATUS.OK) {
      return { status }
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
    const { status, data: reply } = await this.validUpsert(
      { id },
      { user: { id: user.profile.id }},
      replyRelation,
    )
    if (status !== HTTP_STATUS.OK) {
      return { status }
    }

    await this.replyRepo.softRemove(reply)

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