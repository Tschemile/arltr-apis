import { Body, Controller, Delete, Post, Request, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "apps/auth";
import { GetUserTokenOutput, LoginInput, RegisterInput } from "apps/users/dtos";
import { UserService } from "apps/users/services";

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
    return await this.userService.login(loginUserInput)
  }

  @Post()
  @ApiConflictResponse({ description: `${MODULE_NAME} already existed` })
  @ApiCreatedResponse({ type: GetUserTokenOutput })
  async create(@Body() registerInput: RegisterInput): Promise<GetUserTokenOutput> {
    return await this.userService.register(registerInput)
  }

  @Post('admin')
  @ApiConflictResponse({ description: `${MODULE_NAME} already existed` })
  @ApiCreatedResponse({ type: GetUserTokenOutput })
  async createAdmin(@Body() registerInput: RegisterInput): Promise<GetUserTokenOutput> {
    return await this.userService.register(registerInput, true)
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: `${MODULE_NAME} not found` })
  @ApiOkResponse({ description: `Deleted successfully` })
  async delete(
    @Request() req,
  ) {
    return await this.userService.delete(req.user)
  }
}