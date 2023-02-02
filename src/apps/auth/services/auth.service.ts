import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Profile, USER_ROLE } from "apps/profiles";
import { User, UserService } from "apps/users";
import { UserToken } from "../dtos";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) { }

  generateToken(user: User, profile: Profile) { 
    const payload: UserToken = {
      id: user.id,
      username: user.username,
      profile,
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
      username: user.username,
      profile,
    }

    return format
  }
}
