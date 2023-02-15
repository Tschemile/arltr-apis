import { ApiProperty } from "@nestjs/swagger"
import { FRIEND_STATUS, RELATION_TYPE } from "apps/profiles/constants"
import { IsEnum, IsOptional, IsUUID } from "class-validator"

export class FriendRelationInput {
    @IsUUID()
    @IsOptional()
    @ApiProperty({ type: String, nullable: true })
    user: string
  
    @IsEnum(FRIEND_STATUS)
    @ApiProperty({ type: String, enum: FRIEND_STATUS, required: false })
    @IsOptional()
    status?: string
}