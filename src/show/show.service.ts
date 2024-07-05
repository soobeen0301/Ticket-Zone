import _ from 'lodash';
import { Repository } from 'typeorm';

import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Show } from './entities/show.entity';
import { createShowDto } from './dto/create-show.dto';
import { Category } from './types/show-category.type';
import { HTTP_STATUS } from '../constants/http-status.constant';

@Injectable()
export class ShowService {
  constructor(
    @InjectRepository(Show)
    private showRepository: Repository<Show>,
  ) {}

  async createShow(createShowDto:createShowDto) {
    const {showName, showContent, place,price, imageUrl, dateTime} = createShowDto

    const existingShow = await this.showRepository.findOne({where : {showName}});
    if (existingShow) {
      throw new ConflictException(
        '이미 등록된 공연 입니다.',
      );
    }

    const newShow = await this.showRepository.save({
      showName,
      showContent,
      showCategory : Category.Concert,
      place,
      price,
      imageUrl,
      dateTime,
      totalSeats : 500,
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

//   async login(loginDto: LoginDto) {
//     const {email, password} = loginDto

//     const user = await this.userRepository.findOne({
//       select: ['id', 'email', 'password'],
//       where: { email },
//     });
//     if (_.isNil(user)) {
//       throw new UnauthorizedException('이메일이 일치하지 않습니다.');
//     }

//     if (!(await compare(password, user.password))) {
//       throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
//     }

//     const payload = { email, sub: user.id };
//     const accessToken = this.jwtService.sign(payload);
//     return {
//         status : HTTP_STATUS.OK,
//         message : '로그인 성공하였습니다.',
//         data : {accessToken},
//     };
//   }

//   async findByEmail(email: string) {
//     return await this.userRepository.findOneBy({ email });
//   }

//  async getUserInfo(userId : number) {
//     const user = await this.userRepository.findOne({where : {id : userId}});

//     if(!user) {
//         throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
//     }

//     return {
//         status : HTTP_STATUS.OK,
//         data : {
//             id : user.id,
//             email : user.email,
//             name : user.name,
//             nickname : user.nickname,
//             point : user.point,
//             role : user.role,
//             createdAt : user.createdAt,
//             updatedAt : user.updatedAt
//         },

//     };
//  }
}