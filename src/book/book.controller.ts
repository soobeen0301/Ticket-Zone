import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/booking.bto';
import { UserInfo } from 'src/utils/user-info.decorator';
import { User } from '../user/entities/user.entity';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createBook(@Body() createBookDto: CreateBookDto, @UserInfo() user: User) {
    return await this.bookService.createBook(createBookDto, user.id);
  }

  @Get()
  async getUserBookings(@UserInfo() user: User) {
    return await this.bookService.getUserBookings(user.id)
  }
}
