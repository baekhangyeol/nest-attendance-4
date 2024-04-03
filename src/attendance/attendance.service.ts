import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateAttendanceRequestDto } from './dto/request/create-attendacne-request.dto';
import { AttendanceStatusEnum } from './entities/attendance-status.enum';
import { CreateAttendanceResponseDto } from './dto/response/create-attendance-response.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { createPaginationResult, PaginationResult } from '../common/util/pagination.util';
import { GetAttendanceResponseDto } from './dto/response/get-attendance-response.dto';

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
    const attendanceTime = new Date();
    const user = await this.userRepository.findOneBy({ studentId: dto.studentId });
    if (!user) {
      throw new Error('유저를 찾을 수 없습니다.');
    }
    const status = this.getAttendanceStatus(attendanceTime);
    const attendance = this.attendanceRepository.create({...dto, attendanceTime, status, user});
    await this.attendanceRepository.save(attendance);

    return CreateAttendanceResponseDto.from(<CreateAttendanceResponseDto>attendance);
  }

  private getAttendanceStatus(attendanceTime: Date | string): AttendanceStatusEnum {
    const attendanceDate = new Date(attendanceTime);

    const classStartHour = 9;
    const classEndHour = 18;

    const hour = attendanceDate.getHours();
    const minute = attendanceDate.getMinutes();

    if(hour < classStartHour || hour > classEndHour) {
      return AttendanceStatusEnum.ABSENT;
    }

    if (minute >= 51 || minute <= 10)
      return AttendanceStatusEnum.PRESENT;
    else if (minute >= 11 && minute <= 20)
      return AttendanceStatusEnum.LATE;
    else if (minute >= 21 && minute <= 50)
      return AttendanceStatusEnum.ABSENT;
  }

  async getAttendance(dto: PaginationDto, userId: number): Promise<PaginationResult<GetAttendanceResponseDto>> {
    const date = new Date();
    date.setDate(date.getDate() - 30);

    const [attendances, total] = await this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('attendance.attendanceTime > :date', { date })
      .orderBy('attendance.attendanceTime', 'DESC')
      .skip((dto.page - 1) * dto.limit)
      .take(dto.limit)
      .getManyAndCount();

    const result = attendances.map(attendance => GetAttendanceResponseDto.from(<GetAttendanceResponseDto>attendance));

    return createPaginationResult(result, dto.page, dto.limit, total);
  }

}