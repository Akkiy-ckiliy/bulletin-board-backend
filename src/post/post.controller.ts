//投稿機能の受付窓口(frontのapi/postから値が飛んでくる)

import { Body, Controller, Get, Post, Query, Headers } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('post') //受け付けるurlのパスの指定と受け付けた時に呼ぶサービスの指定
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post() //書き込みの受付(reactのpostのほう)
  async createPost(
    @Body('message') message: string, //本文(reactで送った箱)からメッセージを取得
    @Query('token') token: string, //urlからトークンを取得
  ) {
    return await this.postService.createPost(message, token);
    //返す(表示させる)
  }

  // @Get() //読み込みの受付(reactのgetListのほう)
  // async getList(
  //   @Query('token') token: string, //token
  //   @Query('start') start: number, //いくつから～
  //   @Query('records') records: number, //～いくつがほしいの？っていう設定
  // ) {
  //   return await this.postService.getList(token, start, records);
  //   //返す(表示させる)
  // }

  @Get()
  async getList(
    @Headers('Authorization') authHeader: string, // Authorizationヘッダー全体を取得
    @Query('start') start: number,
    @Query('records') records: number,
  ) {
    //react側でauthHeaderがついた要素から "Bearer " の部分を取り除いたもの(つまりトークン)を取得 replaceは置き換えね。
    const token = authHeader.replace('Bearer ', '');

    return await this.postService.getList(token, start, records);
  }
}
