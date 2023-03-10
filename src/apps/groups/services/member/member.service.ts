import { forwardRef, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserToken } from "apps/auth";
import { MEMBER_ROLE, MEMBER_STATUS, MEMBER_WITH_GROUP, QUERY_MEMBER_TYPE } from "apps/groups/constants";
import { CreateMemberInput, QueryMemberInput, UpdateMemberInput } from "apps/groups/dtos";
import { Member } from "apps/groups/entities";
import { ProfileService } from "apps/profiles";
import { BaseError, BaseService } from "base";
import { FindOptionsWhere, In, Repository } from "typeorm";
import { TableName } from "utils";
import { GroupService } from "../group";

export const memberRelation = {
  user: true,
  group: true,
}

@Injectable()
export class MemberService extends BaseService<Member> {
  constructor(
    @InjectRepository(Member) private memberRepo: Repository<Member>,
    @Inject(forwardRef(() => ProfileService)) private profileService: ProfileService,
    @Inject(forwardRef(() => GroupService)) private groupService: GroupService,
  ) {
    super(memberRepo, memberRelation)
  }

  /**
   * @description Functions for requesting join group, invite someone to group
   * or create owner for group..
   * 
   * @param user 
   * @param input 
   * @returns 
   */
  async create(user: UserToken, input: CreateMemberInput) {
    const { role, group: groupId, user: userId } = input

    // Check exist group
    const group = await this.groupService.findOne({ id: groupId })
    if (!group) {
      BaseError(TableName.GROUP, HttpStatus.NOT_FOUND)
    }

    // Check exist profile
    const profile = await this.profileService.findOne({ id: userId })
    if (!profile) {
      BaseError(TableName.PROFILE, HttpStatus.NOT_FOUND)
    }

    // Check exist member
    const existedMember = await this.findOne({
      user: { id: profile.id },
      group: { id: group.id }
    })
    if (existedMember) {
      BaseError(TableName.MEMBER, HttpStatus.CONFLICT)
    }

    if (role === MEMBER_ROLE.ADMIN) {
      const createdOwner = await this.insertOne({
        user: profile,
        group,
        role,
        status: MEMBER_STATUS.ACTIVE,
      })

      return { member: createdOwner }
    } else {
      if (user.profile.id === profile.id) {
        const requestedMember = await this.insertOne({
          user: profile,
          group,
          role,
          status: MEMBER_STATUS.REQUESTING,
        })

        return { member: requestedMember }
      } else {
        // Check current user is member of group
        const isMember = await this.findOne({
          user: { id: user.profile.id },
          group: { id: group.id }
        })
        if (!isMember) {
          BaseError(TableName.GROUP, HttpStatus.FORBIDDEN)
        }

        const invitedMember = await this.insertOne({
          user: profile,
          group,
          role,
          status: MEMBER_STATUS.INVITING,
        })

        return { member: invitedMember }
      }
    }
  }

  async findAll(user: UserToken, query: QueryMemberInput) {
    const { type, group: groupId, user: userId, status } = query
    const where: FindOptionsWhere<Member> = {}

    where.status = In(status)

    switch (type) {
      case QUERY_MEMBER_TYPE.GROUP: {
        where.group = { id: groupId }
        break
      }
      case QUERY_MEMBER_TYPE.USER: {
        where.user = { id: userId }
        break
      }
    }

    const { data: members, total } = await this.find({ where })

    return { members, total }
  }

  /**
   * @description Functions for accepted requesting,
   * update or promote one member in group.
   * 
   * @param user 
   * @param id 
   * @param input 
   * @returns 
   */
  async update(
    user: UserToken,
    id: string,
    input: UpdateMemberInput,
  ) {
    // Find member
    const member = await this.findOne({ id })
    if (!member) {
      BaseError(TableName.MEMBER, HttpStatus.NOT_FOUND)
    }

    if (member.user.id === user.profile.id) {
      if (member.status === MEMBER_STATUS.INVITING) {
        await this.groupService.changeProperty({ id: member.group.id }, 'total', 1, 'INCREMENT')
      }
    } else {
      // Check member has role to update
      const isMember = await this.isMember(user, member.group.id)
      if (!isMember || isMember.role === MEMBER_ROLE.MEMBER) {
        BaseError(TableName.MEMBER, HttpStatus.FORBIDDEN)
      } else if(member.status === MEMBER_STATUS.REQUESTING) {
        await this.groupService.changeProperty({ id: member.group.id }, 'total', 1, 'INCREMENT')
      }
    }

    if (input.role && member.role !== input.role) {
      const isMember = await this.isMember(user, member.group.id)
      if (isMember.role !== MEMBER_ROLE.ADMIN) {
        BaseError(TableName.MEMBER, HttpStatus.FORBIDDEN)
      }
    }

    await this.memberRepo.save({
      ...input,
      id,
    })

    return {
      member: { ...member, ...input }
    }
  }

  /**
   * @description Functions for reject, kick or leave
   * 
   * 
   * @param user 
   * @param id 
   * @returns 
   */
  async remove(
    user: UserToken,
    id: string,
  ) {
    // Find member
    const member = await this.findOne({ id })
    if (!member) {
      BaseError(TableName.MEMBER, HttpStatus.NOT_FOUND)
    }

    if (member.user.id !== user.profile.id) {
      const isMember = await this.findOne({
        user: { id: user.profile.id },
        group: { id: member.group.id }
      })
      if (!isMember || isMember.role === MEMBER_ROLE.MEMBER) {
        BaseError(TableName.MEMBER, HttpStatus.FORBIDDEN)
      }
    }

    if (MEMBER_WITH_GROUP.IN.includes(member.status)) {
      await this.groupService.changeProperty({ id: member.group.id }, 'total', 1, 'DECREMENT')
    }
    return {
      member: await this.memberRepo.softRemove(member)
    }
  }

  async isMember(user: UserToken, groupId: string) {
    const member = await this.findOne({
      group: { id: groupId },
      user: { id: user.profile.id }
    })

    return member
  }
}