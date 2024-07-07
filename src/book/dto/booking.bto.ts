import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty({ message: '공연 이름을 입력해주세요.' })
  showName: string;

  @IsString()
  @IsNotEmpty({ message: '공연 날짜와 시간을 입력해주세요.' })
  dateTime: string;
}