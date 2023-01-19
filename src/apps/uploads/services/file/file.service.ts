import { forwardRef, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserToken } from "apps/auth";
import { Profile, ProfileService, RelationService, RELATION_TYPE } from "apps/profiles";
import { FILE_SCOPE, UPLOAD_TYPE } from "apps/uploads/constants";
import { FileInput } from "apps/uploads/dtos";
import { File } from "apps/uploads/entities";
import { BaseError, BaseService } from "base";
import * as fs from 'fs';
import { Any, FindOptionsWhere, Not, Repository } from "typeorm";
import { TableName } from "utils";

export const fileRelation = {
  owner: true,
}

@Injectable()
export class FileService extends BaseService<File> {
  constructor(
    @InjectRepository(File) private fileRepo: Repository<File>,
    @Inject(forwardRef(() => ProfileService)) private profileService: ProfileService,
    @Inject(forwardRef(() => RelationService)) private relationService: RelationService,
  ) {
    super(fileRepo, fileRelation)
  }

  async create(
    user: UserToken, 
    fileInput: FileInput, 
    type?: UPLOAD_TYPE,
    baseUrl?: string
  )  {
    let url = `https://${baseUrl}/api/file/${fileInput.filename}`
    const createdFile = this.fileRepo.create({
      ...fileInput,
      url,
      owner: user.profile,
    })

    await this.fileRepo.save(createdFile)

    if (type) {
      const profile = await this.profileService.findOne({ id: user.profile.id })
      if (!profile) {
        BaseError(`Profile`, HttpStatus.NOT_FOUND)
      }
      let avatar = profile.avatar
      let cover = profile.cover
      if (type === UPLOAD_TYPE.AVATAR) {
        avatar = url
      } else if (type === UPLOAD_TYPE.COVER) {
        cover = url
      }
      await this.profileService.update(user, {  avatar, cover })
    }

    return url
  }

  async findAll(user: UserToken, profile: Profile, limit?: number) {
    const where: FindOptionsWhere<File> = {
      owner: {
        domain: profile.domain,
      }
    }
    if (profile.id === user.profile.id) {
      where.scope = Any(Object.values(FILE_SCOPE))
    } else {
      const friends = await this.relationService.findOne([
        { requester: { id: user.profile.id }, user: { id: profile.id }, type: RELATION_TYPE.FRIEND }, 
        { requester: { id: profile.id }, user: { id: user.profile.id }, type: RELATION_TYPE.FRIEND },
      ])
      if (friends) {
        where.scope = Not(FILE_SCOPE.PRIVATE)
      } else {
        where.scope = FILE_SCOPE.PUBLIC
      }
    }

    const { data: files, total }= await this.find({ where, limit })

    return { files, total }
  }

  async remove(user: UserToken, id: string) {
    const file = await this.findOne({ id })
    if (!file) {
      BaseError(TableName.FILE, HttpStatus.NOT_FOUND)
    } else if (user.profile.id !== file.owner.id) {
      BaseError(TableName.FILE, HttpStatus.FORBIDDEN)
    }

    await this.removeFile(file.path)

    return {
      file: await this.fileRepo.softRemove(file)
    }
  }

  async removeFile(path: string) {
    return fs.unlink(path, (err) => {
      if (err) throw err
      console.log('Delete file success')
    })
  }
}