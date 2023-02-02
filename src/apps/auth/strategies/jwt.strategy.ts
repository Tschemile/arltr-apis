import { HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { BaseError } from "base";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TableName } from "utils";
import { UserToken } from "../dtos";
import { AuthService } from "../services";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    })
  }

  async validate(payload: UserToken) {
    const user = await this.authService.verifyUser(payload)
    if (!user) {
      BaseError(TableName.USER, HttpStatus.UNAUTHORIZED)
    }

    return user
  }
}