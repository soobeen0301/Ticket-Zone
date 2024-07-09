import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ShowService } from './show.service';
import { CreateShowDto } from './dto/create-show.dto';
import { AdminGuard } from 'src/auth/admin.guard';
import { Category } from './types/show-category.type';

@Controller('show')
export class ShowController {
  constructor(private readonly showService: ShowService) {}

  /* 사용자 확인 */
  @UseGuards(AuthGuard('jwt'), AdminGuard)

  /* 공연 생성 */
  @Post()
  async createShow(@Body() createShowDto: CreateShowDto) {
    return await this.showService.createShow(createShowDto);
  }

  /* 공연 조회 */
  @Get()
  findAll(@Query('category') category: string) {
    if (category) {
      return this.showService.getShowByCategory(category as Category);
    }
    return this.showService.findAll();
  }

  /* 공연 검색 */
  @Get('search')
  getShowByName(@Query('showName') showName: string) {
    return this.showService.getShowByName(showName);
  }

  /* 공연 상세 조회 */
  @Get(':showId')
  findOne(@Param('showId') id: string) {
    return this.showService.findOne(+id);
  }
}
