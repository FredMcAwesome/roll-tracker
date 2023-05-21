import { Body, Controller, Get, Post, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  async root() {
    const rows = await this.appService.getRows();
    return {
      rolls: rows,
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
