export class UserToken {
  id: string
  username: string
  profile: {
    id: string
    name: string
    gender: string
    birth: Date
    domain: string
    role: string
    status: string
  }
}