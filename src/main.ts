//作ったapp全体を読み込む大事なファイル

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', // Reactのポートを指定
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // 許可するメソッド
    credentials: true, // クッキーなどの資格情報の送信を許可
  });
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
