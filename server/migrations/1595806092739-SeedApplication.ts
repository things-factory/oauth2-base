import { MigrationInterface, QueryRunner, getRepository } from 'typeorm'
import { Application } from '../entities'

const SEED = [
  {
    name: 'Operato MMS',
    description: 'Operato MMS Application',
    email: 'heartyoh@hatiolab.com',
    url: 'http://mms.opa-x.com:3000',
    icon: '',
    redirectUrl: 'http://mms.opa-x.com:3000/callback-operato',
    webhook: 'http://mms.opa-x.com:3000/webhook-operato',
    appKey: '20143978290-1834',
    appSecret: Application.generateAppSecret()
  }
]

export class SeedApplication1595806092739 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(Application)

    try {
      SEED.forEach(async application => {
        await repository.save({
          ...application
        })
      })
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(Application)
    SEED.reverse().forEach(async application => {
      let record = await repository.findOne({ name: application.name })
      await repository.remove(record)
    })
  }
}
