import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateItemInput } from "apps/shop/dtos";
import { Item, Order } from "apps/shop/entities";
import { BaseService } from "base";
import { FindOptionsWhere, Repository } from "typeorm";

const itemRelations = {
  order: true,
  product: true,
}

@Injectable()
export class ItemService extends BaseService<Item> {
  constructor(
    @InjectRepository(Item) private itemRepo: Repository<Item>,
  ) { 
    super(itemRepo, itemRelations)
  }

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

    const { data: items, total } = await this.find({ where })

    return {
      items,
      total,
    }
  }
}