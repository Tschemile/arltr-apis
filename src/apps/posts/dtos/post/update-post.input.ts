import { OmitType } from "@nestjs/swagger";
import { CreatePostInput } from "./create-post.input";

export class UpdatePostInput extends OmitType(CreatePostInput, ['group'] as const) {}