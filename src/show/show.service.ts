import _ from 'lodash';
import { Repository } from 'typeorm';

import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

import { Show } from './entities/show.entity';
import { CreateShowDto } from './dto/create-show.dto';
import { Category } from './types/show-category.type';
import { HTTP_STATUS } from '../constants/http-status.constant';


@Injectable()
export class ShowService {
  constructor(
    @InjectRepository(Show) private showRepository: Repository<Show>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /* 공연 생성 */
  async createShow(createShowDto:CreateShowDto) {
    const {showName, showContent, showCategory, place,price, imageUrl, dateTime, totalSeats} = createShowDto

    const existingShow = await this.showRepository.findOne({where : {showName}});
    if (existingShow) {
      throw new ConflictException(
        '이미 등록된 공연 입니다.',
      );
    }

    const newShow = await this.showRepository.save({
      showName,
      showContent,
      showCategory,
      place,
      price,
      imageUrl,
      dateTime,
      totalSeats,
    });

    return {
        status : HTTP_STATUS.CREATED,
        message: '공연 생성이 완료되었습니다.',
        data : {
          id: newShow.id,
          showContent : newShow.showContent,
          showCategory : newShow.showCategory,
          place : newShow.place,
          price : newShow.price,
          imageUrl : newShow.imageUrl,
          dateTime: newShow.dateTime,
          totalSeats : newShow.totalSeats,
          createdAt : newShow.createdAt,
          updatedAt : newShow.updatedAt
        }
    }
  }

  private formatShow(show : Show) {
    return {
      showId : show.id,
      showName : show.showName,
      showContent : show.showContent,
      showCategory : show.showCategory,
      place : show.place,
      price : show.price,
      imageUrl : show.imageUrl,
      dateTime: show.dateTime,
      totalSeats : show.totalSeats,
      createdAt : show.createdAt,
      updatedAt : show.updatedAt
    }
  }

  /* 공연 조회 */
  async findAll() {
    const cachedShows = await this.cacheManager.get<Show[]>('shows');
    if (!_.isNil(cachedShows)) {
      return {
        status : HTTP_STATUS.OK,
        data: cachedShows.map(this.formatShow),
      };
    }

    const shows = await this.showRepository.find();
    await this.cacheManager.set('shows', shows);
    return {
      status : HTTP_STATUS.OK,
      data : shows.map(this.formatShow)
    };
  }

 async getShowByCategory(category : Category){
  const shows = await this.showRepository.find({where : {showCategory : category}});
  return {
    status : HTTP_STATUS.OK,
    data : shows.map(this.formatShow)
  }
 }

  /* 공연 상세 조회 */
  async findOne(id : number) {
    if (_.isNaN(id)) {
      throw new BadRequestException('존재하지 않는 공연 ID 입니다.');
    }

    const show = await this.showRepository.findOne ({where : {id}})
    if (!show) {
      throw new NotFoundException('존재하지 않는 공연입니다.')
    }

    return {
      status : HTTP_STATUS.OK,
      data : this.formatShow
    }
  }
}