//作ったapp全体を読み込む大事なファイル

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3001;
  //環境変数からポートを取得(render.comを使う都合上)

  app.enableCors({
    origin: '*', // Reactのポートを指定
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept Authorization', // 許可するメソッド
  });

  console.log(`listening on port ${port}`)
  await app.listen(port ?? '0.0.0.0');
}
bootstrap();
