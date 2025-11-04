import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AttendanceService } from "./attendance.service"
import { AttendanceController } from "./attendance.controller"
import { AttendanceEntity } from "../../database/entities/attendance.entity"
import { UserEntity } from "../../database/entities/user.entity"

@Module({
  imports: [TypeOrmModule.forFeature([AttendanceEntity, UserEntity])],
  providers: [AttendanceService],
  controllers: [AttendanceController],
})
export class AttendanceModule {}
