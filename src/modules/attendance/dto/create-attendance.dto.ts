import { IsNumber, IsString, IsOptional, IsIn } from "class-validator"

export class CreateAttendanceDto {
  @IsNumber()
  userId: number

  @IsString()
  checkInTime: string // Format: HH:MM:SS

  @IsOptional()
  @IsString()
  checkOutTime?: string // Format: HH:MM:SS

  @IsOptional()
  @IsIn(["present", "absent", "late", "leave"])
  status?: string

  @IsOptional()
  @IsString()
  notes?: string
}
