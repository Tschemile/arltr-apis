import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToken } from 'apps/auth';
import { GROUP_MODE, MEMBER_ROLE, MEMBER_WITH_GROUP, QUERY_GROUP_TYPE, QUERY_MEMBER_TYPE } from 'apps/groups/constants';
import { CreateGroupInput, QueryGroupInput, UpdateGroupInput } from 'apps/groups/dtos';
import { Group } from 'apps/groups/entities';
import { ProfileService } from 'apps/profiles';
import { BaseError, BaseService } from 'base';
import { FindOptionsWhere, In, Like, Not, Repository } from 'typeorm';
import { generateSlug, TableName } from 'utils';
import { MemberService } from '../member';

@Injectable()
export class GroupService extends BaseService<Group> {
  constructor(
    @InjectRepository(Group) private groupRepo: Repository<Group>,
    @Inject(forwardRef(() => MemberService)) private memberService: MemberService,
    @Inject(forwardRef(() => ProfileService)) private profileService: ProfileService,
  ) {
    super(groupRepo, {})
  }

  async create(user: UserToken, input: CreateGroupInput) {
    const createdGroup = this.groupRepo.create({
      ...input,
      slug: generateSlug(input.name),
      total: 1,
    })
    await this.groupRepo.save(createdGroup)

    const { member } = await this.memberService.create(user, {
      user: user.profile.id,
      group: createdGroup.id,
      role: MEMBER_ROLE.ADMIN,
    })

    return {
      group: {
        ...createdGroup,
        members: [member],
      },
    }
  }

  async findAll(user: UserToken, query: QueryGroupInput) {
    const where: FindOptionsWhere<Group> = {}
    const { mode, type, limit, search } = query

    if (search) {
      where.name = Like(`%${search}%`)
    }

    switch (type) {
      case QUERY_GROUP_TYPE.COMMUNICATE: {
        where.mode = Not(GROUP_MODE.HIDDEN)
        break
      }
      case QUERY_GROUP_TYPE.USER: {
        const { user: userId } = query
        const profile = await this.profileService.findOne({ id: userId })
        if (!profile) {
          BaseError(TableName.PROFILE, HttpStatus.NOT_FOUND)
        }

        const { members: memberOfUser } = await this.memberService.findAll(user, {
          type: QUERY_MEMBER_TYPE.USER,
          user: profile.id,
          status: MEMBER_WITH_GROUP.IN,
        })
        if (memberOfUser.length > 0) {
          const groupIds = memberOfUser.map((x) => x?.group?.id)
          where.id = In(groupIds)
        }

        if (user.profile.id === profile.id) {
          where.mode = mode || GROUP_MODE.PUBLIC
        } else {
          where.mode = GROUP_MODE.PUBLIC
        }
      }
    }

    const { data: groups, total } = await this.find({
      where,
      limit,
    })

    return { groups, total }
  }

  async findById(user: UserToken, id: string) {
    const group = await this.findOne({ id })
    if (!group) {
      BaseError(TableName.GROUP, HttpStatus.NOT_FOUND)
    }

    const member = await this.memberService.findOne({
      group: { id: group.id },
      user: { id: user.profile.id },
    })

    if (!member && group.mode === GROUP_MODE.HIDDEN) {
      BaseError(TableName.GROUP, HttpStatus.FORBIDDEN)
    }

    const groupFully = {
      ...group,
      member,
    }

    return { group: groupFully }
  }

  async update(
    user: UserToken,
    id: string,
    input: UpdateGroupInput,
  ) {
    const group = await this.findOne({ id })
    if (!group) {
      BaseError(TableName.GROUP, HttpStatus.NOT_FOUND)
    }

    const member = await this.memberService.findOne({
      user: { id: user.profile.id },
      group: { id: group.id },
    })
    if (!member || member.role !== MEMBER_ROLE.ADMIN) {
      BaseError(TableName.GROUP, HttpStatus.FORBIDDEN)
    }

    await this.groupRepo.save({
      ...input,
      id,
    })

    return {
      group: {
        ...group,
        ...input,
      }
    }
  }

  async remove(
    user: UserToken,
    id: string,
  ) {
    const group = await this.findOne({ id })
    if (!group) {
      BaseError(TableName.GROUP, HttpStatus.NOT_FOUND)
    }

    const member = await this.memberService.findOne({
      user: { id: user.profile.id },
      group: { id: group.id },
    })
    if (!member || member.role !== MEMBER_ROLE.ADMIN) {
      BaseError(TableName.GROUP, HttpStatus.FORBIDDEN)
    }

    return await this.groupRepo.softRemove(group)
  }
}
