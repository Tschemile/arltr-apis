import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateItemInput } from "apps/shop/dtos";
import { Item, Order } from "apps/shop/entities";
import { FindOptionsWhere, Repository } from "typeorm";

const itemRelations = {
  order: true,
  product: true,
}

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item) private itemRepo: Repository<Item>,
  ) { }

  async insertMany(items: CreateItemInput[]) {
    const createdItems = this.itemRepo.create(items)
    await this.itemRepo.insert(createdItems)

    return createdItems
  }

  async findAll(order: Order) {
    const where: FindOptionsWhere<Item> = {
      order: {
        id: order.id,
      }
    }

    const [items, total] = await Promise.all([
      this.itemRepo.find({ relations: itemRelations, where }),
      this.itemRepo.count({ where })
    ])

    return {
      items,
      total,
    }
  }
}