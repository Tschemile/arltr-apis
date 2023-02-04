export enum MEMBER_ROLE {
  ADMIN = 'ADMIN',
  MODS = 'MODS',
  MEMBER = 'MEMBER',
}

export enum MEMBER_STATUS {
  REQUESTING = 'REQUESTING',
  INVITING = 'INVITING',
  ACTIVE = 'ACTIVE',
  BANNED = 'BANNED'
}

export enum QUERY_MEMBER_TYPE {
  GROUP = 'GROUP',
  USER = 'USER'
}

export const MEMBER_WITH_GROUP = {
  IN: [
    MEMBER_STATUS.ACTIVE.toString(),
    MEMBER_STATUS.BANNED.toString(),
  ],
  OUT: [
    MEMBER_STATUS.INVITING.toString(),
    MEMBER_STATUS.REQUESTING.toString(),
  ]
}
