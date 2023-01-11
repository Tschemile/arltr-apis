import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { JwtAuthGuard } from "apps/auth";
import { CreateProfileInput, GetProfileOutput, GetProfilesOutput, UpdateProfileInput } from "apps/profiles/dtos";
import { ProfileService } from "apps/profiles/services";
import { GetUserTokenOutput } from "apps/users/dtos";
import { HTTP_STATUS } from "utils";

const MODULE_NAME = 'Profile'

@ApiTags(MODULE_NAME)
@Controller(MODULE_NAME.toLowerCase())
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConflictResponse({ description: `${MODULE_NAME} has already existed` })
  @ApiCreatedResponse({ type: GetProfileOutput })
  async post(
    @Request() req,
    @Body() input: CreateProfileInput,
  ) {
    const { status, profile } = await this.profileService.create(
      input,
      req.user,
    )
    if (status === HTTP_STATUS.Conflict) {
      return {
        status,
        message: `${MODULE_NAME} has already existed`,
      }
    }
    return {
      status,
      profile,
    }
  }

  @Get('switch')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: `${MODULE_NAME} not found` })
  @ApiUnauthorizedResponse({ description: `Unauthorized` })
  @ApiOkResponse({ type: GetUserTokenOutput })
  async switch(
    @Request() req,
    @Query('id') id: string,
  ): Promise<GetUserTokenOutput> {
    const { status, token } = await this.profileService.switch(req.user, id)
    if (status === HTTP_STATUS.Not_Found) {
      return {
        status,
        message: `${MODULE_NAME} not found`,
      }
    } else if (status === HTTP_STATUS.Unauthorized) {
      return {
        status,
        message: `Unauthorized`,
      }
    }
    return {
      status,
      token,
    }
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
    const { profiles, total } = await this.profileService.findAll(
      req.user,
      { search, gender, status, minAge, maxAge, limit }
    )

    return {
      status: HTTP_STATUS.OK,
      profiles,
      total,
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: `${MODULE_NAME} not found` })
  @ApiOkResponse({ type: GetProfileOutput })
  async getMyProfile(
    @Request() req
  ): Promise<GetProfileOutput> {
    const { status, profile } = await this.profileService.findById(req.user, req.user.profile.domain)
    if (status === HTTP_STATUS.Not_Found) {
      return {
        status,
        message: `${MODULE_NAME} not found`,
      }
    }
    return {
      status,
      profile,
    }
  }

  @Get(':domain')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'domain' })
  @ApiNotFoundResponse({ description: `${MODULE_NAME} not found` })
  @ApiForbiddenResponse({ description: `You don't have permission to do that` })
  @ApiOkResponse({ type: GetProfileOutput })
  async getByDomain(
    @Request() req,
    @Param('domain') domain: string
  ): Promise<GetProfileOutput> {
    const { status, profile } = await this.profileService.findById(req.user, domain)
    if (status === HTTP_STATUS.Not_Found) {
      return {
        status,
        message: `${MODULE_NAME} not found`,
      }
    } else if (status === HTTP_STATUS.Forbidden) {
      return {
        status,
        message: `You don't have permission to do that`
      }
    }
    return {
      status,
      profile,
    }
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: `${MODULE_NAME} not found` })
  @ApiOkResponse({ type: GetProfileOutput })
  async patch(
    @Request() req,
    @Body() input: UpdateProfileInput,
  ) {
    const { status, profile } = await this.profileService.update(
      req.user,
      input,
    )
    if (status === HTTP_STATUS.Not_Found) {
      return {
        status,
        message: `${MODULE_NAME} not found`,
      }
    }
    return {
      status,
      profile,
    }
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: `${MODULE_NAME} not found` })
  @ApiOkResponse({ description: `Deleted successfully` })
  async delete(
    @Request() req,
  ) {
    const { status } = await this.profileService.remove(req.user)
    if (status === HTTP_STATUS.Not_Found) {
      return {
        status,
        message: `${MODULE_NAME} not found`,
      }
    }
    return {
      status,
      message: `Deleted successfully`
    }
  }
}