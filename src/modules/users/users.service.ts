import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common"
import type { Repository } from "typeorm"
import * as bcrypt from "bcrypt"
import type { UserEntity } from "../../database/entities/user.entity"
import type { CreateUserDto } from "./dto/create-user.dto"
import type { UpdateUserDto } from "./dto/update-user.dto"

@Injectable()
export class UsersService {
  private usersRepository: Repository<UserEntity>

  constructor(usersRepository: Repository<UserEntity>) {
    this.usersRepository = usersRepository
  }

  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    })

    if (existingUser) {
      throw new BadRequestException("Email sudah terdaftar")
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10)

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    })

    const savedUser = await this.usersRepository.save(user)

    return {
      success: true,
      message: "Pengguna berhasil dibuat",
      data: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        class: savedUser.class,
        position: savedUser.position,
        nis: savedUser.nis,
      },
    }
  }

  async getUser(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
    })

    if (!user) {
      throw new NotFoundException("Pengguna tidak ditemukan")
    }

    return {
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        class: user.class,
        position: user.position,
        nis: user.nis,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    }
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({
      where: { id },
    })

    if (!user) {
      throw new NotFoundException("Pengguna tidak ditemukan")
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      })
      if (existingUser) {
        throw new BadRequestException("Email sudah terdaftar")
      }
    }

    const updateData = { ...updateUserDto }
    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10)
    }

    await this.usersRepository.update(id, updateData)

    const updatedUser = await this.usersRepository.findOne({
      where: { id },
    })

    return {
      success: true,
      message: "Pengguna berhasil diperbarui",
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        class: updatedUser.class,
        position: updatedUser.position,
        nis: updatedUser.nis,
      },
    }
  }

  async getAllUsers(role?: string) {
    const query = this.usersRepository.createQueryBuilder("user")

    if (role) {
      query.where("user.role = :role", { role })
    }

    const users = await query
      .select([
        "user.id",
        "user.name",
        "user.email",
        "user.role",
        "user.class",
        "user.position",
        "user.nis",
        "user.createdAt",
      ])
      .getMany()

    return {
      success: true,
      data: users,
      total: users.length,
    }
  }
}
