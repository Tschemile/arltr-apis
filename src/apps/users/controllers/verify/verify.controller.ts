import { Controller } from '@nestjs/common';
import { Body, Post} from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'apps/auth';
import { VerifyInputDto } from 'apps/users/dtos/verify/verify-input.dto';
import { VerifyService } from 'apps/users/services';
import { TableName } from 'utils';

@ApiTags(TableName.VERIFY)
@Controller(TableName.VERIFY.toLowerCase())
export class VerifyController {
  constructor(private verifyService: VerifyService) {}

  @Public()
  @Post()
  async verify(
    @Body() input: VerifyInputDto
  ) {
    return await this.verifyService.verify(input);
  }
}
