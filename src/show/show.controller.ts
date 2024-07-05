import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Show } from './entities/show.entity';
import { ShowService } from './show.service';
import { createShowDto } from './dto/create-show.dto';
import { UserInfo } from 'src/utils/user-info.decorator';
import { AdminGuard } from 'src/auth/admin.guard';

@Controller('show')
export class ShowController {
  constructor(private readonly showService: ShowService) {}

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Post()
  async createShow(@Body() createShowDto: createShowDto) {
    return await this.showService.createShow(createShowDto);
  }

//   @Post('login')
//   async login(@Body() loginDto: LoginDto) {
//     return await this.userService.login(loginDto);
//   }

  
}