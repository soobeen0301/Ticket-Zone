import { compare, hash } from 'bcrypt';
import _ from 'lodash';
import { Repository } from 'typeorm';

import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { SignUpDto } from './dto/signUp.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from './types/userRole.type';
import { HTTP_STATUS } from '../constants/http-status.constant';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto:SignUpDto) {
    const {email, password, name, nickname} = signUpDto

    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException(
        '이미 가입 된 사용자입니다.',
      );
    }

    const hashedPassword = await hash(password, 10);
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

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      select: ['id', 'email', 'password'],
      where: { email },
    });
    if (_.isNil(user)) {
      throw new UnauthorizedException('이메일을 확인해주세요.');
    }

    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException('비밀번호를 확인해주세요.');
    }

    const payload = { email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }
}