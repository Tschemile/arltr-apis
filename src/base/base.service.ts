import { DeepPartial, FindOptionsOrder, FindOptionsRelations, FindOptionsWhere, Repository } from "typeorm";
import { Base } from "./base.entity";

export class BaseService<Entity extends Base> {
  constructor(
    public repository: Repository<Entity>,
    public relation: FindOptionsRelations<Entity>,
  ) { }

  async insertOne(data: DeepPartial<Entity>): Promise<Entity> {
    const createdEntity = this.repository.create(data)

    await this.repository.save(createdEntity)

    return createdEntity
  }

  async insertMultiple(data: DeepPartial<Entity>[]): Promise<Entity[]> {
    const multiEntity: Entity[] = []
    for(const entity of data) {
      multiEntity.push(this.repository.create(entity))
    }

    await this.repository.save(multiEntity)

    return multiEntity
  }

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
    page,
  }: {
    where: FindOptionsWhere<Entity>[] | FindOptionsWhere<Entity>,
    order?: FindOptionsOrder<Entity>,
    limit?: number,
    page?: number,
  }): Promise<{
    data: Entity[],
    total: number,
  }> {
    let take = 1, skip = 0
    if (limit) {
      take = limit
    }

    if (page) {
      skip = (page - 1) * take
    }

    const results = await this.repository.findAndCount({
      where,
      relations: this.relation,
      take,
      skip,
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

  async groupCountNumber(name: string, key: string): Promise<Entity[]> {
    const group = await this.repository.createQueryBuilder(`${name}`)
      .select(`${name}.${key}, COUNT(*) as counter`)
      .groupBy(`${name}.${key}`)
      .orderBy('counter')
      .getMany()

    return group
  }
}