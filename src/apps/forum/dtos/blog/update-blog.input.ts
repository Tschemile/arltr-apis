import { PartialType } from "@nestjs/swagger";
import { CreateBlogInput } from "./create-blog.input";

export class UpdateBlogInput extends PartialType(CreateBlogInput) { }