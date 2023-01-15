import { ApiProperty } from "@nestjs/swagger";
import { Group } from "apps/groups";
import { Post } from "apps/posts";
import { Profile } from "apps/profiles/entities";
import { File } from "apps/uploads";

export class ProfileFully extends Profile {
  @ApiProperty({ type: () => [Post] })
  posts: Post[]

  @ApiProperty({ type: Number })
  totalPosts: number

  @ApiProperty({ type: () => [Profile] })
  friends: Profile[];

  @ApiProperty({ type: Number })
  totalFriends: number;
  
  @ApiProperty({ type: () => [Profile] })
  pages: Profile[];

  @ApiProperty({ type: Number })
  totalPages: number;
  
  @ApiProperty({ type: () => [Profile] })
  blocks: Profile[];

  @ApiProperty({ type: Number })
  totalBlocks: number;

  @ApiProperty({ type: () => [Profile] })
  followers: Profile[];

  @ApiProperty({ type: Number })
  totalFollowers: number;

  @ApiProperty({ type: () => [Profile] })
  followings: Profile[];

  @ApiProperty({ type: Number })
  totalFollowing: number;

  @ApiProperty({ type: () => [Group] })
  groups: Group[]

  @ApiProperty({ type: Number })
  totalGroups: number

  @ApiProperty({ type: () => [File] })
  albums: File[]

  @ApiProperty({ type: Number })
  totalAlbums: number
}

export class GetProfilesOutput {
  @ApiProperty({ type: () => [Profile] })
  profiles: Profile[]

  @ApiProperty({ type: Number })
  total: number
}

export class GetProfileOutput {
  @ApiProperty({ type: () => Profile })
  profile?: Profile
}

export class GetProfileFullyOutput {
  @ApiProperty({ type: () => ProfileFully })
  profile?: ProfileFully
}
