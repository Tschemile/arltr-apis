import { DeepPartial, FindOptionsOrder, FindOptionsRelations, FindOptionsWhere, Repository } from "typeorm";
import { Base } from "./base.entity";
import { BaseGroupType } from "./base.dto";

export class BaseService<Entity extends Base> {
  constructor(
    public repository: Repository<Entity>,
    public relations: FindOptionsRelations<Entity>,
  ) { }

  async insertOne(data: DeepPartial<Entity>): Promise<Entity> {
    const createdEntity = this.repository.create(data)

    await this.repository.save(createdEntity)

    return createdEntity
  }

  async insertMultiple(data: DeepPartial<Entity>[]): Promise<Entity[]> {
    const multiEntity: Entity[] = []
    for (const entity of data) {
      multiEntity.push(this.repository.create(entity))
    }

    await this.repository.save(multiEntity)

    return multiEntity
  }

  async findOne(
    where: FindOptionsWhere<Entity>[] | FindOptionsWhere<Entity>,
  ): Promise<Entity | null> {
    const data = await this.repository.findOne({ relations: this.relations, where })
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
    let take = 1000, skip = 0
    if (limit) {
      take = limit
    }

    if (page) {
      skip = (page - 1) * take
    }

    const results = await this.repository.findAndCount({
      where,
      relations: this.relations,
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
  ): Promise<void> {
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

  async group(where: FindOptionsWhere<Entity>, key: string): Promise<BaseGroupType[]> {
    const { data, total } = await this.find({ where })
    const groupRaw = data.reduce((obj, x) => {
      if (!obj[x[key]]) {
        obj[x[key]] = []
      }
      obj[x[key]].push(x)
      return obj
    }, {})

    const groups: BaseGroupType[] = []
    for (const key in groupRaw) {
      if (Object.prototype.hasOwnProperty.call(groupRaw, key)) {
        const element = groupRaw[key];
        groups.push({
          type: key,
          total: element.length,
        })
      }
    }
    groups.push({
      type: 'ALL',
      total,
    })

    return groups
  }
}