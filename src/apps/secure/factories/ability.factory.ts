import { InferSubjects } from "@casl/ability";
import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType } from "@casl/ability/dist/types";
import { Injectable } from "@nestjs/common";
import { Post, POST_MODE } from "apps/posts";
import { Profile, USER_ROLE } from "apps/profiles";
import { Action } from "utils";

type Subjects = InferSubjects<typeof Post | typeof Profile> | 'all'

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class AbilityFactory {
  createForUser(profile: Profile) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>)

    if (profile.role === USER_ROLE.ADMIN) {
      can(Action.Manage, 'all')
    } else {
      can(Action.Read, 'all')
    }

    can(Action.Update, Post, { author: profile })
    cannot(Action.Delete, Post, { mode: POST_MODE.PUBLIC })

    return build({
      detectSubjectType: (item) =>
        item.id as ExtractSubjectType<Subjects>,
    })
  }
}