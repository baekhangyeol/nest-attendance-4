import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateAttendanceRequestDto } from './dto/request/create-attendacne-request.dto';
import { AttendanceStatusEnum } from './entities/attendance-status.enum';
import { CreateAttendanceResponseDto } from './dto/response/create-attendance-response.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
  }

  async createAttendance(dto: CreateAttendanceRequestDto) {
    const user = await this.userRepository.findOneBy({ studentId: dto.studentId });
    if (!user) {
      throw new Error('유저를 찾을 수 없습니다.');
    }
    const status = this.getAttendanceStatus(dto.attendanceTime);
    const attendance = this.attendanceRepository.create({...dto, status, user});
    await this.attendanceRepository.save(attendance);

    return CreateAttendanceResponseDto.from(attendance);
  }

  private getAttendanceStatus(attendanceTime: Date | string): AttendanceStatusEnum {
    // attendanceTime이 문자열이라면 Date 객체로 변환
    const attendanceDate = new Date(attendanceTime);

    const classStartHour = 9;
    const classEndHour = 18;

    const hour = attendanceDate.getHours();
    const minute = attendanceDate.getMinutes();

    if(hour < classStartHour || hour > classEndHour) {
      return AttendanceStatusEnum.ABSENT;
    }

    if(minute <= 10)
      return AttendanceStatusEnum.PRESENT;
    else if(minute <= 20)
      return AttendanceStatusEnum.LATE;
    else
      return AttendanceStatusEnum.ABSENT;
  }

}