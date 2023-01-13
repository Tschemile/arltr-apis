import { FindOptionsOrder, FindOptionsRelations, FindOptionsWhere, Repository } from "typeorm";
import { HTTP_STATUS } from "utils";
import { Base } from "./base.entity";

export class BaseService<Entity extends Base> {
  constructor(
    public repository: Repository<Entity>,
  ) { }

  async findOne(
    where: FindOptionsWhere<Entity>[] | FindOptionsWhere<Entity>,
    relations?: FindOptionsRelations<Entity>,
  ) {
    const data = await this.repository.findOne({ relations, where })
    return data
  }

  async find({
    where,
    relations,
    order,
    take,
  }: {
    where: FindOptionsWhere<Entity>[] | FindOptionsWhere<Entity>,
    relations?: FindOptionsRelations<Entity>,
    order?: FindOptionsOrder<Entity>,
    take?: number,
  }) {
    const [data, total] = await Promise.all([
      this.repository.find({ where, relations, take, order }),
      this.repository.count({ where }),
    ])

    return { data, total }
  }

  async validUpsert(
    whereIsFound: FindOptionsWhere<Entity>, 
    whereIsAuthor: FindOptionsWhere<Entity>,
    relations: FindOptionsRelations<Entity>,
  ) {
    const [isFound, isAuthor] = await Promise.all([
      this.repository.findOne({ where: whereIsFound }),
      this.repository.findOne({ where: whereIsAuthor, relations })
    ])

    if (!isFound) {
      return { status: HTTP_STATUS.Not_Found }
    }
    if (!isAuthor) {
      return { status: HTTP_STATUS.Forbidden }
    }

    return { status: HTTP_STATUS.OK, data: isAuthor }
  }
}