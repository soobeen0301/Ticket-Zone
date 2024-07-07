import _ from 'lodash';
import { Like, Repository } from 'typeorm';

import {ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
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

    //공연 이름 기준으로 동일한 이름이 있는지 체크
    const existingShow = await this.showRepository.findOne({where : {showName}});
    if (existingShow) {
      throw new ConflictException(
        '이미 등록된 공연 입니다.',
      );
    }

    //공연 생성 (데이터베이스에 저장)
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

    //반환 내용
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

  //반환 데이터 정의
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
    //캐싱 된 데이터 찾기
    const cachedShows = await this.cacheManager.get<Show[]>('shows');
    if (!_.isNil(cachedShows)) {
      return {
        status : HTTP_STATUS.OK,
        data: cachedShows.map(this.formatShow),
      };
    }

    //데이터 베이스에서 찾기
    const shows = await this.showRepository.find({
      order : {createdAt : 'DESC'}
    });
    await this.cacheManager.set('shows', shows);
    return {
      status : HTTP_STATUS.OK,
      data : shows.map(this.formatShow)
    };
  }

  // 카테고리별 조회
 async getShowByCategory(category : Category){
  const shows = await this.showRepository.find({where : {showCategory : category}});
  return {
    status : HTTP_STATUS.OK,
    data : shows.map(this.formatShow)
  }
 }

 /* 공연 검색 */
 async getShowByName(showName : string) {

  const shows = await this.showRepository.findAndCount({
    where : {showName : Like(`%${showName}%`)}, // 공연명의 일부만 검색해도 나올 수 있도록
    order : {createdAt : 'DESC'},
  });

  //공연개수가 0이라면, 오류 반환
  if (shows[1] === 0 ) {
    throw new NotFoundException('존재하지 않는 공연입니다.')
  }

  return {
    status : HTTP_STATUS.OK,
    data : shows[0].map(this.formatShow)
  }
}

  /* 공연 상세 조회 */
  async findOne(id : number) {

    const show = await this.showRepository.findOne ({where : {id}})
    if (!show) {
      throw new NotFoundException('존재하지 않는 공연입니다.')
    }

    return {
      status : HTTP_STATUS.OK,
      data : this.formatShow(show)
    }
  }

}
