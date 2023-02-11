
import { ConfigService } from '@nestjs/config'
import {
  Address,
  Album,
  Applicant,
  Blog,
  Category,
  Certificate,
  Chat,
  Comment,
  Course,
  Event,
  File,
  Group,
  Item,
  Job,
  Lesson,
  Member,
  Message,
  Order,
  Participant,
  Policy,
  Post,
  Product,
  Profile,
  React,
  Relation,
  Reply,
  Report,
  Responded,
  Resume,
  Review,
  Tag,
  User,
  Verify,
  Vote
} from 'apps'
import { config } from 'dotenv'
import { UpdatePost1675778095160 } from 'migrations/1675778095160-UpdatePost'
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
    User, Profile, Relation,
    Product, Review, Order, Item, 
    Blog, Vote, Reply, 
    Group, Member, 
    Post, React, Comment, Tag,
    Address, Event, Responded, 
    Policy, Report, Category,
    File, Album, 
    Course, Certificate, Lesson,
    Job, Applicant, Resume,
    Chat, Message, Participant, Verify
  ],
  migrations: [__dirname + "./migrations/*{.ts,.js}", UpdatePost1675778095160],
  migrationsTableName: 'migrations',
})