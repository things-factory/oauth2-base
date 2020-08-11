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

export enum AuthTokenType {
  ACTIVATION = 'ACTIVATION',
  GRANT = 'GRANT'
}

// TODO name should be changed to 'authcode'
@Entity()
@Index('ix_auth-token_0', (authToken: AuthToken) => [authToken.domain, authToken.name], { unique: true })
export class AuthToken {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(type => Domain)
  domain: Domain

  @Column()
  name: string

  @Column({
    nullable: true
  })
  description: string

  @ManyToOne(type => User, {
    nullable: true
  })
  user: User

  @Column()
  appKey: string

  @Column()
  type: string

  @Column({
    nullable: true
  })
  token: string

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
}
