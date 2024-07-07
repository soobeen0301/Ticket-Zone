import { Column, Entity, Index, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

import { Category } from '../types/show-category.type'
import { Book } from 'src/book/entities/book.entity';

@Index('showName', ['showName'], { unique: true })
@Entity({
  name: 'shows',
})
export class Show {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  showName: string;

  @Column({ type: 'varchar', nullable: false })
  showContent: string;

  @Column({ type: 'enum', enum : Category, nullable: false })
  showCategory: Category;
  
  @Column({ type: 'varchar', nullable: false })
  place: string;

  @Column({ type: 'int', nullable: false })
  price: number;

  @Column({ type: 'varchar', nullable: false })
  imageUrl: string;

  @Column({ type: 'simple-array', nullable: false })
  dateTime: string[];

  @Column({ type: 'int', nullable: false })
  totalSeats: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Book, (book) => book.show)
  bookings: Book[];
}