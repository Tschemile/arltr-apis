import { MailerModule } from '@nestjs-modules/mailer';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'apps/auth';
import { ProfileModule } from 'apps/profiles';
import { UserController } from '../controllers/user';
import { VerifyController } from '../controllers/verify';
import { User, Verify } from '../entities';
import { UserService } from '../services';
import { VerifyService } from '../services/verify';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Verify]),
    forwardRef(() => AuthModule),
    forwardRef(() => ProfileModule),
    forwardRef(() => MailerModule)
  ],
  controllers: [UserController, VerifyController],
  providers: [UserService, VerifyService],
  exports: [UserService, VerifyService]
})
export class UserModule {}
