import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingModule } from 'apps/settings';
import { BlogController, ReplyController, VoteController } from '../controllers';
import { Blog, Reply, Vote } from '../entities';
import { BlogService, ReplyService, VoteService } from '../services';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog, Vote, Reply]),
    forwardRef(() => SettingModule),
  ],
  controllers: [
    BlogController, VoteController, ReplyController
  ],
  providers: [
    BlogService, VoteService, ReplyService
  ],
  exports: [
    BlogService, VoteService, ReplyService
  ]
})
export class ForumModule {}
