import { IsUUID } from "class-validator";

export class QueryReactInput {
  @IsUUID(4, { each: true })
  postIds: string[]

  @IsUUID()
  user: string
}