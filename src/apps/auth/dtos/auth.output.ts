import { Profile } from "apps/profiles"

export class UserToken {
  id: string
  username: string
  profile: Profile
  exp?: number
}