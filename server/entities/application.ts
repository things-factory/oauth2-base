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
import { Domain } from '@things-factory/shell'
import { User } from '@things-factory/auth-base'

@Entity()
@Index('ix_application_0', (application: Application) => [application.name], { unique: true })
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

  @Column({
    nullable: true
  })
  icon: string

  @Column()
  redirectUrl: string

  @Column({
    nullable: true
  })
  webhookUrl: string

  // @Column({ /* use id */
  //   nullable: true
  // })
  // appKey: string

  @Column({
    nullable: true
  })
  appSecret: string

  @Column({
    nullable: true
  })
  refreshToken: string

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
}
