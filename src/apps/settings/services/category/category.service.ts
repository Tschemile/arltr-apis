import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateCategoryInput, UpdateCategoryInput } from "apps/settings/dtos";
import { Category } from "apps/settings/entities";
import { BaseError, BaseService } from "base";
import { FindOptionsWhere, Like, Repository } from "typeorm";
import { TableName } from "utils";

@Injectable()
export class CategoryService extends BaseService<Category> {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) {
    super(categoryRepo, {})
  }

  async create(input: CreateCategoryInput) {
    const createdCategory = this.categoryRepo.create(input)
    await this.categoryRepo.save(createdCategory)

    return createdCategory
  }

  async findAll(search?: string) {
    const where: FindOptionsWhere<Category> = {}
    if (search) {
      where.name = Like(`%${search}%`)
    }

    const {data: categories, total} = await this.find({
      where,
    })

    return { categories, total }
  }

  async update(id: string, input: UpdateCategoryInput) {
    const category = await this.findOne({ id })
    if (!category) {
      BaseError(TableName.CATEGORY, HttpStatus.NOT_FOUND)
    }

    await this.categoryRepo.save({
      ...input,
      id,
    })

    const updateCategory = { ...category, ...input }
    return { category: updateCategory }
  }

  async remove(id: string) {
    const category = await this.findOne({ id })
    if (!category) {
      BaseError(TableName.CATEGORY, HttpStatus.NOT_FOUND)
    }

    await this.categoryRepo.softRemove(category)
  }
}