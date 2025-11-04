import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import { AttendanceEntity } from "./attendance.entity"

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: "varchar", length: 100 })
  name: string

  @Column({ type: "varchar", length: 100, unique: true })
  email: string

  @Column({ type: "varchar", length: 100 })
  password: string

  @Column({ type: "varchar", length: 50 })
  role: string // 'admin', 'user'

  @Column({ type: "varchar", length: 50, nullable: true })
  class: string // Kelas atau departemen

  @Column({ type: "varchar", length: 100, nullable: true })
  position: string // Jabatan atau posisi

  @Column({ type: "varchar", length: 50, nullable: true })
  nis: string // Nomor Induk Siswa atau Karyawan

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(
    () => AttendanceEntity,
    (attendance) => attendance.user,
  )
  attendances: AttendanceEntity[]
}
