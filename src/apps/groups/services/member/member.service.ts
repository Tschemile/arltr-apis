import { forwardRef, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserToken } from "apps/auth";
import { MEMBER_ROLE, MEMBER_STATUS } from "apps/groups/constants";
import { InviteMemberInput, UpdateMemberInput } from "apps/groups/dtos";
import { Group, Member } from "apps/groups/entities";
import { ProfileService } from "apps/profiles";
import { BaseError, BaseService } from "base";
import { FindOptionsWhere, Not, Repository } from "typeorm";
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
    super(memberRepo)
  }

  // Only for owner
  async createOwner(user: UserToken, group: Group) {
    const existedOwner = await this.findOne({
      user: { id: user.profile.id },
      group: { id: group.id }
    })

    if (existedOwner) {
      if (
        existedOwner.role === MEMBER_ROLE.ADMIN
        && existedOwner.status === MEMBER_STATUS.ACTIVE
      ) {
        return existedOwner
      } else {
        await this.memberRepo.save({
          role: MEMBER_ROLE.ADMIN,
          status: MEMBER_STATUS.ACTIVE,
          id: existedOwner.id,
        })
        return {
          ...existedOwner,
          role: MEMBER_ROLE.ADMIN,
          status: MEMBER_STATUS.ACTIVE,
        }
      }
    }

    const createdOwner = this.memberRepo.create({
      user: user.profile,
      group,
      role: MEMBER_ROLE.ADMIN,
      status: MEMBER_STATUS.ACTIVE,
    })
    await this.memberRepo.save(createdOwner)

    return createdOwner
  }

  async invite(user: UserToken, input: InviteMemberInput) {
    const { user: userId, group: groupId, role } = input

    // Check exist group
    const group = await this.groupService.findOne({ id: groupId })
    if (!group) {
      BaseError(TableName.GROUP, HttpStatus.NOT_FOUND)
    }

    // Check current user is member of group
    const isMember = await this.findOne({
      user: { id: user.profile.id },
      group: { id: group.id }
    })
    if (!isMember) {
      BaseError(TableName.GROUP, HttpStatus.FORBIDDEN)
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
      return {
        member: existedMember,
      }
    }

    const createdMember = this.memberRepo.create({
      user: profile,
      group,
      role,
      status: MEMBER_STATUS.INVITING,
    })
    await this.memberRepo.save(createdMember)

    return {
      member: createdMember,
    }
  }

  async findAll(user: UserToken, group?: string) {
    const where: FindOptionsWhere<Member> = {}

    if (group) {
      where.group = { id: group }
    } else {
      where.user = { id: user.profile.id }
    }

    where.status = Not(MEMBER_STATUS.INVITING)

    const { data: members, total } = await this.find({
      where,
      relations: memberRelation,
    })

    return { members, total }
  }

  async update(
    user: UserToken,
    id: string,
    input: UpdateMemberInput,
  ) {
    // Find member
    const member = await this.findOne({ id }, memberRelation)
    if (!member) {
      BaseError(TableName.MEMBER, HttpStatus.NOT_FOUND)
    }

    if (member.user.id === user.profile.id) {
      if (
        member.status === MEMBER_STATUS.INVITING
        && input.status === MEMBER_STATUS.ACTIVE
      ) {
        await this.groupService.changeProperty({ id: member.group.id }, 'total', 1, 'INCREMENT')
      }
    } else {
      // Check member has role to update
      const isMember = await this.findOne({
        user: { id: user.profile.id },
        group: { id: member.group.id }
      })
      if (!isMember || isMember.role === MEMBER_ROLE.MEMBER) {
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

  async remove(
    user: UserToken,
    id: string,
  ) {
    // Find member
    const member = await this.findOne({ id }, memberRelation)
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

    await this.groupService.changeProperty({ id: member.group.id }, 'total', 1, 'DECREMENT')
    return {
      member: await this.memberRepo.softRemove(member)
    }
  }
}