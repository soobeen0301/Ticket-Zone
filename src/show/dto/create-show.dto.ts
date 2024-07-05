import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Category } from '../types/show-category.type';

export class createShowDto {
  @IsString()
  @IsNotEmpty({ message: '공연 이름을 입력해주세요.' })
  showName: string;

  @IsString()
  @IsNotEmpty({ message: '공연 설명을 입력해주세요.' })
  showContent: string;

  @IsNotEmpty({ message: '공연 카테고리를 입력해주세요.' })
  showCategory: Category;

  @IsString()
  @IsNotEmpty({ message: '공연 장소를 입력해주세요.' })
  place: string;

  @IsNumber()
  @IsNotEmpty({ message: '공연 금액을 입력해주세요.' })
  price: number;

  @IsString()
  @IsNotEmpty({ message: '공연 포스터를 입력해주세요.' })
  imageUrl: string;

  @IsArray()
  @IsNotEmpty({ message: '공연 날짜와 시간을 입력해주세요.' })
  dateTime: string[];

  @IsNumber()
  @IsNotEmpty({ message: '공연 좌석수를 입력해주세요.' })
  totalSeats: number;
}