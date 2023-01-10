import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserToken } from "apps/auth";
import { FRIEND_STATUS, RELATION_TYPE } from "apps/profiles/constants";
import { CreateRelationInput, QUERY_RELATION_TYPE } from "apps/profiles/dtos/relation";
import { Profile, Relation } from "apps/profiles/entities";
import { BaseService } from "base";
import { userInfo } from "os";
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
      if (type !== RELATION_TYPE.OWNER) {
        await this.relationRepo.remove(existedRelation)
      }
      return
    }

    const createRelation = this.relationRepo.create({
      requester: user.profile,
      user: profile,
      status: type === RELATION_TYPE.FRIEND ? FRIEND_STATUS.REQUESTING : null,
      type,
    })

    await this.relationRepo.save(createRelation)

    return {
      status: HTTP_STATUS.Created,
      relation: createRelation,
    }
  }

  async findAll(user: UserToken, type: QUERY_RELATION_TYPE, status?: FRIEND_STATUS) {
    const { profile } = user
    let where: FindOptionsWhere<Relation> | FindOptionsWhere<Relation>[]
    switch (type) {
      case QUERY_RELATION_TYPE.FRIEND: {
        const queryStatus = status || FRIEND_STATUS.ACCEPTED
        where = [
          { requester: { id: profile.id }, type, status: queryStatus },
          { user: { id: profile.id }, type, status: queryStatus }
        ]
        break
      }
      case QUERY_RELATION_TYPE.FOLLOWER: {
        where = {
          user: { id: profile.id },
          type: RELATION_TYPE.FOLLOW,
        }
        break
      }
      case QUERY_RELATION_TYPE.FOLLOWING: {
        where = {
          requester: { id: profile.id },
          type: RELATION_TYPE.FOLLOW,
        }
        break
      }
      case QUERY_RELATION_TYPE.OWNER:
      case QUERY_RELATION_TYPE.LIKED:
      case QUERY_RELATION_TYPE.BLOCKED: {
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

  async getRelations(user: UserToken) {
    const { total: totalFriends, data: friends = [] } = await this.findAll(user, QUERY_RELATION_TYPE.FRIEND)
    const friend1 = friends.map((x) => x.requester.id)
    const friend2 = friends.map((x) => x.user.id)

    const friendIds = [...friend1, ...friend2]

    const { total: totalPages, data: pages = [] } = await this.findAll(user, QUERY_RELATION_TYPE.LIKED)
    const pageIds = pages.map((x) => x.user.id)

    const { total: totalBlocks, data: blocks = [] } = await this.findAll(user, QUERY_RELATION_TYPE.BLOCKED)
    const blockedIds = blocks.map((x) => x.user.id)

    const { total: totalFollowers, data: followers = [] } = await this.findAll(user, QUERY_RELATION_TYPE.FOLLOWER)
    const followerIds = followers.map((x) => x.requester.id)

    const { total: totalFollowing, data: following = [] } = await this.findAll(user, QUERY_RELATION_TYPE.FOLLOWING)
    const followingIds = following.map((x) => x.user.id)

    const data = {
      friendIds,
      pageIds,
      blockedIds,
      followerIds,
      followingIds,
    }

    const total = {
      totalFriends,
      totalBlocks,
      totalPages,
      totalFollowers,
      totalFollowing,
    }

    return { data, total }
  }

  async update(user: UserToken, id: string) {
    const relation = await this.findOne({ id }, relateRelations)
    if (!relation) {
      return { status: HTTP_STATUS.Not_Found }
    }

    if (
      relation.user.id !== user.profile.id
      && relation.type !== RELATION_TYPE.FRIEND
    ) {
      return { status: HTTP_STATUS.Forbidden }
    }

    await this.relationRepo.save({
      status: FRIEND_STATUS.ACCEPTED,
      id,
    })

    return { status: HTTP_STATUS.OK }
  }

  async remove(user: UserToken, id: string) {
    const relation = await this.findOne({ id }, relateRelations)
    if (!relation) {
      return { status: HTTP_STATUS.Not_Found }
    }

    if (
      relation.user.id !== user.profile.id
      || relation.requester.id !== user.profile.id
    ) {
      return { status: HTTP_STATUS.Forbidden }
    }

    await this.relationRepo.remove(relation)

    return { status: HTTP_STATUS.OK }
  }
}