import { AttendanceStatusEnum } from '../../entities/attendance-status.enum';
import { User } from '../../entities/user.entity';

export class CreateAttendanceResponseDto {
    id: number;
    attendanceTime: Date;
    status: AttendanceStatusEnum;
    userId: number;
    user: User;

    public static from(dto: CreateAttendanceResponseDto): CreateAttendanceResponseDto {
        const it = new CreateAttendanceResponseDto();
        it.id = dto.id;
        it.attendanceTime = dto.attendanceTime;
        it.status = dto.status;
        it.userId = dto.user.id;
        it.user = dto.user;
        return it;
    }
}