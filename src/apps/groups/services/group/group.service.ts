import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToken } from 'apps/auth';
import { GROUP_MODE, MEMBER_ROLE, QUERY_TYPE } from 'apps/groups/constants';
import { CreateGroupInput, QueryGroupInput, UpdateGroupInput } from 'apps/groups/dtos';
import { Group } from 'apps/groups/entities';
import { BaseError, BaseService } from 'base';
import { FindOptionsWhere, In, Like, Not, Repository } from 'typeorm';
import { generateSlug } from 'utils';
import { MemberService } from '../member';

const MODULE_NAME = 'Group'

@Injectable()
export class GroupService extends BaseService<Group> {
  constructor(
    @InjectRepository(Group) private groupRepo: Repository<Group>,
    @Inject(forwardRef(() => MemberService)) private memberService: MemberService,
  ) {
    super(groupRepo)
  }

  async create(user: UserToken, input: CreateGroupInput) {
    const createdGroup = this.groupRepo.create({
      ...input,
      slug: generateSlug(input.name),
      total: 1,
    })
    await this.groupRepo.save(createdGroup)

    const owner = await this.memberService.createOwner(user, createdGroup)

    return {
      group: {
        ...createdGroup,
        member: owner,
      },
    }
  }

  async findAll(user: UserToken, query: QueryGroupInput) {
    const where: FindOptionsWhere<Group> = {}
    const take = query.limit || 10

    switch (query.type) {
      case QUERY_TYPE.COMMUNICATE: {
        where.mode = Not(GROUP_MODE.HIDDEN)
        break
      }
      case QUERY_TYPE.COMMUNICATE: {
        const { members: memberOfUser } = await this.memberService.findAll(user)
        const groupIds = memberOfUser.map((x) => x.group.id)
        where.id = In(groupIds)
      }
    }

    if (query.search) {
      where.name = Like(`%${query.search}%`)
    }

    const { data: groups, total } = await this.find({
      where,
      take,
    })

    return { groups, total }
  }

  async findByUser(user: UserToken, take: number) {
    const where: FindOptionsWhere<Group> = {}

    const { members } = await this.memberService.findAll(user)
    const groupIds = members.map((x) => x.group.id)
    where.id = In(groupIds)

    const { data: groups, total} = await this.find({
      where,
      take,
    })

    return { groups, total }
  }

  async update(
    user: UserToken,
    id: string,
    input: UpdateGroupInput,
  ) {
    const group = await this.findOne({ id })
    if (!group) {
      BaseError(MODULE_NAME, HttpStatus.NOT_FOUND)
    }

    const member = await this.memberService.findOne({
      user: { id: user.profile.id },
      group: { id: group.id },
    })
    if (!member || member.role !== MEMBER_ROLE.ADMIN) {
      BaseError(MODULE_NAME, HttpStatus.FORBIDDEN)
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
      BaseError(MODULE_NAME, HttpStatus.NOT_FOUND)
    }

    const member = await this.memberService.findOne({
      user: { id: user.profile.id },
      group: { id: group.id },
    })
    if (!member || member.role !== MEMBER_ROLE.ADMIN) {
      BaseError(MODULE_NAME, HttpStatus.FORBIDDEN)
    }

    await this.groupRepo.softRemove(group)
  }

  async incrementTotal(id: string, total: number) {
    await this.groupRepo.save({
      total,
      id,
    })
  }
}
