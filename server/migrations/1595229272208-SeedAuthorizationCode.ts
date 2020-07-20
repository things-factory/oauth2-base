import { MigrationInterface, QueryRunner, getRepository } from 'typeorm'
import { Domain } from '@things-factory/shell'
import { AuthorizationCode } from '../entities'

const SEED = [
  {
    name: 'Seed',
    description: 'Description for Seed'
  }
]

export class SeedAuthorizationCode1595229272208 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(AuthorizationCode)
    const domainRepository = getRepository(Domain)
    const domain = await domainRepository.findOne({
      name: 'SYSTEM'
    })

    try {
      SEED.forEach(async authorizationCode => {
        await repository.save({
          ...authorizationCode,
          domain
        })
      })
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(AuthorizationCode)
    SEED.reverse().forEach(async authorizationCode => {
      let record = await repository.findOne({ name: authorizationCode.name })
      await repository.remove(record)
    })
  }
}
