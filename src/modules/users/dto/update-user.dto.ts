import { IsEmail, IsString, MinLength, IsOptional } from "class-validator"

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: "Nama harus berupa string" })
  @MinLength(3, { message: "Nama minimal 3 karakter" })
  name?: string

  @IsOptional()
  @IsEmail({}, { message: "Format email tidak valid" })
  email?: string

  @IsOptional()
  @IsString()
  @MinLength(6, { message: "Password minimal 6 karakter" })
  password?: string

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
