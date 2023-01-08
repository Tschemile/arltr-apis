import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserToken } from "apps/auth";
import { FRIEND_STATUS, RELATION_TYPE } from "apps/profiles/constants";
import { CreateRelationInput } from "apps/profiles/dtos/relation";
import { Profile, Relation } from "apps/profiles/entities";
import { BaseService } from "base";
import { FindOptionsWhere, Repository } from "typeorm";
import { HTTP_STATUS } from "utils";
import { ProfileService } from "../profile";

export const relateRelations = {
  requester: true,
  user: true,
}

@Injectable()
export class RelationService extends BaseService<Relation> {
  constructor(
    @InjectRepository(Relation) private relationRepo: Repository<Relation>,
    private profileService: ProfileService,
  ) { 
    super(relationRepo)
  }

  async create(user: UserToken, input: CreateRelationInput) {
    const { user: userId, type } = input

    const profile = await this.profileService.findOne({ id: userId })
    if (!profile) {
      return {
        status: HTTP_STATUS.Not_Found,
        message: 'Profile not found'
      }
    }

    const existedRelation = await this.findOne({
      requester: { id: user.profile.id },
      user: { id: profile.id },
      type,
    }, relateRelations)
    if (existedRelation) {
      if (type !== RELATION_TYPE.OWNER)  {
        await this.relationRepo.remove(existedRelation)
      }
      return
    }

    const createRelation = this.relationRepo.create({
      requester: user.profile,
      user: profile,
      type,
    })

    await this.relationRepo.save(profile)

    return {
      status: HTTP_STATUS.Created,
      relation: createRelation,
    }
  }

  async findAll(user: UserToken, type: RELATION_TYPE) {
    const { profile } = user
    let where: FindOptionsWhere<Relation> | FindOptionsWhere<Relation>[]
    switch (type) {
      case RELATION_TYPE.FRIEND: {
        const status = FRIEND_STATUS.ACCEPTED
        where = [
          { requester: { id: profile.id }, type, status },
          { user: { id: profile.id }, type, status }
        ]
        break
      }
      case RELATION_TYPE.FOLLOW: {
        where = {
          user: { id: profile.id },
          type,
        }
        break
      }
      case RELATION_TYPE.OWNER:
      case RELATION_TYPE.LIKED:
      case RELATION_TYPE.BLOCKED: {
        where = {
          requester: { id: profile.id },
          type,
        }
        break
      }
    }

    const [data, total] = await Promise.all([
      this.relationRepo.find({
        relations: relateRelations,
        where,
      }),
      this.relationRepo.count({ where })
    ])

    return { data, total }
  }

  async countByProfile(profile: Profile) {
    const group = await this.relationRepo.createQueryBuilder('relation')
      .where("relation.requesterId = :profileId OR relation.userId = :profileId",
        { profileId: profile.id }
      )
      .groupBy('type')
      .getManyAndCount()

    return group
  }
}