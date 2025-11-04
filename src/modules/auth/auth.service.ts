import { Injectable, UnauthorizedException } from "@nestjs/common"
import type { JwtService } from "@nestjs/jwt"
import type { Repository } from "typeorm"
import * as bcrypt from "bcrypt"
import type { UserEntity } from "../../database/entities/user.entity"
import type { LoginDto } from "./dto/login.dto"

@Injectable()
export class AuthService {
  private usersRepository: Repository<UserEntity>
  private jwtService: JwtService

  constructor(usersRepository: Repository<UserEntity>, jwtService: JwtService) {
    this.usersRepository = usersRepository
    this.jwtService = jwtService
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
    })

    if (!user) {
      throw new UnauthorizedException("Email atau password salah")
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException("Email atau password salah")
    }

    const payload = { id: user.id, email: user.email, role: user.role }
    const token = this.jwtService.sign(payload)

    return {
      success: true,
      message: "Login berhasil",
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    }
  }

  async validateUser(payload: any) {
    return await this.usersRepository.findOne({
      where: { id: payload.id },
    })
  }
}
