import { PartialType } from "@nestjs/swagger";
import { CreateGroupInput } from "./create-group.input";

export class UpdateGroupInput extends PartialType(CreateGroupInput) { }