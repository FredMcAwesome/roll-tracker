import { Injectable } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { PlayerEnum, Rolls, RollTypeEnum } from './entities/rolls.entity';
import { rollInput } from './app.controller';

@Injectable()
export class AppService {
  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
  ) {}

  getRows() {
    return true;
  }

  async postRow(roll: rollInput) {
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
