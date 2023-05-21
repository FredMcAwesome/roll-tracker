import { Body, Controller, Get, Post, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  root() {
    this.appService.getRows();
    return {
      rolls: [{ player: 'tegg', type: 'survival', total: 10, damage: '' }],
    };
  }

  @Post()
  postRow(@Body() roll: rollInput, @Res() res) {
    this.appService.postRow(roll);
    return res.redirect('/');
  }
}

export interface rollInput {
  player: string;
  type: string;
  total: number | '';
  damage: number | '';
  note: string;
}
