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
import { Domain } from '@things-factory/shell'
import { User } from '@things-factory/auth-base'
import { Application } from './application'
import { config } from '@things-factory/env'

var SECRET = config.get('SECRET')
if (!SECRET) {
  if (process.env.NODE_ENV == 'production') {
    throw new TypeError('SECRET key not configured.')
  } else {
    SECRET = '0xD58F835B69D207A76CC5F84a70a1D0d4C79dAC95'
  }
}

@Entity()
@Index('ix_domain_app_0', (domainApp: DomainApp) => [domainApp.domain, domainApp.application], { unique: true })
@Index('ix_domain_app_1', (domainApp: DomainApp) => [domainApp.accessToken], { unique: true })
export class DomainApp {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(type => Domain)
  domain: Domain

  @ManyToOne(type => Application)
  application: Application

  @Column()
  accessToken: string

  @Column({
    nullable: true
  })
  refreshToken: string

  @Column({
    nullable: true
  })
  scope: string

  @Column({
    nullable: true
  })
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

  /* signing for jsonwebtoken */
  generateAccessToken() {
    var application = {
      id: this.id,
      userType: 'application',
      status: this.status,
      domain: this.domain.id
    }

    return jwt.sign(application, SECRET, {
      expiresIn: '30d',
      issuer: 'hatiolab.com',
      subject: 'application'
    })
  }

  generateRefreshToken() {
    var application = {
      id: this.id,
      userType: 'application',
      status: this.status,
      domain: this.domain.id
    }

    return jwt.sign(application, SECRET, {
      expiresIn: '1y',
      issuer: 'hatiolab.com',
      subject: 'application'
    })
  }
}
