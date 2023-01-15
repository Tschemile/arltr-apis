import { forwardRef, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserToken } from "apps/auth";
import { GENDER, RELATION_TYPE, USER_ROLE } from "apps/profiles/constants";
import { CreatePageInput, QueryPageInput, UpdatePageInput } from "apps/profiles/dtos";
import { Profile } from "apps/profiles/entities";
import { CategoryService } from "apps/settings";
import { BaseError, BaseService } from "base";
import { FindOptionsWhere, Like, Repository } from "typeorm";
import { TableName } from "utils";
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
      BaseError(TableName.CATEGORY, HttpStatus.NOT_FOUND)
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
      page: createdPage,
    }
  }

  async findAll(query: QueryPageInput) {
    const {
      search = '',
      category: categoryId = '',
      limit,
    } = query || {}

    const where: FindOptionsWhere<Profile> = {
      role: USER_ROLE.PAGE,
    }

    if (search) {
      where.name = Like(`%${search}%`)
    }

    if (categoryId) {
      const category = await this.categoryService.findOne({ id: categoryId })
      if (!category) {
        BaseError(TableName.CATEGORY, HttpStatus.NOT_FOUND)
      }

      where.category = { id: category.id }
    }

    const { data: pages, total } = await this.find({
      where,
      relations: pageRelations,
      limit,
    })

    return {
      pages,
      total
    }
  }

  async findById(id: string) {
    const page = await this.findOne({ id }, pageRelations)

    return { page }
  }

  async validAuthorization(user: UserToken, id: string) {
    const page = await this.findOne({ id }, pageRelations)
    if (!page) {
      BaseError(TableName.PAGE, HttpStatus.NOT_FOUND)
    }

    const relation = await this.relationService.findOne({
      type: RELATION_TYPE.OWNER,
      requester: { id: user.profile.id },
      user: { id: page.id }
    }, relateRelations)
    if (!relation) {
      BaseError(TableName.PAGE, HttpStatus.FORBIDDEN)
    }

    return { page }
  }

  async update(
    user: UserToken,
    id: string,
    input: UpdatePageInput,
  ) {
    const { page } = await this.validAuthorization(user, id)
    const { category: categoryId } = input

    let newCategory = page.category
    if (categoryId) {
      const category = await this.categoryService.findOne({ id: categoryId })
      if (!category) {
        BaseError(TableName.CATEGORY, HttpStatus.NOT_FOUND)
      }
      newCategory = category
    }

    await this.pageRepo.save({
      ...input,
      category: newCategory,
      id,
    })

    return {
      page: {
        ...page,
        ...input,
        category: newCategory,
      }
    }
  }

  async remove(user: UserToken, id: string) {
    const { page } = await this.validAuthorization(user, id)

    return {
      page: await this.pageRepo.softRemove(page)
    }
  }
}