import { MailerService } from '@nestjs-modules/mailer';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService, UserToken } from 'apps/auth';
import { ProfileService } from 'apps/profiles';
import { VerifyInputDto } from 'apps/users/dtos/verify/verify-input.dto';
import { Verify } from 'apps/users/entities/verify.entity';
import { BaseError, BaseService } from 'base';
import { Repository } from 'typeorm';
import { TableName } from 'utils';
import { ranDomCode } from 'utils/utils';
import { UserService } from '../user';

@Injectable()
export class VerifyService extends BaseService<Verify> {
  constructor(
    @InjectRepository(Verify) private verifyRepo: Repository<Verify>,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    @Inject(forwardRef(() => MailerService)) private mailService: MailerService,
    @Inject(forwardRef(() => ProfileService))
    private profileService: ProfileService,
  ) {
    super(verifyRepo, {});
  }

  async sendEmail(email: string, userName: string) {
    const verify = await this.findOne({
      information: email,
    });
    const code = ranDomCode();
    let newVerify: Verify;
    if (verify) {
      newVerify = await this.verifyRepo.save({
        id: verify.id,
        code,
        expiredAt: new Date(),
      });
    } else {
      newVerify = await this.insertOne({
        code,
        information: email,
        expiredAt: new Date(),
      });
    }

    await this.mailService
      .sendMail({
        to: email,
        from: 'pmchauuu@gmail.com',
        subject: `OPT for loggin in to your account: ${userName}`,
        template: 'verify',
        context: {
          code,
          userName,
        },
      })
      .then(() => {
        setTimeout(async () => {
          await this.verifyRepo.save({
            id: newVerify.id,
            code: null,
            expiredAt: new Date(),
          });
        }, 60000);
      });

    const userInfo = await this.userService.findOne({ email });
    const profile = await this.profileService.findOne({
      user: { id: userInfo.id },
    });
    const token = this.authService.generateToken(userInfo, profile);

    return { token };
  }

  async verify(input: VerifyInputDto) {
    const { code, email } = input;
    const verify = await this.findOne({
      code,
      information: email,
    });
    if (!verify) {
      BaseError(TableName.VERIFY, HttpStatus.FORBIDDEN, 'The code has expired');
    }
    const userInfo = await this.userService.findOne({ email });
    const profile = await this.profileService.findOne({
      user: { id: userInfo.id },
    });
    const token = this.authService.generateToken(userInfo, profile);

    return { token };
  }
}
