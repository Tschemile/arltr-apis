import { Body, Controller, Delete, Post, Request, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "apps/auth";
import { GetUserTokenOutput, LoginInput, RegisterInput } from "apps/users/dtos";
import { UserService } from "apps/users/services";
import { HTTP_STATUS } from "utils";

const MODULE_NAME = 'User'

@ApiTags(MODULE_NAME)
@Controller(MODULE_NAME.toLowerCase())
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  @Post('login')
  @ApiNotFoundResponse({ description: `${MODULE_NAME} not found` })
  @ApiBadRequestResponse({ description: 'Email or password incorrect' })
  @ApiOkResponse({ type: GetUserTokenOutput })
  async login(@Body() loginUserInput: LoginInput): Promise<GetUserTokenOutput> {
    const { status, token } = await this.userService.login(loginUserInput)
    if (status === HTTP_STATUS.Not_Found) {
      return {
        status,
        message: `${MODULE_NAME} not found`,
      }
    }
    else if (status === HTTP_STATUS.Bad_Request) {
      return {
        status,
        message: 'Email or password incorrect',
      }
    } else if (status === HTTP_STATUS.OK) {
      return {
        status,
        token,
      }
    }
  }

  @Post()
  @ApiConflictResponse({ description: `${MODULE_NAME} already existed` })
  @ApiCreatedResponse({ type: GetUserTokenOutput })
  async create(@Body() registerInput: RegisterInput): Promise<GetUserTokenOutput> {
    const { status, token } = await this.userService.register(registerInput)
    if (status === HTTP_STATUS.Conflict) {
      return {
        status,
        message: `${MODULE_NAME} already existed`,
      }
    } else if (status === HTTP_STATUS.Created) {
      return {
        status,
        token,
      }
    }
  }

  @Post('admin')
  @ApiConflictResponse({ description: `${MODULE_NAME} already existed` })
  @ApiCreatedResponse({ type: GetUserTokenOutput })
  async createAdmin(@Body() registerInput: RegisterInput): Promise<GetUserTokenOutput> {
    const { status, token } = await this.userService.register(registerInput, true)
    if (status === HTTP_STATUS.Conflict) {
      return {
        status,
        message: `${MODULE_NAME} already existed`,
      }
    } else if (status === HTTP_STATUS.Created) {
      return {
        status,
        token,
      }
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
    const { status } = await this.userService.delete(req.user)
    if (status === HTTP_STATUS.Not_Found) {
      return {
        status,
        message: `${MODULE_NAME} not found`,
      }
    } else if (status === HTTP_STATUS.Not_Modified) {
      return {
        status,
        message: `${MODULE_NAME} has already deleted`,
      }
    }
    return {
      status,
      message: `Deleted successfully`
    }
  }
}