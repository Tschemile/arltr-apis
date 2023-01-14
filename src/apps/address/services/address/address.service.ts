import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateAddressInput, UpdateAddressInput } from "apps/address/dtos";
import { Address } from "apps/address/entities";
import { UserToken } from "apps/auth";
import { BaseError, BaseService } from "base";
import { FindOptionsWhere, Repository } from "typeorm";

const MODULE_NAME = 'Address'

const addressRelations = {
  user: true,
}

@Injectable()
export class AddressService extends BaseService<Address> {
  constructor(
    @InjectRepository(Address) private addressRepo: Repository<Address>,
  ) {
    super(addressRepo)
  }

  async create(user: UserToken, input: CreateAddressInput) {
    const createdAddress = this.addressRepo.create({
      ...input,
      user: user.profile,
    })

    await this.addressRepo.save(createdAddress)

    return { address: createdAddress }
  }

  async findAll(user: UserToken, take: number) {
    const where: FindOptionsWhere<Address> = {}

    where.user = {
      id: user.profile.id,
    }

    const { data: addresses, total } = await this.find({
      where,
      relations: addressRelations,
      take,
    })

    return { addresses, total }
  }

  async update(
    user: UserToken,
    id: string,
    input: UpdateAddressInput,
  ) {
    const address = await this.findOne({ id }, addressRelations)
    if (!address) {
      BaseError(MODULE_NAME, HttpStatus.NOT_FOUND)
    } else if (address.user.id !== user.profile.id) {
      BaseError(MODULE_NAME, HttpStatus.FORBIDDEN)
    }

    await this.addressRepo.save({
      ...input,
      id,
    })

    const updatedAddress = { ...address, ...input }
    return { address: updatedAddress }
  }

  async remove(
    user: UserToken,
    id: string,
  ) {
    const address = await this.findOne({ id }, addressRelations)
    if (!address) {
      BaseError(MODULE_NAME, HttpStatus.NOT_FOUND)
    } else if (address.user.id !== user.profile.id) {
      BaseError(MODULE_NAME, HttpStatus.FORBIDDEN)
    }
    await this.addressRepo.softRemove(address)
  }
}