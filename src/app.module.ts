import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      entities: ['./dist/src/entities/*.entity.js'],
      entitiesTs: ['./src/entities/*.entity.ts'],
      dbName: 'db',
      type: 'postgresql',
      password: 'password',
      port: 5435,
      autoLoadEntities: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
