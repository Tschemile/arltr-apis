import { Body, Controller, Delete, Get, Param, Patch, Query, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "apps/auth";
import { GetProfileFullyOutput, GetProfileOutput, GetProfilesOutput, UpdateProfileInput } from "apps/profiles/dtos";
import { ProfileService } from "apps/profiles/services";
import { GetUserTokenOutput } from "apps/users/dtos";
import { TableName } from "utils";

@ApiTags(TableName.PROFILE)
@Controller(TableName.PROFILE.toLowerCase())
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
  ) { }

  @Get('switch')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: `${TableName.PROFILE} not found` })
  @ApiForbiddenResponse({ description: `You don't have permission to do that` })
  @ApiOkResponse({ type: GetUserTokenOutput })
  async switch(
    @Request() req,
    @Query('id') id: string,
  ): Promise<GetUserTokenOutput> {
    return await this.profileService.switch(req.user, id)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'gender', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'minAge', type: Number, required: false })
  @ApiQuery({ name: 'maxAge', type: Number, required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiOkResponse({
    type: GetProfilesOutput
  })
  async get(
    @Request() req,
    @Query('search') search,
    @Query('gender') gender,
    @Query('status') status,
    @Query('minAge') minAge,
    @Query('maxAge') maxAge,
    @Query('limit') limit,
  ): Promise<GetProfilesOutput> {
    return await this.profileService.findAll(
      req.user,
      { search, gender, status, minAge, maxAge, limit }
    )
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: `${TableName.PROFILE} not found` })
  @ApiOkResponse({ type: GetProfileOutput })
  async getMyProfile(
    @Request() req
  ): Promise<GetProfileOutput> {
    return await this.profileService.findById(req.user, req.user.profile.domain)
  }

  @Get(':domain')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'domain' })
  @ApiNotFoundResponse({ description: `${TableName.PROFILE} not found` })
  @ApiForbiddenResponse({ description: `You don't have permission to do that` })
  @ApiOkResponse({ type: GetProfileFullyOutput })
  async getByDomain(
    @Request() req,
    @Param('domain') domain: string
  ): Promise<GetProfileFullyOutput> {
    return await this.profileService.findById(req.user, domain)
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: `${TableName.PROFILE} not found` })
  @ApiOkResponse({ type: GetProfileOutput })
  async patch(
    @Request() req,
    @Body() input: UpdateProfileInput,
  ): Promise<GetProfileOutput> {
    return await this.profileService.update(
      req.user,
      input,
    )
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: `${TableName.PROFILE} not found` })
  @ApiOkResponse({ description: `Deleted successfully` })
  async delete(
    @Request() req,
  ): Promise<GetProfileOutput> {
    return await this.profileService.remove(req.user)
  }
}