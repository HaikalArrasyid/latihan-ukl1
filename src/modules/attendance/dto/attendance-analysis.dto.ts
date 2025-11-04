import { IsString, IsOptional, IsIn } from "class-validator"

export class AttendanceAnalysisDto {
  @IsString()
  startDate: string // Format: YYYY-MM-DD

  @IsString()
  endDate: string // Format: YYYY-MM-DD

  @IsOptional()
  @IsIn(["class", "position", "role", "all"])
  category?: string

  @IsOptional()
  @IsString()
  categoryValue?: string
}
