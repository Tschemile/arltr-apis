import { FindOptionsOrder, FindOptionsRelations, FindOptionsWhere, Repository } from "typeorm";
import { Base } from "./base.entity";

export class BaseService<Entity extends Base> {
  constructor(
    public repository: Repository<Entity>,
    public relation: FindOptionsRelations<Entity>,
  ) { }

  async findOne(
    where: FindOptionsWhere<Entity>[] | FindOptionsWhere<Entity>,
  ): Promise<Entity | null> {
    const data = await this.repository.findOne({ relations: this.relation, where })
    return data
  }

  async find({
    where,
    order,
    limit,
  }: {
    where: FindOptionsWhere<Entity>[] | FindOptionsWhere<Entity>,
    order?: FindOptionsOrder<Entity>,
    limit?: number,
  }): Promise<{
    data: Entity[],
    total: number,
  }> {
    const results = await this.repository.findAndCount({
      where,
      relations: this.relation,
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
    switch (type) {
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

  async groupBy(
    where: FindOptionsWhere<Entity>,
    key: string,
  ) {
    const { data } = await this.find({ where })
    const group = data.reduce((obj, x) => {
      if (!obj[x[key]]) {
        obj[x[key]] = []
      }
      obj[x[key]].push(x)
      return obj
    }, {})

    return group
  }
}