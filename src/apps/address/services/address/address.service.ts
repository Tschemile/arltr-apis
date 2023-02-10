import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateAddressInput, UpdateAddressInput } from "apps/address/dtos";
import { Address } from "apps/address/entities";
import { UserToken } from "apps/auth";
import { BaseError, BaseService } from "base";
import { FindOptionsWhere, Repository } from "typeorm";
import { ModuleName } from "utils";

export const addressRelations = {
  user: true,
}

@Injectable()
export class AddressService extends BaseService<Address> {
  constructor(
    @InjectRepository(Address) private addressRepo: Repository<Address>,
  ) {
    super(addressRepo, addressRelations)
  }

  async create(user: UserToken, input: CreateAddressInput) {
    const createdAddress = this.addressRepo.create({
      ...input,
      user: user.profile,
    })

    await this.addressRepo.save(createdAddress)

    return { address: createdAddress }
  }

  async findAll(user: UserToken, limit: number) {
    const where: FindOptionsWhere<Address> = {}

    where.user = {
      id: user.profile.id,
    }

    const { data: addresses, total } = await this.find({
      where,
      limit,
    })

    return { addresses, total }
  }

  async findById(user: UserToken, id: string) {
    const address = await this.findOne({ id })

    if (address.user.id !== user.profile.id) {
      BaseError(ModuleName.ADDRESS, HttpStatus.FORBIDDEN)
    }

    return { address }
  }

  async update(
    user: UserToken,
    id: string,
    input: UpdateAddressInput,
  ) {
    const address = await this.findOne({ id })
    if (!address) {
      BaseError(ModuleName.ADDRESS, HttpStatus.NOT_FOUND)
    } else if (address.user.id !== user.profile.id) {
      BaseError(ModuleName.ADDRESS, HttpStatus.FORBIDDEN)
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
    const address = await this.findOne({ id })
    if (!address) {
      BaseError(ModuleName.ADDRESS, HttpStatus.NOT_FOUND)
    } else if (address.user.id !== user.profile.id) {
      BaseError(ModuleName.ADDRESS, HttpStatus.FORBIDDEN)
    }
    return {
      address: await this.addressRepo.softRemove(address)
    }
  }
}