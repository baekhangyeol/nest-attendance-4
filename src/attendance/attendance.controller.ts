import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceRequestDto } from './dto/request/create-attendacne-request.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  async createAttendance(@Body() request: CreateAttendanceRequestDto) {
    return this.attendanceService.createAttendance(request);
  }

  @Get('/:userId')
  async getAttendance(@Param('userId') id: number, @Query() request: PaginationDto){
    return this.attendanceService.getAttendance(request, id);
  }
}
