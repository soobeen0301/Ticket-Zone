import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/Book.entity';
import { User } from 'src/user/entities/user.entity';
import { Show } from 'src/show/entities/show.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book, User, Show])],
  providers: [BookService],
  controllers: [BookController]
})
export class BookModule {}
