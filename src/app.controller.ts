//serviceのふぁいるで作ったやつを制御するふぁいる

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DataSource } from 'typeorm'; // ★これを追加

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private dataSource: DataSource // ★DB接続のためにこれを追加
  ) {}

  // ↓ 元々あったやつ（コメントアウトしてOK）
  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  // ↓ 新しく追加するDB確認用
  @Get('test-db')
  async testDb() {
    try {
      // データベースに 'SELECT 1' という単純なクエリを投げてみます
      const result = await this.dataSource.query('SELECT 1 as check_db');
      return { message: 'DB接続成功！', result };
    } catch (e) {
      return { message: 'DB接続エラー...', error: e.message };
    }
  }
}