import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Profile, USER_ROLE } from "apps/profiles";
import { User, UserService } from "apps/users";
import { timeIn } from "utils";
import { UserToken } from "../dtos";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) { }

  generateToken(user: User, profile: Profile, isRemember?: boolean) {
    const payload: UserToken = {
      id: user.id,
      username: user.userName,
      profile,
    }

    if (isRemember) {
      payload.exp = Math.floor(timeIn({
        duration: 6,
        unit: 'month',
        action: 'add'
      }).getTime() / 1000)
    } else {
      payload.exp = Math.floor(timeIn({
        duration: 1,
        unit: 'day',
        action: 'add'
      }).getTime() / 1000)
    }

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    })
  }

  async verifyUser(payload: UserToken) {
    const user = await this.userService.getUserWithProfile(payload.id)
    const profile = user.profiles.find((x) => x.role === USER_ROLE.USER)

    const format: UserToken = {
      id: user.id,
      username: user.userName,
      profile,
    }

    return format
  }
}
