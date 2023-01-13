import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateAddressInput, UpdateAddressInput } from "apps/address/dtos";
import { Address } from "apps/address/entities";
import { UserToken } from "apps/auth";
import { BaseService } from "base";
import { FindOptionsWhere, Repository } from "typeorm";
import { HTTP_STATUS } from "utils";

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

    return createdAddress
  }

  async findAll(user: UserToken) {
    const where: FindOptionsWhere<Address> = {}

    where.user = {
      id: user.profile.id,
    }

    const [addresses, total] = await Promise.all([
      this.addressRepo.find({ relations: addressRelations, where }),
      this.addressRepo.count({ where }),
    ])

    return { addresses, total }
  }

  async update(
    user: UserToken,
    id: string,
    input: UpdateAddressInput,
  ) {
    const address = await this.findOne({ id }, addressRelations)
    if (!address) {
      return {
        status: HTTP_STATUS.Not_Found
      }
    } else if (address.user.id !== user.profile.id) {
      return {
        status: HTTP_STATUS.Unauthorized
      }
    }

    await this.addressRepo.save({
      ...input,
      id,
    })

    const updatedAddress = { ...address, ...input }
    return {
      status: HTTP_STATUS.OK,
      address: updatedAddress,
    }
  }

  async remove(
    user: UserToken,
    id: string,
  ) { 
    const address = await this.findOne({ id }, addressRelations)
    if (!address) {
      return {
        status: HTTP_STATUS.Not_Found
      }
    } else if (address.user.id !== user.profile.id) {
      return {
        status: HTTP_STATUS.Unauthorized
      }
    }

    await this.addressRepo.softRemove(address)

    return {
      status: HTTP_STATUS.OK,
    }
  }
}