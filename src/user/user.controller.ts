import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Headers,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user') //何度も言うけどこれがパスurlの最後に来たら実行するよってやつ
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post() //新規会員登録窓口みたいな。 POSTメソッドはデータを送るときに使う(PUTじゃない)
  createUser(
    //User情報の詳細
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
    //Bodyは送る中身が見れないからパスワードとか大事なものはこれでやり取りする
  ) {
    this.userService.createUser(name, email, password); //データベース側に保存
  }

  // @Get(':id') //パラメータのurlをすべて対象とするやつ。
  // async getUser(@Param('id') id: number, @Query('token') token: string) {
  //   //Paramでパラメータ部分を読み、Queryで末尾の?の後ろのデータをとる
  //   //ex)~~localhost:3000/user/123?token=abc-xyzだったらParamは123,Queryは?以降すべて。

  //   return await this.userService.getUser(token, id);
  @Get(':id')
  async getUser(
    @Param('id') id: number,
    @Headers('Authorization') authHeader: string, // トークンをヘッダーで受け取る
  ) {
    // ここで authHeader から "Bearer " を除いたトークン文字列を抽出する処理を挟む
    const token = authHeader?.replace('Bearer ', '');

    // token を service に渡す
    return await this.userService.getUser(token, id);
  }
}
