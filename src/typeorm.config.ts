
import { ConfigService } from '@nestjs/config'
import { Address, Blog, Category, Comment, Group, Item, Member, Order, Post, Product, Profile, React, Relation, Reply, Review, User, Vote } from 'apps'
import { config } from 'dotenv'
import { UpdatePost1673275088811 } from 'migrations/1673275088811-UpdatePost'
import { DataSource } from 'typeorm'

config()
const configService = new ConfigService()

export default new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USER'),
  password: configService.get('DB_PASS'),
  database: configService.get('DB_NAME'),
  entities: [
    User, Profile, Product, Address, Category, Review, Order, Item, Relation, Blog, Vote, Reply, Group, Member, Post, React, Comment,
  ],
  migrations: [__dirname + "./migrations/*{.ts,.js}", UpdatePost1673275088811],
  migrationsTableName: 'migrations',
})