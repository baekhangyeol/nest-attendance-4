import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Attendance } from './attendance.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  department: string;

  @Column()
  studentId: number;

  @ManyToOne(type => Attendance, attendance => attendance.user)
  attendance: Attendance;
}