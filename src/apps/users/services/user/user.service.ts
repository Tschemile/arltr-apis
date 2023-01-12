import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'apps/auth';
import { ProfileService, USER_ROLE } from 'apps/profiles';
import { LoginInput, RegisterInput } from 'apps/users/dtos';
import { User } from 'apps/users/entities';
import { BaseService } from 'base';
import * as bcrypt from 'bcrypt';
import { FindOptionsWhere, Repository } from 'typeorm';
import { HTTP_STATUS } from 'utils/http';

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
      return {
        status: HTTP_STATUS.Conflict,
      }
    }
    const password = await bcrypt.hash(enteredPassword, 12)
    const createdUser = this.userRepo.create({
      ...input,
      password,
    })
    await this.userRepo.save(createdUser)

    const { status, profile } = await this.profileService.create({
      name: `${firstName} ${lastName}`,
      domain: username,
      birth,
      gender,
      role: isAdmin ? USER_ROLE.ADMIN : USER_ROLE.USER,
    }, createdUser)

    if (status !== HTTP_STATUS.Created) {
      return { status }
    }
    return {
      status: HTTP_STATUS.Created,
      token: this.authService.generateToken(createdUser, profile)
    }
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
      return {
        status: HTTP_STATUS.Not_Found,
      }
    }
    if (!await (bcrypt.compare(password, user.password))) {
      return {
        status: HTTP_STATUS.Bad_Request,
      }
    }
    const profile = await this.profileService.findOne({
      user: {
        id: user.id,
      }
    })
    if (!user) {
      return { status: HTTP_STATUS.Not_Found }
    }
    return {
      status: HTTP_STATUS.OK,
      token: this.authService.generateToken(user, profile)
    }
  }

  async delete(user: User) {
    const exist = await this.findOne({ id: user.id })
    if (!exist) {
      return {
        status: HTTP_STATUS.Not_Found,
      }
    }

    await this.userRepo.softDelete(user.id)
    return {
      status: HTTP_STATUS.OK,
    }
  }
}
