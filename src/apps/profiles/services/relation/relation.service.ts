import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToken } from 'apps/auth';
import { FRIEND_STATUS, RELATION_TYPE } from 'apps/profiles/constants';
import {
  UpsertRelationInput,
  QUERY_RELATION_TYPE,
} from 'apps/profiles/dtos/relation';
import { FriendRelationInput } from 'apps/profiles/dtos/relation/friend-relation.input';
import { Profile, Relation } from 'apps/profiles/entities';
import { BaseError, BaseService } from 'base';
import { Any, FindOptionsWhere, IsNull, Not, Repository } from 'typeorm';
import { TableName } from 'utils';
import { ProfileService } from '../profile';

export const relateRelations = {
  requester: true,
  user: true,
};

@Injectable()
export class RelationService extends BaseService<Relation> {
  constructor(
    @InjectRepository(Relation) private relationRepo: Repository<Relation>,
    @Inject(forwardRef(() => ProfileService))
    private profileService: ProfileService,
  ) {
    super(relationRepo, relateRelations);
  }

  async create(user: UserToken, input?: UpsertRelationInput) {
    const { user: userId, type } = input;

    const profile = await this.profileService.findOne({ id: userId });
    if (!profile) {
      BaseError(TableName.PROFILE, HttpStatus.NOT_FOUND);
    }

    const existedRelation = await this.findOne({
      requester: { id: user.profile.id },
      user: { id: profile.id },
      type,
    });
    if (existedRelation) {
      if (type !== RELATION_TYPE.OWNER) {
        await this.relationRepo.softRemove(existedRelation);
      }
      return;
    }

    const createRelation = this.relationRepo.create({
      requester: user.profile,
      user: profile,
      status: type === RELATION_TYPE.FRIEND ? FRIEND_STATUS.REQUESTING : null,
      type,
    });

    await this.relationRepo.save(createRelation);

    return {
      relation: createRelation,
    };
  }

  async findAll(
    user: UserToken,
    type: QUERY_RELATION_TYPE,
    status?: FRIEND_STATUS,
  ) {
    const { profile } = user;
    let where: FindOptionsWhere<Relation> | FindOptionsWhere<Relation>[];
    switch (type) {
      case QUERY_RELATION_TYPE.FRIEND: {
        const queryStatus = status || FRIEND_STATUS.ACCEPTED;
        where = [
          {
            requester: { id: profile.id },
            type,
            status: queryStatus ? Any([queryStatus]) : Not(IsNull()),
          },
          {
            user: { id: profile.id },
            type,
            status: queryStatus ? Any([queryStatus]) : Not(IsNull()),
          },
        ];
        break;
      }
      case QUERY_RELATION_TYPE.FOLLOWER: {
        where = {
          user: { id: profile.id },
          type: RELATION_TYPE.FOLLOW,
        };
        break;
      }
      case QUERY_RELATION_TYPE.FOLLOWING: {
        where = {
          requester: { id: profile.id },
          type: RELATION_TYPE.FOLLOW,
        };
        break;
      }
      case QUERY_RELATION_TYPE.OWNER:
      case QUERY_RELATION_TYPE.LIKED:
      case QUERY_RELATION_TYPE.BLOCKED: {
        where = {
          requester: { id: profile.id },
          type,
        };
        break;
      }
    }

    const { data: relations, total } = await this.find({
      where,
    });

    return { relations, total };
  }

  async getRelations(user: UserToken) {
    const { total: totalFriends, relations: friendRaws = [] } =
      await this.findAll(user, QUERY_RELATION_TYPE.FRIEND);
    const friend1 = friendRaws.map((x) => x.requester);
    const friend2 = friendRaws.map((x) => x.user);

    const friends = [...friend1, ...friend2];

    const { total: totalPages, relations: pageRaws = [] } = await this.findAll(
      user,
      QUERY_RELATION_TYPE.LIKED,
    );
    const pages = pageRaws.map((x) => x.user);

    const { total: totalBlocks, relations: blockRaws = [] } =
      await this.findAll(user, QUERY_RELATION_TYPE.BLOCKED);
    const blocks = blockRaws.map((x) => x.user);

    const { total: totalFollowers, relations: followerRaws = [] } =
      await this.findAll(user, QUERY_RELATION_TYPE.FOLLOWER);
    const followers = followerRaws.map((x) => x.requester);

    const { total: totalFollowing, relations: followingRaw = [] } =
      await this.findAll(user, QUERY_RELATION_TYPE.FOLLOWING);
    const followings = followingRaw.map((x) => x.user);

    const relations = {
      friends,
      pages,
      blocks,
      followers,
      followings,
    };

    const total = {
      totalFriends,
      totalBlocks,
      totalPages,
      totalFollowers,
      totalFollowing,
    };

    return { relations, total };
  }

  async update(user: UserToken, id: string) {
    const relation = await this.findOne({ id });
    if (!relation) {
      BaseError(TableName.RELATION, HttpStatus.NOT_FOUND);
    }

    if (
      relation.user.id !== user.profile.id &&
      relation.type !== RELATION_TYPE.FRIEND
    ) {
      BaseError(TableName.RELATION, HttpStatus.FORBIDDEN);
    }

    await this.relationRepo.save({
      status: FRIEND_STATUS.ACCEPTED,
      id,
    });

    return {
      relation: {
        ...relation,
        status: FRIEND_STATUS.ACCEPTED,
      },
    };
  }

