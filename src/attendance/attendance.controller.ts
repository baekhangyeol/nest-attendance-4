import { Controller, Post, Body } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceRequestDto } from './dto/request/create-attendacne-request.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  async createAttendance(@Body() request: CreateAttendanceRequestDto) {
    return this.attendanceService.createAttendance(request);
  }
}
