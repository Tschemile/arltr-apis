import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToken } from 'apps/auth';
import { GROUP_MODE, MEMBER_ROLE, QUERY_TYPE } from 'apps/groups/constants';
import { CreateGroupInput, QueryGroupInput, UpdateGroupInput } from 'apps/groups/dtos';
import { Group } from 'apps/groups/entities';
import { BaseService } from 'base';
import slugify from 'slugify';
import { FindOptionsWhere, In, Like, Not, Repository } from 'typeorm';
import { HTTP_STATUS } from 'utils';
import { MemberService } from '../member';

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
      slug: slugify(input.name),
      total: 1,
    })
    await this.groupRepo.save(createdGroup)

    const owner = await this.memberService.createOwner(user, createdGroup)

    return {
      status: HTTP_STATUS.Created,
      group: {
        ...createdGroup,
        member: owner,
      },
    }
  }

  async findAll(user: UserToken, query: QueryGroupInput) {
    const where: FindOptionsWhere<Group> = { isDeleted: false }
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

    const [groups, total] = await Promise.all([
      this.groupRepo.find({ where, take }),
      this.groupRepo.count({ where })
    ])

    return { groups, total }
  }

  async update(
    user: UserToken,
    id: string,
    input: UpdateGroupInput,
  ) {
    const group = await this.findOne({ id })
    if (!group) {
      return {
        status: HTTP_STATUS.Not_Found
      }
    }

    const member = await this.memberService.findOne({
      user: { id: user.profile.id },
      group: { id: group.id },
    })
    if (!member || member.role !== MEMBER_ROLE.ADMIN) {
      return {
        status: HTTP_STATUS.Forbidden
      }
    }

    await this.groupRepo.save({
      ...input,
      id,
    })

    return {
      status: HTTP_STATUS.OK,
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
      return {
        status: HTTP_STATUS.Not_Found
      }
    }

    const member = await this.memberService.findOne({
      user: { id: user.profile.id },
      group: { id: group.id },
    })
    if (!member || member.role !== MEMBER_ROLE.ADMIN) {
      return {
        status: HTTP_STATUS.Forbidden
      }
    }

    await this.groupRepo.save({
      isDeleted: true,
      deletedAt: new Date(),
      id,
    })

    return {
      status: HTTP_STATUS.OK,
    }
  }

  async incrementTotal(id: string, total: number) {
    await this.groupRepo.save({
      total,
      id,
    })
  }
}
