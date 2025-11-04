import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common"
import { type Repository, Between } from "typeorm"
import type { AttendanceEntity } from "../../database/entities/attendance.entity"
import type { UserEntity } from "../../database/entities/user.entity"
import type { CreateAttendanceDto } from "./dto/create-attendance.dto"
import type { AttendanceAnalysisDto } from "./dto/attendance-analysis.dto"

@Injectable()
export class AttendanceService {
  constructor(
    private attendanceRepository: Repository<AttendanceEntity>,
    private usersRepository: Repository<UserEntity>,
  ) {}

  async recordAttendance(createAttendanceDto: CreateAttendanceDto) {
    const user = await this.usersRepository.findOne({
      where: { id: createAttendanceDto.userId },
    })

    if (!user) {
      throw new NotFoundException("Pengguna tidak ditemukan")
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const existingAttendance = await this.attendanceRepository.findOne({
      where: {
        userId: createAttendanceDto.userId,
        date: today,
      },
    })

    if (existingAttendance && !createAttendanceDto.checkOutTime) {
      throw new BadRequestException("Pengguna sudah melakukan presensi hari ini")
    }

    const attendance = this.attendanceRepository.create({
      ...createAttendanceDto,
      date: today,
    })

    const savedAttendance = await this.attendanceRepository.save(attendance)

    return {
      success: true,
      message: "Presensi berhasil dicatat",
      data: {
        id: savedAttendance.id,
        userId: savedAttendance.userId,
        date: savedAttendance.date,
        checkInTime: savedAttendance.checkInTime,
        checkOutTime: savedAttendance.checkOutTime,
        status: savedAttendance.status,
        notes: savedAttendance.notes,
      },
    }
  }

  async getAttendanceHistory(userId: number, limit = 30, offset = 0) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    })

    if (!user) {
      throw new NotFoundException("Pengguna tidak ditemukan")
    }

    const [attendances, total] = await this.attendanceRepository.findAndCount({
      where: { userId },
      order: { date: "DESC" },
      take: limit,
      skip: offset,
    })

    return {
      success: true,
      data: attendances,
      pagination: {
        total,
        limit,
        offset,
        pages: Math.ceil(total / limit),
      },
    }
  }

  async getMonthlySummary(userId: number, year: number, month: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    })

    if (!user) {
      throw new NotFoundException("Pengguna tidak ditemukan")
    }

    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    const attendances = await this.attendanceRepository.find({
      where: {
        userId,
        date: Between(startDate, endDate),
      },
      order: { date: "ASC" },
    })

    const summary = {
      present: attendances.filter((a) => a.status === "present").length,
      absent: attendances.filter((a) => a.status === "absent").length,
      late: attendances.filter((a) => a.status === "late").length,
      leave: attendances.filter((a) => a.status === "leave").length,
      total: attendances.length,
      percentage: 0,
    }

    summary.percentage = summary.total > 0 ? Math.round((summary.present / summary.total) * 100) : 0

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        period: `${month}/${year}`,
        summary,
        details: attendances,
      },
    }
  }

  async analyzeAttendance(analysisDto: AttendanceAnalysisDto) {
    const { startDate, endDate, category, categoryValue } = analysisDto

    const start = new Date(startDate)
    const end = new Date(endDate)
    end.setHours(23, 59, 59, 999)

    let query = this.attendanceRepository
      .createQueryBuilder("attendance")
      .leftJoinAndSelect("attendance.user", "user")
      .where("attendance.date BETWEEN :start AND :end", { start, end })

    if (category === "class" && categoryValue) {
      query = query.andWhere("user.class = :class", { class: categoryValue })
    } else if (category === "position" && categoryValue) {
      query = query.andWhere("user.position = :position", { position: categoryValue })
    } else if (category === "role" && categoryValue) {
      query = query.andWhere("user.role = :role", { role: categoryValue })
    }

    const attendances = await query.orderBy("user.id", "ASC").addOrderBy("attendance.date", "ASC").getMany()

    // Group by user dan hitung statistik
    const userStats = new Map()

    attendances.forEach((attendance) => {
      const userId = attendance.user.id
      if (!userStats.has(userId)) {
        userStats.set(userId, {
          userId,
          userName: attendance.user.name,
          userEmail: attendance.user.email,
          userClass: attendance.user.class,
          userPosition: attendance.user.position,
          present: 0,
          absent: 0,
          late: 0,
          leave: 0,
          total: 0,
        })
      }

      const stat = userStats.get(userId)
      stat.total++

      if (attendance.status === "present") stat.present++
      else if (attendance.status === "absent") stat.absent++
      else if (attendance.status === "late") stat.late++
      else if (attendance.status === "leave") stat.leave++
    })

    // Hitung persentase dan convert ke array
    const results = Array.from(userStats.values()).map((stat) => ({
      ...stat,
      attendancePercentage: stat.total > 0 ? Math.round((stat.present / stat.total) * 100) : 0,
    }))

    // Hitung rata-rata kehadiran keseluruhan
    const totalAttendances = results.reduce((sum, r) => sum + r.present, 0)
    const totalDays = results.reduce((sum, r) => sum + r.total, 0)
    const averagePercentage = totalDays > 0 ? Math.round((totalAttendances / totalDays) * 100) : 0

    return {
      success: true,
      data: {
        period: {
          startDate,
          endDate,
        },
        filter: {
          category: category || "all",
          categoryValue: categoryValue || "all",
        },
        summary: {
          totalUsers: results.length,
          totalRecords: attendances.length,
          averageAttendancePercentage: averagePercentage,
        },
        details: results,
      },
    }
  }
}
