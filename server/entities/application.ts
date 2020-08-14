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
import { SECRET, User, UserStatus } from '@things-factory/auth-base'

export enum ApplicationStatus {
  DRAFT = 'DRAFT',
  ACTIVATED = 'ACTIVATED'
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
    default: ApplicationStatus.DRAFT
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

  /* generateAppSecret */
  static generateAppSecret() {
    return crypto.randomBytes(16).toString('hex')
  }

  static generateAppKey() {
    return crypto.randomBytes(16).toString('hex')
  }

  /* signing for jsonwebtoken */
  static sign(subject, expiresIn, domain, user, appKey) {
    var application = {
      id: user.id,
      userType: 'application',
      application: {
        appKey
      },
      status: UserStatus.ACTIVATED,
      domain: {
        subdomain: domain.subdomain
      }
    }

    return jwt.sign(application, SECRET, {
      expiresIn,
      issuer: 'hatiolab.com',
      subject
    })
  }

  static generateAccessToken(domain, user, appKey) {
    /* how to set expiresIn https://github.com/vercel/ms */
    return this.sign('access-token', '30d', domain, user, appKey)
  }

  static generateRefreshToken(domain, user, appKey) {
    /* how to set expiresIn https://github.com/vercel/ms */
    return this.sign('refresh-token', '1y', domain, user, appKey)
  }

  /* auth-code signing for jsonwebtoken */
  static generateAuthCode(email, appKey, subdomain, scope, state) {
    var credential = {
      email,
      appKey,
      subdomain,
      scope,
      state
    }

    return jwt.sign(credential, SECRET, {
      expiresIn: '1m'
    })
  }

  /* auth-code signing for jsonwebtoken */
  static verifyAuthCode(authcode) {
    return jwt.verify(authcode, SECRET)
  }
}
