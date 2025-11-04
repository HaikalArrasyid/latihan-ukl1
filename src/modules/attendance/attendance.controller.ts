import { Controller, Get, Post, Param, Query, UseGuards, ParseIntPipe } from "@nestjs/common"
import type { AttendanceService } from "./attendance.service"
import type { CreateAttendanceDto } from "./dto/create-attendance.dto"
import type { AttendanceAnalysisDto } from "./dto/attendance-analysis.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"

@Controller("api/attendance")
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  recordAttendance(createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.recordAttendance(createAttendanceDto)
  }

  @Get("history/:userId")
  @UseGuards(JwtAuthGuard)
  getAttendanceHistory(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.attendanceService.getAttendanceHistory(userId, limit || 30, offset || 0)
  }

  @Get("summary/:userId")
  @UseGuards(JwtAuthGuard)
  getMonthlySummary(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('year') year?: number,
    @Query('month') month?: number,
  ) {
    const currentDate = new Date()
    const queryYear = year || currentDate.getFullYear()
    const queryMonth = month || currentDate.getMonth() + 1

    return this.attendanceService.getMonthlySummary(userId, queryYear, queryMonth)
  }

  @Post("analysis")
  @UseGuards(JwtAuthGuard)
  analyzeAttendance(analysisDto: AttendanceAnalysisDto) {
    return this.attendanceService.analyzeAttendance(analysisDto)
  }
}
