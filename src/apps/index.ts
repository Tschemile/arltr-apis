import { AddressModule } from './address'
import { AuthModule } from './auth'
import { CoursesModule } from './courses'
import { ForumModule } from './forum'
import { GroupModule } from './groups'
import { JobsModule } from './jobs'
import { PostModule } from './posts'
import { ProfileModule } from './profiles'
import { SettingModule } from './settings'
import { ShopModule } from './shop'
import { UploadModule } from './uploads'
import { UserModule } from './users'

const apps  = [
  AddressModule,
  AuthModule,
  ForumModule,
  GroupModule,
  JobsModule,
  PostModule,
  CoursesModule,
  ProfileModule,
  SettingModule,
  ShopModule,
  UploadModule,
  UserModule,
]

export default apps

export * from './address'
export * from './auth'
export * from './forum'
export * from './chats'
export * from './courses'
export * from './groups'
export * from './jobs'
export * from './posts'
export * from './profiles'
export * from './settings'
export * from './shop'
export * from './uploads'
export * from './users'