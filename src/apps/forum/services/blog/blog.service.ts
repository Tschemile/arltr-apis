import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserToken } from "apps/auth";
import { BLOG_STATUS } from "apps/forum/constants";
import { CreateBlogInput, QueryBlogInput, UpdateBlogInput } from "apps/forum/dtos";
import { Blog } from "apps/forum/entities";
import { CategoryService } from "apps/settings";
import { ArrayContains, FindOptionsWhere, In, Like, Repository } from "typeorm";
import { generateSlug, HTTP_STATUS } from "utils";

const relations = {
  author: true,
  category: true,
}

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog) private blogRepo: Repository<Blog>,
    @Inject(forwardRef(() => CategoryService)) private categoryService: CategoryService,
  ) { }

  async findOne(where: FindOptionsWhere<Blog>[] | FindOptionsWhere<Blog>) {
    const blog = await this.blogRepo.findOne({
      relations,
      where,
    })
    return blog
  }

  async create(user: UserToken, input: CreateBlogInput) {
    const { title, category: categoryId } = input
    
    const category = await this.categoryService.findOne({ id: categoryId })
    if (!category) {
      return {
        status: HTTP_STATUS.Not_Found,
      }
    }

    const createdBlog = this.blogRepo.create({
      ...input,
      category,
      author: user.profile,
      slug: generateSlug(title),
    })
    await this.blogRepo.save(createdBlog)

    return {
      status: HTTP_STATUS.Created,
      blog: createdBlog
    }
  }

  async findAll(user: UserToken, input: QueryBlogInput) {
    const where: FindOptionsWhere<Blog> = {
      isDeleted: false,
    }

    const { type, search, categories, tags, author, status, limit = 12 } = input
    switch(type) {
      case 'COMMUNITY': {
        where.status = BLOG_STATUS.PUBLIC
        break
      }
      case 'SELF': {
        where.author = { id: user.profile.id }
        if (status) {
          where.status = status
        }
        break
      }
    }

    if (search) {
      where.title = Like(`%${search}%`)
    }

    if (categories && categories.length > 0) {
      where.category = { id: In(categories) }
    }

    if (tags && tags.length > 0) {
      where.tags = ArrayContains(tags)
    }

    if (author) {
      where.author = { id: author }
    }

    const [blogs, total] = await Promise.all([
      this.blogRepo.find({ relations, where, take: limit }),
      this.blogRepo.count({ where })
    ])

    return { blogs, total }
  }

  async update(
    user: UserToken,
    id: string,
    input: UpdateBlogInput
  ) {
    const blog = await this.findOne({ id })
    
    if (!blog) {
      return {
        status: HTTP_STATUS.Not_Found
      }
    } else if (blog.author.id !== user.profile.id) {
      return {
        status: HTTP_STATUS.Forbidden
      }
    }

    const { title, category: categoryId } = input
    
    const category = await this.categoryService.findOne({ id: categoryId })
    if (!category) {
      return {
        status: HTTP_STATUS.Not_Found,
      }
    }

    const slug = title ? generateSlug(title) : blog.slug

    await this.blogRepo.save({
      ...input,
      category,
      slug,
      id
    })

    const updatedBlog = { ...blog, ...input, category, slug }
    return {
      status: HTTP_STATUS.OK,
      blog: updatedBlog
    }
  }

  async remove(user: UserToken, id: string) {
    const blog = await this.findOne({ id })
    
    if (!blog) {
      return {
        status: HTTP_STATUS.Not_Found
      }
    } else if (blog.author.id !== user.profile.id) {
      return {
        status: HTTP_STATUS.Forbidden
      }
    }

    await this.blogRepo.save({
      isDeleted: true,
      deletedAt: new Date(),
      id
    })

    return {
      status: HTTP_STATUS.OK
    }
  }

  async updateVote(id: string, votes: number) {
    await this.blogRepo.save({
      votes,
      id,
    })
  }
}