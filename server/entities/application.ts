import crypto from 'crypto'
import jwt from 'jsonwebtoken'
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
import { config } from '@things-factory/env'
import { User, UserStatus } from '@things-factory/auth-base'
const ORMCONFIG = config.get('ormconfig', {})
const DATABASE_TYPE = ORMCONFIG.type

var SECRET = config.get('SECRET')
if (!SECRET) {
  if (process.env.NODE_ENV == 'production') {
    throw new TypeError('SECRET key not configured.')
  } else {
    SECRET = '0xD58F835B69D207A76CC5F84a70a1D0d4C79dAC95'
  }
}

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

  @Column({
    nullable: true
  })
  refreshToken: string

  @Column({
    type: DATABASE_TYPE == 'postgres' || DATABASE_TYPE == 'mysql' || DATABASE_TYPE == 'mariadb' ? 'enum' : 'smallint',
    enum: UserStatus,
    default: UserStatus.INACTIVE
  })
  status: UserStatus

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

  /* signing for jsonwebtoken */
  async sign() {
    var user = {
      id: this.appKey,
      userType: 'APP',
      status: this.status
    }

    return await jwt.sign(user, SECRET, {
      expiresIn: '7d',
      issuer: 'hatiolab.com',
      subject: 'app'
    })
  }

  static generateAppSecret() {
    return crypto.randomBytes(16).toString('hex')
  }
}
