import { MailerService } from '@nestjs-modules/mailer';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'apps/auth';
import { ProfileService } from 'apps/profiles';
import { Verify } from 'apps/users/entities/verify.entity';
import { BaseError, BaseService } from 'base';
import { Repository } from 'typeorm';
import { TableName, timeIn } from 'utils';
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

  async sendEmail(email: string) {

    const user = await this.userService.findOne({ email });

    if (!user) {
      BaseError(TableName.USER, HttpStatus.NOT_FOUND);
    }

    const verify = await this.findOne({
      information: email,
    });
    const code = ranDomCode();
    let newVerify: Verify;
    if (verify) {
      newVerify = await this.verifyRepo.save({
        id: verify.id,
        code,
        expiredAt: timeIn({ duration: 1, unit: 'minute', action: 'add' }).toISOString(),
      });
    } else {
      newVerify = await this.insertOne({
        code,
        information: email,
        expiredAt: timeIn({ duration: 1, unit: 'minute', action: 'add' }).toISOString(),
      });
    }

   
    this.mailService.sendMail({
      to: email,
      from: 'pmchauuu@gmail.com',
      subject: `OPT for loggin in to your account: ${user.username}`,
      template: 'verify',
      context: {
        code,
        username: user.username,
      },
    });
    return { message: `please verify the code with email ${email}` };
  }

  async verify(code: string) {
    const verify = await this.findOne({
      code,
    });
    if (!verify || new Date(verify.expiredAt).getTime() < new Date().getTime()) {
      BaseError(TableName.VERIFY, HttpStatus.FORBIDDEN, 'The code has expired');
    }
    const userInfo = await this.userService.findOne({
      email: verify.information,
    });
    const profile = await this.profileService.findOne({
      user: { id: userInfo.id },
    });
    const token = this.authService.generateToken(userInfo, profile);

    return { token };
  }
}
