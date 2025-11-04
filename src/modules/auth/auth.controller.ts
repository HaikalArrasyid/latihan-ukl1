import { Controller, Post, HttpCode, HttpStatus } from "@nestjs/common"
import type { AuthService } from "./auth.service"
import type { LoginDto } from "./dto/login.dto"

@Controller("api/auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }
}
