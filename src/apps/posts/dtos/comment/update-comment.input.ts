import { OmitType } from "@nestjs/swagger";
import { CreateCommentInput } from "./create-comment.input";

export class UpdateCommentInput extends OmitType(CreateCommentInput, ['post'] as const) {}