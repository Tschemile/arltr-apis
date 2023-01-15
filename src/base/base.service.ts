import { FindOptionsOrder, FindOptionsRelations, FindOptionsWhere, Repository } from "typeorm";
import { Base } from "./base.entity";

export class BaseService<Entity extends Base> {
  constructor(
    public repository: Repository<Entity>,
  ) { }

  async findOne(
    where: FindOptionsWhere<Entity>[] | FindOptionsWhere<Entity>,
    relations?: FindOptionsRelations<Entity>,
  ): Promise<Entity | null> {
    const data = await this.repository.findOne({ relations, where })
    return data
  }

  async find({
    where,
    relations,
    order,
    limit,
  }: {
    where: FindOptionsWhere<Entity>[] | FindOptionsWhere<Entity>,
    relations?: FindOptionsRelations<Entity>,
    order?: FindOptionsOrder<Entity>,
    limit?: number,
  }): Promise<{
    data: Entity[],
    total: number,
  }> {
    const results = await this.repository.findAndCount({
      where,
      relations,
      take: limit,
      order,
    })

    return {
      data: results[0],
      total: results[1],
    }
  }

  async changeProperty(
    where: FindOptionsWhere<Entity>,
    propertyPath: string,
    value: number,
    type: 'INCREMENT' | 'DECREMENT'
  ) {
    switch(type) {
      case 'INCREMENT': {
        await this.repository.increment(where, propertyPath, value)
        break
      }
      case 'DECREMENT': {
        await this.repository.decrement(where, propertyPath, value)
        break
      }
    }
  }
}