import { Body, Controller, Delete, Post, Request } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { Public } from "apps/auth";
import { GetUserTokenOutput, LoginInput, RegisterInput } from "apps/users/dtos";
import { UserService } from "apps/users/services";
import { TableName } from "utils";

@ApiTags(TableName.USER)
@Controller(TableName.USER.toLowerCase())
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  @Public()
  @Post('login')
  @ApiNotFoundResponse({ description: `${TableName.USER} not found` })
  @ApiBadRequestResponse({ description: 'Email or password incorrect' })
  @ApiOkResponse({ type: GetUserTokenOutput })
  async login(@Body() loginUserInput: LoginInput): Promise<GetUserTokenOutput> {
    return await this.userService.login(loginUserInput)
  }

  @Public()
  @Post()
  @ApiConflictResponse({ description: `${TableName.USER} already existed` })
  @ApiCreatedResponse({ type: GetUserTokenOutput })
  async create(@Body() registerInput: RegisterInput)  {
    return await this.userService.register(registerInput)
  }

  @Delete()
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: `${TableName.USER} not found` })
  @ApiOkResponse({ description: `Deleted successfully` })
  async delete(
    @Request() req,
  ) {
    return await this.userService.remove(req.user)
  }
}