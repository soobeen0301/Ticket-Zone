import { compare, hash } from 'bcrypt';
import _ from 'lodash';
import { Repository } from 'typeorm';

import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from './types/user-role.type';
import { HTTP_STATUS } from '../constants/http-status.constant';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  /* 회원가입 */
  async signUp(signUpDto:SignUpDto) {
    const {email, password, name, nickname} = signUpDto

    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException(
        '이미 가입 된 사용자입니다.',
      );
    }

    //비밀번호 해시화
    const hashedPassword = await hash(password, 10);
    //유저 생성
    const newUser = await this.userRepository.save({
      email,
      password: hashedPassword,
      name,
      nickname,
      role : Role.Customer,
      point: 1000000,
    });

    return {
        status : HTTP_STATUS.CREATED,
        message: '회원가입에 성공하였습니다.',
        data : {
            id: newUser.id,
            email: newUser.email,
            nickname : newUser.nickname,
            role: newUser.role,
            point: newUser.point,
            createdAt : newUser.createdAt,
            updatedAt : newUser.updatedAt
        }
    }
  }

  /* 로그인 */
  async login(loginDto: LoginDto) {
    const {email, password} = loginDto

    const user = await this.userRepository.findOne({
      select: ['id', 'email', 'password'],
      where: { email },
    });

    if (_.isNil(user)) {
      throw new UnauthorizedException('이메일이 일치하지 않습니다.');
    }

    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    const payload = { email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    return {
        status : HTTP_STATUS.OK,
        message : '로그인 성공하였습니다.',
        data : {accessToken},
    };
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }
  
 /* 사용자 정보 조회 */
 async getUserInfo(userId : number) {
    const user = await this.userRepository.findOne({where : {id : userId}});

    if(!user) {
        throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }

    return {
        status : HTTP_STATUS.OK,
        data : {
            id : user.id,
            email : user.email,
            name : user.name,
            nickname : user.nickname,
            point : user.point,
            role : user.role,
            createdAt : user.createdAt,
            updatedAt : user.updatedAt
        },

    };
 }
}