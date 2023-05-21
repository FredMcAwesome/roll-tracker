import { EntityRepository } from '@mikro-orm/postgresql';
import { Rolls } from './rolls.entity';

export class RollsRepository extends EntityRepository<Rolls> {}
