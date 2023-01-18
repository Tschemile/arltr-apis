import { HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { POLICY_TYPE } from 'apps/settings/constants';
import { CreatePolicyDto } from 'apps/settings/dtos/policy/create-policy.dto';
import { QueryPolicyInput } from 'apps/settings/dtos/policy/query-policy.dto';
import { UpdatePolicyDto } from 'apps/settings/dtos/policy/update-policy.dto';
import { Policy } from 'apps/settings/entities';
import { BaseError, BaseService } from 'base';
import { Equal, FindOptionsWhere, IsNull, Not, Repository } from 'typeorm';
import { TableName } from 'utils';

export class PolicyService extends BaseService<Policy> {
  constructor(
    @InjectRepository(Policy) private policyRepository: Repository<Policy>,
  ) {
    super(policyRepository, {});
  }

  async create(createPolicyDto: CreatePolicyDto, type: POLICY_TYPE) {
    const createPolicy = this.policyRepository.create({
      ...createPolicyDto,
      type,
    });

    await this.policyRepository.save(createPolicy);

    return {
      policy: createPolicy,
    };
  }

  async findAll(query: QueryPolicyInput) {
    const { type = '', limit = 10 } = query || {};

    const where: FindOptionsWhere<Policy> = {
      type: type ? Equal(type) : Not(IsNull()),
    };

    const { data: policies, total } = await this.find({
      where,
      limit,
    });

    return {
      policies,
      total,
    };
  }

  async update(id: string, updatePolicyDto: UpdatePolicyDto) {
    const policy = await this.findOne({ id });

    if (!policy) {
      BaseError(TableName.POLICY, HttpStatus.NOT_FOUND);
    }

    await this.policyRepository.save({
      ...updatePolicyDto,
      id: policy.id,
    });

    return { ...policy, ...updatePolicyDto };
  }

  async remove(id: string) {
    const policy = await this.findOne({ id });

    if (!policy) {
      BaseError(TableName.POLICY, HttpStatus.NOT_FOUND);
    }
    
    return { policy: await this.policyRepository.softRemove(policy) }
  }
}
