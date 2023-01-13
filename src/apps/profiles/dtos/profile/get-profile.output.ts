import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Group } from "apps/groups";
import { Post } from "apps/posts";
import { File } from "apps/uploads";
import { Profile } from "apps/profiles/entities";
import { BaseOutputResponse } from "base";
import { IsArray } from "class-validator";


export class ProfileFully extends Profile {
  @ApiProperty({ type: [Post] })
  posts: Post[]

  @ApiProperty({ type: Number })
  totalPosts: number

  @ApiProperty({ type: [Profile] })
  friends: Profile[];

  @ApiProperty({ type: [Profile] })
  pages: Profile[];

  @ApiProperty({ type: [Profile] })
  blocks: Profile[];

  @ApiProperty({ type: [Profile] })
  followers: Profile[];

  @ApiProperty({ type: [Profile] })
  followings: Profile[];

  @ApiProperty({ type: Number })
  totalFriends: number;

  @ApiProperty({ type: Number })
  totalBlocks: number;

  @ApiProperty({ type: Number })
  totalPages: number;

  @ApiProperty({ type: Number })
  totalFollowers: number;

  @ApiProperty({ type: Number })
  totalFollowing: number;

  @ApiProperty({ type: [Group] })
  groups: Group[]

  @ApiProperty({ type: Number })
  totalGroups: number

  @ApiProperty({ type: [File] })
  albums: File[]

  @ApiProperty({ type: Number })
  totalAlbums: number
}
export class GetProfilesOutput extends BaseOutputResponse {
  @IsArray()
  @ApiProperty({ type: [Profile ] })
  profiles: Profile[]
}

export class GetProfileOutput extends OmitType(BaseOutputResponse, ['total' as const]) {
  @ApiProperty({ type: Profile })
  profile?: Profile
}

export class GetProfileFullyOutput extends OmitType(BaseOutputResponse, ['total' as const]) {
  @ApiProperty({ type: ProfileFully })
  profile?: ProfileFully
}
