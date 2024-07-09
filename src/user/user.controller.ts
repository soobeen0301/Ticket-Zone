import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UserInfo } from 'src/utils/user-info.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /* 회원가입 */
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.userService.signUp(signUpDto);
  }

  /* 로그인 */
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.userService.login(loginDto);
  }

  /* 사용자 확인 */
  @UseGuards(AuthGuard('jwt'))
  /* 사용자 정보 조회 */
  @Get()
  async getUserInfo(@UserInfo() user: User) {
    return await this.userService.getUserInfo(user.id);
  }
}
