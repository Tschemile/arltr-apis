import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthService, UserToken } from "apps/auth";
import { MemberService } from "apps/groups";
import { RELATION_TYPE, USER_ROLE } from "apps/profiles/constants";
import { CreateProfileInput, QueryProfileInput, UpdateProfileInput } from "apps/profiles/dtos";
import { Profile } from "apps/profiles/entities";
import { User } from "apps/users";
import { BaseService } from "base";
import { Between, FindOptionsWhere, LessThan, Like, Not, Repository } from "typeorm";
import { HTTP_STATUS } from "utils";
import { relateRelations, RelationService } from "../relation";

export const profileRelations = {
  user: true,
}

@Injectable()
export class ProfileService extends BaseService<Profile> {
  constructor(
    @InjectRepository(Profile) private profileRepo: Repository<Profile>,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
    @Inject(forwardRef(() => RelationService)) private relationService: RelationService,
  ) {
    super(profileRepo)
  }

  async create(input: CreateProfileInput, user: User) {
    const { role } = input
    if (role !== USER_ROLE.PAGE) {
      const existedProfile = await this.findOne({
        user: {
          id: user.id,
        },
      }, profileRelations)

      if (existedProfile) {
        return {
          status: HTTP_STATUS.Conflict,
        }
      }
    }
    const createdProfile = this.profileRepo.create({
      ...input,
      user,
    })
    await this.profileRepo.save(createdProfile)

    return {
      status: HTTP_STATUS.Created,
      profile: createdProfile,
    }
  }

  async findAll(user: UserToken, query: QueryProfileInput) {
    const {
      search = '',
      gender = '',
      status = '',
      minAge = 0,
      maxAge = 0,
      limit: take = 10
    } = query || {}

    const where: FindOptionsWhere<Profile> = {
      role: USER_ROLE.USER,
    }

    if (search) {
      where.name = Like(`%${search}%`)
    }

    if (gender) {
      where.gender = gender
    }

    if (status) {
      where.status = status
    }

    if (minAge || maxAge) {
      const minYear = new Date().getFullYear() - maxAge
      const minDate = new Date(`${minYear}-01-01`)

      const maxYear = new Date().getFullYear() - minAge
      const maxDate = new Date(`${maxYear}-12-31`)

      where.birth = Between(minDate, maxDate)
    }

    where.id = Not(user.profile.id)

    const [profiles, total] = await Promise.all([
      this.profileRepo.find({ where, take }),
      this.profileRepo.count({ where })
    ])

    return { profiles, total }
  }

  async findById(user: UserToken, domain: string) {
    const profile = await this.profileRepo.findOne({
      where: { domain },
    })

    const blocked = await this.relationService.findOne([
      { requester: { id: user.profile.id }, user: { domain }, type: RELATION_TYPE.BLOCKED }, 
      { requester: { domain }, user: { id: user.profile.id }, type: RELATION_TYPE.BLOCKED },
    ], relateRelations)
    if (blocked) {
      return {
        status: HTTP_STATUS.Forbidden,
      }
    }
    if (!profile) {
      return {
        status: HTTP_STATUS.Not_Found,
      }
    }
    return {
      status: HTTP_STATUS.OK,
      profile
    }
  }

  async update(user: UserToken, input: UpdateProfileInput) {
    const profile = await this.findOne({ id: user.profile.id })
    if (!profile) {
      return {
        status: HTTP_STATUS.Not_Found
      }
    }
    await this.profileRepo.save({
      ...input,
      id: profile.id,
    })

    const updateProfile = { ...profile, ...input }
    return {
      status: HTTP_STATUS.OK,
      profile: updateProfile,
    }
  }

  async remove(user: UserToken) {
    const profile = await this.findOne({ id: user.profile.id }, profileRelations)
    if (!profile) {
      return {
        status: HTTP_STATUS.Not_Found
      }
    }
    await this.profileRepo.softDelete(profile.id)

    return {
      status: HTTP_STATUS.OK,
    }
  }

  async switch(user: User, id: string) {
    const profile = await this.findOne({ id })
    if (!profile) {
      return { status: HTTP_STATUS.Not_Found }
    }
    if (user.id !== profile.user.id) {
      return { status: HTTP_STATUS.Unauthorized }
    }
    return {
      status: HTTP_STATUS.OK,
      token: this.authService.generateToken(user, profile),
    }
  }
}