import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProfileModule } from "apps/profiles";
import { GroupController, MemberController } from "../controllers";
import { Group, Member } from "../entities";
import { GroupService, MemberService } from "../services";

@Module({
  imports: [
    TypeOrmModule.forFeature([Group, Member]),
    forwardRef(() => ProfileModule),
  ],
  controllers: [
    GroupController, MemberController,
  ],
  providers: [
    GroupService, MemberService,
  ],
  exports: [
    GroupService, MemberService,
  ]
})
export class GroupModule { }