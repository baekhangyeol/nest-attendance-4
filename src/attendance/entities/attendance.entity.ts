import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { AttendanceStatusEnum } from './attendance-status.enum';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  attendanceTime: Date;

  @Column({
    type: 'enum',
    enum: AttendanceStatusEnum,
  })
  status: AttendanceStatusEnum;

  @OneToOne(() => User, user => user.attendance)
  user: User;
}
