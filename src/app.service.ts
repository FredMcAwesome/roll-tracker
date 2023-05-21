import { Injectable } from '@nestjs/common';
import { MikroORM, QueryOrder } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { PlayerEnum, Rolls, RollTypeEnum } from './entities/rolls.entity';
import { rollInput } from './app.controller';

@Injectable()
export class AppService {
  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
  ) {}

  async getRows() {
    const rows = await this.em.find(
      Rolls,
      {},
      { orderBy: { _id: QueryOrder.DESC } },
    );
    return rows;
  }

  postRow(roll: rollInput) {
    const row = this.em.create(Rolls, {
      player: PlayerEnum[roll.player],
      rollType: RollTypeEnum[roll.type],
      ...(roll.total !== '' && { total: roll.total }),
      ...(roll.damage !== '' && { damage: roll.damage }),
      note: roll.note,
    });
    this.em.persistAndFlush(row);
    console.log(row);
  }
}
