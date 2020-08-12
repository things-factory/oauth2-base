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
import { getRepository } from 'typeorm'
import { Domain } from '@things-factory/shell'
import { SECRET, User, UserStatus, AuthError } from '@things-factory/auth-base'
import { Application } from '.'

export enum AuthTokenStatus {
  ACTIVATED = 'ACTIVATED',
  GRANT = 'GRANT'
}

@Entity()
@Index('ix_auth-token_0', (authToken: AuthToken) => [authToken.domain, authToken.application], { unique: true })
@Index('ix_auth-token_1', (authToken: AuthToken) => [authToken.accessToken], { unique: false })
export class AuthToken {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(type => Domain)
  domain: Domain

  @ManyToOne(type => Application)
  application: Application

  @ManyToOne(type => User)
  user: User

  @Column()
  status: string

  @Column({
    nullable: true
  })
  authcode: string

  @Column({
    nullable: true
  })
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
  redirectUrl: string

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
  sign(subject, expiresIn) {
    var application = {
      id: this.id,
      userType: 'application',
      status: AuthTokenStatus.ACTIVATED,
      domain: {
        subdomain: this.domain.subdomain
      }
    }

    return jwt.sign(application, SECRET, {
      expiresIn,
      issuer: 'hatiolab.com',
      subject
    })
  }

  generateAccessToken() {
    return this.sign('access-token', '1m')
  }

  generateRefreshToken() {
    return this.sign('refresh-token', '1y')
  }

  /* auth-code signing for jsonwebtoken */
  static generateAuthCode(authTokenId) {
    var credential = {
      id: authTokenId
    }

    return jwt.sign(credential, SECRET, {
      expiresIn: '1m'
    })
  }

  /* auth-code signing for jsonwebtoken */
  static verifyAuthCode(authcode) {
    return jwt.verify(authcode, SECRET)
  }

  static verifyAccessToken(token) {
    return jwt.verify(token, SECRET)
  }

  static async checkAuth(decoded) {
    const repository = getRepository(AuthToken)
    var authToken = await repository.findOne(decoded.id, {
      cache: true,
      relations: ['domain', 'user', 'application']
    })
    var user = authToken?.user

    if (!user)
      throw new AuthError({
        errorCode: AuthError.ERROR_CODES.USER_NOT_FOUND
      })
    else {
      switch (user.status) {
        case UserStatus.INACTIVE:
          throw new AuthError({
            errorCode: AuthError.ERROR_CODES.USER_NOT_ACTIVATED
          })
        case UserStatus.LOCKED:
          throw new AuthError({
            errorCode: AuthError.ERROR_CODES.USER_LOCKED
          })
        case UserStatus.DELETED:
          throw new AuthError({
            errorCode: AuthError.ERROR_CODES.USER_DELETED
          })
      }

      return {
        domain: authToken.domain,
        user,
        application: authToken.application
      }
    }
  }
}
