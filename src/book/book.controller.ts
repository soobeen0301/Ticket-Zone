import { Controller, Post, Get, Body, UseGuards, Logger, NotFoundException,Request} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/booking.bto';
import { UserInfo } from 'src/utils/user-info.decorator';
import { User } from '../user/entities/user.entity';

@Controller('book')
export class BookController {
    private readonly logger = new Logger(BookController.name);
  constructor(private readonly bookService: BookService) {}

    /* 사용자 확인 */
  @UseGuards(AuthGuard('jwt'))

  /* 예매 생성 */
  @Post()
  async createBook(@Body() createBookDto: CreateBookDto, @UserInfo() user: User) {
    return await this.bookService.createBook(createBookDto, user.id);
  }

   /* 사용자 확인 */
  @UseGuards(AuthGuard('jwt'))
  
    /* 예매 조회 */
  @Get()
  async getUserBookings(@UserInfo() user: User) {
    return await this.bookService.getUserBookings(user.id);
  }
}
