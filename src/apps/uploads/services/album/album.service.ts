import { forwardRef, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserToken } from "apps/auth";
import { ProfileService, RelationService } from "apps/profiles";
import { FILE_SCOPE } from "apps/uploads/constants";
import { CreateAlbumInput, QueryAlbumInput, UpdateAlbumInput } from "apps/uploads/dtos";
import { Album } from "apps/uploads/entities";
import { BaseError, BaseService } from "base";
import { FindOptionsWhere, Not, Repository } from "typeorm";
import { TableName } from "utils";

export const albumRelation = {
  user: true
}

@Injectable()
export class AlbumService extends BaseService<Album> {
  constructor(
    @InjectRepository(Album) private albumRepo: Repository<Album>,
    @Inject(forwardRef(() => ProfileService)) private profileService: ProfileService,
    @Inject(forwardRef(() => RelationService)) private relationService: RelationService,
    ) {
    super(albumRepo, albumRelation)
  }

  async create(user: UserToken, input: CreateAlbumInput) {
    const createdAlbum = await this.insertOne({
      ...input,
      user: user.profile,
    })

    return { album: createdAlbum }
  }

  async findAll(user: UserToken, query: QueryAlbumInput) {
    const { user: userId } = query
    const profile = await this.profileService.findOne({ id: userId })
    if (!profile) {
      BaseError(TableName.PROFILE, HttpStatus.NOT_FOUND)
    }

    const where: FindOptionsWhere<Album> = {
      user: {
        id: profile.id,
      }
    }

    if (user.profile.id !== profile.id) {
      const isFriend = await this.relationService.isFriend(user, profile)
      if (isFriend) {
        where.mode = Not(FILE_SCOPE.PRIVATE)
      } else {
        where.mode = FILE_SCOPE.PUBLIC
      }
    }

    const { data: albums, total } = await this.find({
      where,
    })

    return { albums, total }
  }

  async findById(user: UserToken, id: string) {
    const album = await this.findOne({ id })
    if (!album) {
      BaseError(TableName.ALBUM, HttpStatus.NOT_FOUND)
    }

    if (album.user.id !== user.profile.id) {
      const isFriend = await this.relationService.isFriend(user, album.user)
      if (
        (album.mode === FILE_SCOPE.FRIEND && isFriend) 
        || album.mode === FILE_SCOPE.PRIVATE
      ) {
        BaseError(TableName.ALBUM, HttpStatus.FORBIDDEN)
      }
    }

    return { album }
  }

  async update(
    user: UserToken,
    id: string,
    input: UpdateAlbumInput,
  ) {
    const album = await this.findOne({ id })
    if (!album) {
      BaseError(TableName.ALBUM, HttpStatus.NOT_FOUND)
    } else if (album.user.id !== user.profile.id) {
      BaseError(TableName.ALBUM, HttpStatus.FORBIDDEN)
    }

    await this.albumRepo.save({
      ...input,
      id,
    })

    return {
      album: { ...album, ...input }
    }
  }

  async remove(user: UserToken, id: string) {
    const album = await this.findOne({ id })
    if (!album) {
      BaseError(TableName.ALBUM, HttpStatus.NOT_FOUND)
    } else if (album.user.id !== user.profile.id) {
      BaseError(TableName.ALBUM, HttpStatus.FORBIDDEN)
    }

    return {
      album: await this.albumRepo.softRemove(album)
    }
  }
}