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
    const { status, data: address } = await this.validUpsert(
      { id },
      { user: { id: user.profile.id }},
      addressRelations,
    )
    if (status !== HTTP_STATUS.OK) {
      return { status }
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
    const { status, data: address } = await this.validUpsert(
      { id },
      { user: { id: user.profile.id }},
      addressRelations,
    )
    if (status !== HTTP_STATUS.OK) {
      return { status }
    }

    await this.addressRepo.softRemove(address)

    return {
      status: HTTP_STATUS.OK,
    }
  }
}