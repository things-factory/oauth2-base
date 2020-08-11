import crypto from 'crypto'
import {
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  Index,
  Column,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { User } from '@things-factory/auth-base'

@Entity()
@Index('ix_application_0', (application: Application) => [application.appKey], { unique: true })
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column({
    nullable: true
  })
  description: string

  @Column()
  email: string

  @Column()
  url: string

  @Column({
    nullable: true
  })
  icon: string

  @Column()
  redirectUrl: string

  @Column({
    nullable: true
  })
  webhook: string

  @Column({
    nullable: true
  })
  appKey: string

  @Column({
    nullable: true
  })
  appSecret: string

  @Column()
  status: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(type => User, {
    nullable: true
  })
  creator: User

  @ManyToOne(type => User, {
    nullable: true
  })
  updater: User

  /* generateAppSecret */
  static generateAppSecret() {
    return crypto.randomBytes(16).toString('hex')
  }
}
