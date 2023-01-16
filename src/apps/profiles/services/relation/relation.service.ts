import { forwardRef, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserToken } from "apps/auth";
import { FRIEND_STATUS, RELATION_TYPE } from "apps/profiles/constants";
import { CreateRelationInput, QUERY_RELATION_TYPE } from "apps/profiles/dtos/relation";
import { Relation } from "apps/profiles/entities";
import { BaseError, BaseService } from "base";
import { FindOptionsWhere, Repository } from "typeorm";
import { TableName } from "utils";
import { ProfileService } from "../profile";

export const relateRelations = {
  requester: true,
  user: true,
}

@Injectable()
export class RelationService extends BaseService<Relation> {
  constructor(
    @InjectRepository(Relation) private relationRepo: Repository<Relation>,
    @Inject(forwardRef(() => ProfileService)) private profileService: ProfileService,
  ) {
    super(relationRepo, relateRelations)
  }

  async create(user: UserToken, input: CreateRelationInput) {
    const { user: userId, type } = input

    const profile = await this.profileService.findOne({ id: userId })
    if (!profile) {
      BaseError(TableName.PROFILE, HttpStatus.NOT_FOUND)
    }

    const existedRelation = await this.findOne({
      requester: { id: user.profile.id },
      user: { id: profile.id },
      type,
    })
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

    const { data: relations, total} = await this.find({
      where,
    })

    return { relations, total }
  }

  async getRelations(user: UserToken) {
    const { total: totalFriends, relations: friendRaws = [] } = await this.findAll(user, QUERY_RELATION_TYPE.FRIEND)
    const friend1 = friendRaws.map((x) => x.requester)
    const friend2 = friendRaws.map((x) => x.user)

    const friends = [...friend1, ...friend2]

    const { total: totalPages, relations: pageRaws = [] } = await this.findAll(user, QUERY_RELATION_TYPE.LIKED)
    const pages = pageRaws.map((x) => x.user)

    const { total: totalBlocks, relations: blockRaws = [] } = await this.findAll(user, QUERY_RELATION_TYPE.BLOCKED)
    const blocks = blockRaws.map((x) => x.user)

    const { total: totalFollowers, relations: followerRaws = [] } = await this.findAll(user, QUERY_RELATION_TYPE.FOLLOWER)
    const followers = followerRaws.map((x) => x.requester)

    const { total: totalFollowing, relations: followingRaw = [] } = await this.findAll(user, QUERY_RELATION_TYPE.FOLLOWING)
    const followings = followingRaw.map((x) => x.user)

    const relations = {
      friends,
      pages,
      blocks,
      followers,
      followings,
    }

    const total = {
      totalFriends,
      totalBlocks,
      totalPages,
      totalFollowers,
      totalFollowing,
    }

    return { relations, total }
  }

  async update(user: UserToken, id: string) {
    const relation = await this.findOne({ id })
    if (!relation) {
      BaseError(TableName.RELATION, HttpStatus.NOT_FOUND)
    }

    if (
      relation.user.id !== user.profile.id
      && relation.type !== RELATION_TYPE.FRIEND
    ) {
      BaseError(TableName.RELATION, HttpStatus.FORBIDDEN)
    }

    await this.relationRepo.save({
      status: FRIEND_STATUS.ACCEPTED,
      id,
    })

    return { 
      relation: {
        ...relation,
        status: FRIEND_STATUS.ACCEPTED,
      }
    }
  }

  async remove(user: UserToken, id: string) {
    const relation = await this.findOne({ id })
    if (!relation) {
      BaseError(TableName.RELATION, HttpStatus.NOT_FOUND)
    }

    if (
      relation.user.id !== user.profile.id
      || relation.requester.id !== user.profile.id
    ) {
      BaseError(TableName.RELATION, HttpStatus.FORBIDDEN)
    }

    return { 
      relation: await this.relationRepo.softRemove(relation)
    }
  }
}