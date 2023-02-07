import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GroupModule } from "apps/groups";
import { ProfileModule } from "apps/profiles";
import { CommentController, PostController, ReactController } from "../controllers";
import { Comment, Post, React, Tag } from "../entities";
import { CommentService, PostService, ReactService, TagService } from "../services";

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, React, Comment, Tag]),
    forwardRef(() => GroupModule),
    forwardRef(() => ProfileModule),
  ],
  controllers: [
    PostController, ReactController, CommentController,
  ],
  providers: [
    PostService, ReactService, CommentService, TagService,
  ],
  exports: [
    PostService, ReactService, CommentService, TagService,
  ],
})
export class PostModule { }