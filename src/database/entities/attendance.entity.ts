import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { UserEntity } from "./user.entity"

@Entity("attendances")
export class AttendanceEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: "int" })
  userId: number

  @Column({ type: "date" })
  date: Date

  @Column({ type: "time" })
  checkInTime: string

  @Column({ type: "time", nullable: true })
  checkOutTime: string

  @Column({ type: "varchar", length: 20, default: "present" })
  status: string // 'present', 'absent', 'late', 'leave'

  @Column({ type: "text", nullable: true })
  notes: string

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(
    () => UserEntity,
    (user) => user.attendances,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "userId" })
  user: UserEntity
}
