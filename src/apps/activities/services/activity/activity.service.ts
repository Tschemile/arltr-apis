import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Activity } from "apps/activities/entities";
import { BaseService } from "base";
import { Repository } from "typeorm";

export const activityRelations = {
  user: true,
  notify: true,
  react: true,
  comment: true,
  vote: true,
  reply: true,
  order: true,
  review: true,
  applicant: true,
  certificate: true,
  relation: true,
}

@Injectable()
export class ActivityService extends BaseService<Activity> {
  constructor(
    @InjectRepository(Activity) private activityRepo: Repository<Activity>,
  ) {
    super(activityRepo, activityRelations)
  }
}