import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "apps/auth";
import { UserModule } from "apps/users";
import { SettingModule } from "apps/settings";
import { PageController, ProfileController, RelationController } from "../controllers";
import { Profile, Relation } from "../entities";
import { PageService, ProfileService, RelationService } from "../services";

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile, Relation]),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    forwardRef(() => SettingModule),
  ],
  controllers: [
    ProfileController, RelationController, PageController
  ],
  providers: [
    ProfileService, RelationService, PageService
  ],
  exports: [
    ProfileService, RelationService, PageService,
  ]
})
export class ProfileModule {}