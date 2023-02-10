import { forwardRef, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment, Post, Tag } from "apps/posts/entities";
import { ProfileService } from "apps/profiles";
import { BaseError, BaseService } from "base";
import { DeepPartial, FindOptionsWhere, In, Repository } from "typeorm";
import { ModuleName } from "utils";

export const tagRelation = {
  user: true,
  post: true,
  comment: true,
}

@Injectable()
export class TagService extends BaseService<Tag> {
  constructor(
    @InjectRepository(Tag) private tagRepo: Repository<Tag>,
    @Inject(forwardRef(() => ProfileService)) private profileService: ProfileService,
  ) {
    super(tagRepo, tagRelation)
  }

  async create({
    tags,
    post,
    comment,
  }: {
    tags: string[],
    post?: Post,
    comment?: Comment,
  }) {
    let isPost = post ? true : false
    
    if (!isPost && !comment) {
      BaseError(ModuleName.POST, HttpStatus.BAD_REQUEST)
    }

    const { data: profiles, total } = await this.profileService.find({
      where: { id: In(tags) }
    })

    if (total !== tags.length) {
      BaseError(ModuleName.PROFILE, HttpStatus.NOT_FOUND)
    }

    const createTags: DeepPartial<Tag>[] = []
    for (const user of profiles) {
      createTags.push({
        user,
        post: isPost ? post : null,
        comment: isPost ? null : comment,
      })  
    }

    return await this.insertMultiple(createTags)
  }

  async findAll(ids: string[], type: 'COMMENT' | 'POST') {
    const where: FindOptionsWhere<Tag> = {}

    switch (type) {
      case 'POST': {
        where.post = { id: In(ids) }
        break
      }
      case 'COMMENT': {
        where.comment = { id: In(ids) }
      }
    }

    const { data: tags } = await this.find({ where })

    return tags
  }

  async remove({
    tags,
    post,
    comment,
  }: {
    tags: string[],
    post?: Post,
    comment?: Comment,
  }) {
    const where: FindOptionsWhere<Tag> = {
      user: { id: In(tags) }
    }

    if (post) {
      where.post = { id: post.id }
    } else {
      where.comment = { id: comment.id }
    }

    const { data } = await this.find({ where })

    return await this.tagRepo.remove(data)
  }
}