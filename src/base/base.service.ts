import { FindOptionsRelations, FindOptionsWhere, Repository } from "typeorm";
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
}