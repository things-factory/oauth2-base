import { MigrationInterface, QueryRunner, getRepository } from 'typeorm'
import { Domain } from '@things-factory/shell'
import { Application } from '../entities'

const SEED = [
  {
    name: 'Operato MMS',
    description: 'Operato MMS Application'
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