  async remove(user: UserToken, id: string) {
    const relation = await this.findOne({ id });
    if (!relation) {
      BaseError(TableName.RELATION, HttpStatus.NOT_FOUND);
    }

    if (
      relation.user.id !== user.profile.id &&
      relation.requester.id !== user.profile.id
    ) {
      BaseError(TableName.RELATION, HttpStatus.FORBIDDEN);
    }

    return {
      relation: await this.relationRepo.softRemove(relation),
    };
  }

  async isFriend(user: UserToken, profile: Profile) {
    const relation = await this.findOne([
      {
        requester: { id: user.profile.id },
        user: { id: profile.id },
        type: RELATION_TYPE.FRIEND,
      },
      {
        requester: { id: profile.id },
        user: { id: user.profile.id },
        type: RELATION_TYPE.FRIEND,
      },
    ]);
    return relation ? true : false;
  }

  async validFriendInput(user: UserToken, input: FriendRelationInput) {
    const { user: userId, status } = input;

    const profile = await this.profileService.findOne({ id: userId });
    if (!profile) {
      BaseError(TableName.PROFILE, HttpStatus.NOT_FOUND);
    }

    if (user.profile.id === profile.id) {
      BaseError(TableName.USER, HttpStatus.CONFLICT);
    }

    const friendRelation = await this.findOne({
      requester: { id: profile.id  },
      user: { id: user.profile.id },
      type: RELATION_TYPE.FRIEND,
    });
    if(friendRelation && status === FRIEND_STATUS.REQUESTING) {
      BaseError(TableName.USER, HttpStatus.CONFLICT);
    }

    const existedRelation = await this.findOne({
      requester: { id: user.profile.id },
      user: { id: profile.id },
      type: RELATION_TYPE.FRIEND,
    });
    console.log('existedRelation',existedRelation);
    console.log('friendRelation',friendRelation);
    
    return {
      relation: existedRelation ? existedRelation : friendRelation,
      profile,
      status,
    };
  }

  async validInput(input: UpsertRelationInput, user: UserToken) {
    const { user: userId, type, status, expiredAt } = input;

    const profile = await this.profileService.findOne({ id: userId });
    if (!profile) {
      BaseError(TableName.PROFILE, HttpStatus.NOT_FOUND);
    }

    if (user.profile.id === profile.id) {
      BaseError(TableName.USER, HttpStatus.CONFLICT);
    }

    if (
      type === RELATION_TYPE.SNOOZE && expiredAt &&
      new Date(expiredAt).getTime() < new Date().getTime()
    ) {
      BaseError(TableName.RELATION, HttpStatus.FORBIDDEN);
    }

    const existedRelation = await this.findOne({
      requester: { id: user.profile.id },
      user: { id: profile.id },
      type,
    });

    if (
      existedRelation &&
      (type === RELATION_TYPE.BLOCKED ||
        type === RELATION_TYPE.FOLLOW ||
        type === RELATION_TYPE.LIKED ||
        type === RELATION_TYPE.SNOOZE) &&
      status !== FRIEND_STATUS.REJECT
    ) {
      BaseError(TableName.RELATION, HttpStatus.FORBIDDEN);
    }

    return {
      relation: existedRelation,
      type: input.type,
      profile,
      status,
    };
  }

  async addFriend(user: UserToken, input: FriendRelationInput) {
    const { relation, profile, status } = await this.validFriendInput(
      user,
      input,
    );

    if (relation) {
      if (status === FRIEND_STATUS.REJECT) {
        return { relationRemove: await this.relationRepo.softRemove(relation) };
      }
      if(status === FRIEND_STATUS.ACCEPTED) {
           return await this.relationRepo.save({
          ...relation,
          id: relation.id,
          status: FRIEND_STATUS.ACCEPTED,
        });
      } 
      return;
    } else {
      const friend = await this.findOne({
        requester: { id: profile.id },
        user: { id: user.profile.id },
        type: RELATION_TYPE.FRIEND,
        status: FRIEND_STATUS.REQUESTING,
      });
      if (friend) {
        return { relationRemove: await this.relationRepo.softRemove(relation) };
      }
    }
    const createRelation = this.relationRepo.create({
      requester: user.profile,
      user: profile,
      status,
      type: RELATION_TYPE.FRIEND,
    });

    await this.relationRepo.save(createRelation);

    return {
      relation: createRelation,
    };
  }

  async upsert(user: UserToken, input: UpsertRelationInput) {
    const { relation, type, profile, status } =
      await this.validInput(input, user);
    if (relation) {
      if (type !== RELATION_TYPE.OWNER && status === FRIEND_STATUS.REJECT) {
        return { relationRemove: await this.relationRepo.softRemove(relation) };
      }
      return;
    }

    const createRelation = this.relationRepo.create({
      requester: user.profile,
      user: profile,
      expiredAt: type === RELATION_TYPE.SNOOZE ? input.expiredAt : null,
      status,
      type,
    });

    await this.relationRepo.save(createRelation); 

    return {
      relation: createRelation,
    };
  }
}
