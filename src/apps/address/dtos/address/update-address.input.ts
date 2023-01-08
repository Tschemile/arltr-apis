import { PartialType } from '@nestjs/swagger';
import { CreateAddressInput } from './create-address.input';

export class UpdateAddressInput extends PartialType(CreateAddressInput) {}
