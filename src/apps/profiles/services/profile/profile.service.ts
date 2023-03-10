import { CACHE_MANAGER, forwardRef, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthService, UserToken } from "apps/auth";
import { GroupService } from "apps/groups";
import { QUERY_GROUP_TYPE } from "apps/groups/constants";
import { PostService } from "apps/posts";
import { RELATION_TYPE, USER_ROLE } from "apps/profiles/constants";
import { CreateProfileInput, QueryProfileInput, UpdateProfileInput, ProfileFully } from "apps/profiles/dtos";
import { Profile } from "apps/profiles/entities";
import { FileService } from "apps/uploads";
import { User } from "apps/users";
import { BaseError, BaseService } from "base";
import { Cache } from "cache-manager";
import { Between, FindOptionsWhere, Like, Not, Repository } from "typeorm";
import { TableName } from "utils";
import { RelationService } from "../relation";

export const profileRelations = {
  user: true,
}

@Injectable()
export class ProfileService extends BaseService<Profile> {
  constructor(
    @InjectRepository(Profile) private profileRepo: Repository<Profile>,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
    @Inject(forwardRef(() => PostService)) private postService: PostService,
    @Inject(forwardRef(() => GroupService)) private groupService: GroupService,
    @Inject(forwardRef(() => RelationService)) private relationService: RelationService,
    @Inject(forwardRef(() => FileService)) private fileService: FileService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {
    super(profileRepo, profileRelations)
  }

  async create(input: CreateProfileInput, user: User) {
    const { role } = input
    if (role !== USER_ROLE.PAGE) {
      const existedProfile = await this.findOne({
        user: {
          id: user.id,
        },
      })

      if (existedProfile) {
        BaseError(TableName.PROFILE, HttpStatus.CONFLICT)
      }
    }
    const createdProfile = this.profileRepo.create({
      ...input,
      user,
    })
    await this.profileRepo.save(createdProfile)

    return { profile: createdProfile }
  }

  async findAll(user: UserToken, query: QueryProfileInput) {
    const {
      search = '',
      gender = '',
      status = '',
      minAge = 0,
      maxAge = 0,
      limit = 10
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

    const [profiles, total] = await this.profileRepo.findAndCount({
      where,
      take: limit,
    })

    return { profiles, total }
  }

  async findById(user: UserToken, domain: string) {
    const value = await this.cacheManager.get(domain) as ProfileFully
    if (value) {
      return {
        profile: value,
      }
    }

    const profile = await this.profileRepo.findOne({
      where: { domain },
    })

    if (!profile) {
      BaseError(TableName.PROFILE, HttpStatus.NOT_FOUND)
    }

    const blocked = await this.relationService.findOne([
      { requester: { id: user.profile.id }, user: { domain }, type: RELATION_TYPE.BLOCKED }, 
      { requester: { domain }, user: { id: user.profile.id }, type: RELATION_TYPE.BLOCKED },
    ])

    const { relations, total: totalRelations } = await this.relationService.getRelations(user)
    const { groups, total: totalGroups } = await this.groupService.findAll(user, {
      user: profile.id,
      type: QUERY_GROUP_TYPE.USER,
      limit: 6,
    })
    const { files: albums, total: totalAlbums } = await this.fileService.findAll(user, {  user: profile.id })

    if (blocked) {
      BaseError(TableName.PROFILE, HttpStatus.FORBIDDEN)
    }
    if (!profile) {
      BaseError(TableName.PROFILE, HttpStatus.NOT_FOUND)
    }

    const profileFully = {
      ...profile,
      ...relations,
      ...totalRelations,
      groups,
      totalGroups,
      albums,
      totalAlbums,
    }

    await this.cacheManager.set(domain, profileFully, 60)

    return {
      profile: profileFully
    }
  }

  async update(user: UserToken, input: UpdateProfileInput) {
    const profile = await this.findOne({ id: user.profile.id })
    if (!profile) {
      BaseError(TableName.PROFILE, HttpStatus.NOT_FOUND)
    }
    await this.profileRepo.save({
      ...input,
      id: profile.id,
    })

    const updateProfile = { ...profile, ...input }
    await this.cacheManager.del(profile.domain)
    return {
      profile: updateProfile,
    }
  }

  async remove(user: UserToken) {
    const profile = await this.findOne({ id: user.profile.id })
    if (!profile) {
      BaseError(TableName.PROFILE, HttpStatus.NOT_FOUND)
    }
    await this.cacheManager.del(profile.domain)
    return {
      profile: await this.profileRepo.softRemove(profile)
    }
  }

  async switch(user: User, id: string) {
    const profile = await this.findOne({ id })
    if (!profile) {
      BaseError(TableName.PROFILE, HttpStatus.NOT_FOUND)
    }
    if (user.id !== profile.user.id) {
      BaseError(TableName.PROFILE, HttpStatus.FORBIDDEN)
    }
    return {
      token: this.authService.generateToken(user, profile),
    }
  }
}