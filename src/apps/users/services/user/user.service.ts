import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService, UserToken } from 'apps/auth';
import { ProfileService, USER_ROLE } from 'apps/profiles';
import { LoginInput, RegisterInput } from 'apps/users/dtos';
import { User } from 'apps/users/entities';
import { BaseError, BaseService } from 'base';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { TableName } from 'utils';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
    @Inject(forwardRef(() => ProfileService)) private profileService: ProfileService,
  ) {
    super(userRepo, {})
  }

  async register(input: RegisterInput) {
    const {
      firstName,
      lastName,
      username,
      email,
      password: enteredPassword,
      birth,
      gender,
      role,
    } = input
    const existedUser = await this.findOne([
      { username }, { email }
    ])
    if (existedUser) {
      BaseError(TableName.USER, HttpStatus.CONFLICT)
    }
    const password = await bcrypt.hash(enteredPassword, 12)
    const createdUser = this.userRepo.create({
      ...input,
      password,
    })
    await this.userRepo.save(createdUser)

    const { profile } = await this.profileService.create({
      name: `${firstName} ${lastName}`,
      domain: username,
      birth,
      gender,
      role: role || USER_ROLE.USER,
    }, createdUser)

    const token = this.authService.generateToken(createdUser, profile)
    return { token }
  }

  async login(input: LoginInput) {
    const { usernameOrEmail, password, isRemember } = input
    const user = await this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where("user.email = :usernameOrEmail OR user.username = :usernameOrEmail",
        { usernameOrEmail }
      )
      .getOne()

    if (!user) {
      BaseError(TableName.USER, HttpStatus.NOT_FOUND)
    }
    if (!await (bcrypt.compare(password, user.password))) {
      BaseError(TableName.USER, HttpStatus.BAD_REQUEST, 'Email or password is incorrect')
    }
    const profile = await this.profileService.findOne({
      user: {
        id: user.id,
      }
    })
    if (!profile) {
      BaseError(TableName.PROFILE, HttpStatus.NOT_FOUND)
    }
    const token = this.authService.generateToken(user, profile, isRemember)
    return { token }
  }

  async remove(user: UserToken) {
    const exist = await this.findOne({ id: user.id })
    if (!exist) {
      BaseError(TableName.USER, HttpStatus.NOT_FOUND)
    }

    return {
      user: await this.userRepo.softRemove(user)
    }
  }

  async getUserWithProfile(id: string) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: { profiles: true },
    })

    return user
  }
}
