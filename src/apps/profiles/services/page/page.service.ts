import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserToken } from "apps/auth";
import { GENDER, RELATION_TYPE, USER_ROLE } from "apps/profiles/constants";
import { CreatePageInput, QueryPageInput, UpdatePageInput } from "apps/profiles/dtos";
import { Profile } from "apps/profiles/entities";
import { CategoryService } from "apps/settings";
import { BaseService } from "base";
import { FindOptionsWhere, Like, Repository } from "typeorm";
import { HTTP_STATUS } from "utils";
import { relateRelations, RelationService } from "../relation";

export const pageRelations = {
  category: true
}

@Injectable()
export class PageService extends BaseService<Profile> {
  constructor(
    @InjectRepository(Profile) private pageRepo: Repository<Profile>,
    @Inject(forwardRef(() => CategoryService)) private categoryService: CategoryService,
    private relationService: RelationService,
  ) {
    super(pageRepo)
  }

  async create(user: UserToken, input: CreatePageInput) {
    const { category: categoryId } = input

    const category = await this.categoryService.findOne({ id: categoryId })
    if (!category) {
      return {
        status: HTTP_STATUS.Not_Found,
      }
    }

    const createdPage = this.pageRepo.create({
      ...input,
      birth: new Date(),
      gender: GENDER.NONE,
      category,
      role: USER_ROLE.PAGE,
      user,
    })
    await this.pageRepo.save(createdPage)
    await this.relationService.create(user, { 
      user: createdPage.id,
      type: RELATION_TYPE.OWNER,
    })

    return {
      status: HTTP_STATUS.Created,
      page: createdPage,
    }
  }

  async findAll(query: QueryPageInput) {
    const {
      search = '',
      category: categoryId = '',
      limit: take = 10,
    } = query || {}

    const where: FindOptionsWhere<Profile> = {
      isDeleted: false,
      role: USER_ROLE.PAGE,
    }

    if (search) {
      where.name = Like(`%${search}%`)
    }

    if (categoryId) {
      const category = await this.categoryService.findOne({ id: categoryId })
      if (!category) {
        return {
          status: HTTP_STATUS.Not_Found,
        }
      }

      where.category = { id: category.id }
    }

    const [pages, total] = await Promise.all([
      this.pageRepo.find({ where, take, relations: pageRelations }),
      this.pageRepo.count({ where })
    ])

    return {
      status: HTTP_STATUS.OK,
      pages, 
      total 
    }
  }

  async validAuthorization(user: UserToken, id: string) {
    const page = await this.findOne({ id })
    if (!page) {
      return {
        status: HTTP_STATUS.Not_Found,
      }
    }

    const relation = await this.relationService.findOne({
      type: RELATION_TYPE.OWNER,
      requester: { id: user.profile.id },
      user: { id: page.id }
    }, relateRelations)
    if (!relation) {
      return {
        status: HTTP_STATUS.Forbidden
      }
    }

    return {
      status: HTTP_STATUS.OK,
      page,
    }
  }

  async update(
    user: UserToken, 
    id: string,
    input: UpdatePageInput,
  ) { 
    const { status, page } = await this.validAuthorization(user, id)
    if (status !== HTTP_STATUS.OK) {
      return { status }
    }

    const { category: categoryId } = input

    const category = await this.categoryService.findOne({ id: categoryId })
    if (!category) {
      return {
        status: HTTP_STATUS.Not_Found,
      }
    }

    await this.pageRepo.save({
      ...input,
      category,
      id,
    })

    return {
      status: HTTP_STATUS.OK,
      page: {
        ...page,
        ...input,
        category,
      }
    }
  }

  async remove(user: UserToken, id: string) {
    const { status } = await this.validAuthorization(user, id)
    if (status !== HTTP_STATUS.OK) {
      return { status }
    }

    await this.pageRepo.save({
      isDeleted: true,
      deletedAt: new Date(),
      id,
    })

    return {
      status: HTTP_STATUS.OK,
    }
  }
}