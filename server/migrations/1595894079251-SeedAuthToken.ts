import { MigrationInterface, QueryRunner, getRepository } from 'typeorm'
import { Domain } from '@things-factory/shell'
import { AuthToken } from '../entities'

const SEED = [
  {
    name: 'abc@kkk.com',
    description: 'abc from kkk.com',
    userId: 'abc@kkk.com',
    type: 'GRANT',
    token: 'xxxxx',
    scope: ''
  }
]

export class SeedAuthToken1595894079251 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(AuthToken)
    const domainRepository = getRepository(Domain)
    const domain = await domainRepository.findOne({
      name: 'SYSTEM'
    })

    try {
      SEED.forEach(async authToken => {
        await repository.save({
          ...authToken,
          domain
        })
      })
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(AuthToken)
    SEED.reverse().forEach(async authToken => {
      let record = await repository.findOne({ name: authToken.name })
      await repository.remove(record)
    })
  }
}
