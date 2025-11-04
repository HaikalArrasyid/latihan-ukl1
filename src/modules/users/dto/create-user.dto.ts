import { IsEmail, IsString, MinLength, IsOptional, IsIn } from "class-validator"

export class CreateUserDto {
  @IsString({ message: "Nama harus berupa string" })
  @MinLength(3, { message: "Nama minimal 3 karakter" })
  name: string

  @IsEmail({}, { message: "Format email tidak valid" })
  email: string

  @IsString()
  @MinLength(6, { message: "Password minimal 6 karakter" })
  password: string

  @IsIn(["admin", "user"], { message: "Role harus admin atau user" })
  role: string

  @IsOptional()
  @IsString()
  class?: string

  @IsOptional()
  @IsString()
  position?: string

  @IsOptional()
  @IsString()
  nis?: string
}
