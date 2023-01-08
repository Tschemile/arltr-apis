import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Profile } from "apps/profiles";
import { User } from "apps/users";
import { UserToken } from "../dtos";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService
  ) { }

  generateToken(user: User, profile: Profile) { 
    const payload: UserToken = {
      id: user.id,
      username: user.username,
      profile: {
        id: profile.id,
        name: profile.name,
        gender: profile.gender,
        role: profile.role,
        birth: profile.birth,
        status: profile.status,
      },
    }

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    })
  }
}