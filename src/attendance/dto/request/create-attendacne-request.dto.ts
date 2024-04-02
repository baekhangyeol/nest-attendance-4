import { IsNotEmpty } from 'class-validator';

export class CreateAttendanceRequestDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  department: string;

  @IsNotEmpty()
  studentId: number;

  @IsNotEmpty()
  attendanceTime: Date;
}