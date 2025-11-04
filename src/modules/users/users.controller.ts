import { Controller, Get, Post, Put, Param, UseGuards, ParseIntPipe, Query } from "@nestjs/common"
import type { UsersService } from "./users.service"
import type { CreateUserDto } from "./dto/create-user.dto"
import type { UpdateUserDto } from "./dto/update-user.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"

@Controller("api/users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createUser(createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUser(id);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  updateUser(@Param('id', ParseIntPipe) id: number, updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getAllUsers(@Query('role') role?: string) {
    return this.usersService.getAllUsers(role);
  }
}
