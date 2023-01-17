import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard, Roles } from 'apps/auth';
import { USER_ROLE } from 'apps/profiles';
import { POLICY_TYPE } from 'apps/settings/constants';
import { CreatePolicyDto } from 'apps/settings/dtos/policy/create-policy.dto';
import { GetPolicysOutput } from 'apps/settings/dtos/policy/get-policy.dto';
import { UpdatePolicyDto } from 'apps/settings/dtos/policy/update-policy.dto';
import { PolicyService } from 'apps/settings/services/policy';
import { TableName } from 'utils';

@ApiTags(TableName.POLICY)
@Controller(TableName.POLICY.toLowerCase())
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(USER_ROLE.ADMIN)
  @ApiQuery({ name: 'type', required: false, enum: POLICY_TYPE })
  @ApiBearerAuth()
  @ApiOkResponse({
    type: CreatePolicyDto,
    description: 'Successfully Create Policy',
  })
  async create(@Body() createPolicyDto: CreatePolicyDto,  @Query('type') type = POLICY_TYPE.TERM,) {
    return await this.policyService.create(createPolicyDto, type);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles(USER_ROLE.ADMIN)
  @ApiBearerAuth()
  @ApiQuery({ name: 'type', required: false, enum: POLICY_TYPE })
  async findAll(
    @Query('type') type = POLICY_TYPE.TERM
  ): Promise<GetPolicysOutput> {
    return await this.policyService.findAll({ type });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(USER_ROLE.ADMIN)
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() updatePolicyDto: UpdatePolicyDto,
  ) {
    return await this.policyService.update(id, updatePolicyDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(USER_ROLE.ADMIN)
  @ApiBearerAuth()
  async delete(@Param('id') id: string) {
    return await this.policyService.remove(id);
  }
}
