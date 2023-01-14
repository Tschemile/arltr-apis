import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService, UserToken } from 'apps/auth';
import { ProfileService, USER_ROLE } from 'apps/profiles';
import { LoginInput, RegisterInput } from 'apps/users/dtos';
import { User } from 'apps/users/entities';
import { BaseError, BaseService } from 'base';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { HTTP_STATUS } from 'utils/http';

const MODULE_NAME = 'User'

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
    @Inject(forwardRef(() => ProfileService)) private profileService: ProfileService,
  ) {
    super(userRepo)
  }

  async register(input: RegisterInput, isAdmin?: boolean) {
    const {
      firstName,
      lastName,
      username,
      email,
      password: enteredPassword,
      birth,
      gender,
    } = input
    const existedUser = await this.findOne([
      { username }, { email }
    ])
    if (existedUser) {
      BaseError(MODULE_NAME, HttpStatus.CONFLICT)
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
      role: isAdmin ? USER_ROLE.ADMIN : USER_ROLE.USER,
    }, createdUser)

    const token = this.authService.generateToken(createdUser, profile)
    return { token }
  }

  async login(input: LoginInput) {
    const { usernameOrEmail, password } = input
    const user = await this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where("user.email = :usernameOrEmail OR user.username = :usernameOrEmail",
        { usernameOrEmail }
      )
      .getOne()

    if (!user) {
      BaseError(MODULE_NAME, HttpStatus.NOT_FOUND)
    }
    console.log(user)
    if (!await (bcrypt.compare(password, user.password))) {
      BaseError(MODULE_NAME, HttpStatus.BAD_REQUEST)
    }
    const profile = await this.profileService.findOne({
      user: {
        id: user.id,
      }
    })
    if (!profile) {
      return { status: HTTP_STATUS.Not_Found }
    }
    const token = this.authService.generateToken(user, profile)
    return { token }
  }

  async delete(user: UserToken) {
    const exist = await this.findOne({ id: user.id })
    if (!exist) {
      BaseError(MODULE_NAME, HttpStatus.NOT_FOUND)
    }

    await this.userRepo.softRemove(user)
  }
}
