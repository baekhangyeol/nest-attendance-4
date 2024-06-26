import { AttendanceStatusEnum } from '../../entities/attendance-status.enum';
import { User } from '../../entities/user.entity';

export class GetAttendanceResponseDto {
  id: number;
  attendanceTime: Date;
  status: AttendanceStatusEnum;
  userId: number;
  user: User;

  public static from(dto: GetAttendanceResponseDto): GetAttendanceResponseDto {
    const response = new GetAttendanceResponseDto();
    response.id = dto.id;
    response.attendanceTime = dto.attendanceTime;
    response.status = dto.status;
    response.userId = dto.user.id;
    response.user = dto.user;

    return response;
  }
}