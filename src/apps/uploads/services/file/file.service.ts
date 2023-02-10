import { forwardRef, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserToken } from "apps/auth";
import { Profile, ProfileService, RelationService, RELATION_TYPE } from "apps/profiles";
import { FILE_SCOPE, UPLOAD_TYPE } from "apps/uploads/constants";
import { FileMetaInput, FileUploadInput, QueryFileInput, UpdateFileInput } from "apps/uploads/dtos";
import { File } from "apps/uploads/entities";
import { deleteFromCloudinary } from "apps/uploads/utils";
import { BaseError, BaseService } from "base";
import { Any, DeepPartial, FindOptionsWhere, In, Not, Repository } from "typeorm";
import { ModuleName } from "utils";
import { AlbumService } from "../album";

export const fileRelation = {
  owner: true,
  album: true,
}

@Injectable()
export class FileService extends BaseService<File> {
  constructor(
    @InjectRepository(File) private fileRepo: Repository<File>,
    @Inject(forwardRef(() => ProfileService)) private profileService: ProfileService,
    @Inject(forwardRef(() => RelationService)) private relationService: RelationService,
    @Inject(forwardRef(() => AlbumService)) private albumService: AlbumService,
  ) {
    super(fileRepo, fileRelation)
  }

  async create(
    user: UserToken, 
    file: Express.Multer.File, 
    input: FileMetaInput,
  )  {
    const { album: albumId, scope, type } = input

    const fileData: DeepPartial<File> = {
      owner: user.profile,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
      url: file.path,
      scope,
    }

    if (albumId) {
      const album = await this.albumService.findOne({ id: albumId })
      if (!album) {
        BaseError(ModuleName.ALBUM, HttpStatus.NOT_FOUND)
      } else if (album.user.id !== user.profile.id) {
        BaseError(ModuleName.ALBUM, HttpStatus.FORBIDDEN)
      }

      fileData.album = album
    }

    const createdFile = await this.insertOne(fileData)

    if (type) {
      const profile = await this.profileService.findOne({ id: user.profile.id })
      if (!profile) {
        BaseError(ModuleName.PROFILE, HttpStatus.NOT_FOUND)
      }
      let avatar = profile.avatar
      let cover = profile.cover
      if (type === UPLOAD_TYPE.AVATAR) {
        avatar = createdFile.url
      } else if (type === UPLOAD_TYPE.COVER) {
        cover = createdFile.url
      }
      await this.profileService.update(user, {  avatar, cover })
    }

    return createdFile
  }

  async findAll(user: UserToken, query: QueryFileInput) {
    const { user: userId, album: albumId, limit } = query
    const where: FindOptionsWhere<File> = {
      owner: {
        id: userId
      }
    }

    if (albumId) {
      where.album = { id: albumId }
    }

    if (userId === user.profile.id) {
      where.scope = Not(FILE_SCOPE.HIDDEN)
    } else {
      const friends = await this.relationService.findOne([
        { requester: { id: user.profile.id }, user: { id: userId }, type: RELATION_TYPE.FRIEND }, 
        { requester: { id: userId }, user: { id: user.profile.id }, type: RELATION_TYPE.FRIEND },
      ])
      if (friends) {
        where.scope = In([FILE_SCOPE.FRIEND, FILE_SCOPE.PUBLIC])
      } else {
        where.scope = FILE_SCOPE.PUBLIC
      }
    }

    const { data: files, total }= await this.find({ where, limit })

    return { files, total }
  }

  async update(user: UserToken, id: string, input: UpdateFileInput) {
    const file = await this.findOne({ id })
    if (!file) {
      BaseError(ModuleName.FILE, HttpStatus.NOT_FOUND)
    } else if (user.profile.id !== file.owner.id) {
      BaseError(ModuleName.FILE, HttpStatus.FORBIDDEN)
    }

    const { album: albumId } = input
    const album = await this.albumService.findOne({ id: albumId })
    if (!album) {
      BaseError(ModuleName.ALBUM, HttpStatus.NOT_FOUND)
    } else if (user.profile.id !== album.user.id) {
      BaseError(ModuleName.ALBUM, HttpStatus.FORBIDDEN)
    }

    await this.fileRepo.save({
      album,
      id,
    })

    return { file: { ...file, album }}
  }

  async remove(user: UserToken, id: string) {
    const file = await this.findOne({ id })
    if (!file) {
      BaseError(ModuleName.FILE, HttpStatus.NOT_FOUND)
    } else if (user.profile.id !== file.owner.id) {
      BaseError(ModuleName.FILE, HttpStatus.FORBIDDEN)
    }

    await deleteFromCloudinary(file.filename)

    return {
      file: await this.fileRepo.softRemove(file)
    }
  }

  async createMultiple(user: UserToken, fileInputs: Express.Multer.File[]) {
    const files: DeepPartial<File>[] = []

    for (const file of fileInputs) {
      files.push({
        owner: user.profile,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path,
        url: file.path,
      })
    }

    const createdFiles = await this.insertMultiple(files)
    return createdFiles
  }
}