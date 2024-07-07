import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

import { Status } from '../types/book-status.type'
import { User } from 'src/user/entities/user.entity';
import { Show } from 'src/show/entities/show.entity';

@Entity({
  name: 'bookings',
})
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne( () => User, (user) => user.bookings)
  @JoinColumn( { name: 'userId'})
  user: User

  @ManyToOne( () => Show, (show) => show.bookings)
  @JoinColumn( { name: 'showId'})
  show: Show

  @Column({ type: 'enum', enum : Status, default : Status.Booked })
  status: Status;

  @Column({ type: 'varchar', nullable: false })
  dateTime: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}