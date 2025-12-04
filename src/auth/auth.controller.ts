//front側のapi/Authで来たidとpassをこっちで処理

import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth') //ここはいつも通りパスの最後が''の時にリクエスト担当をするってやつ
export class AuthController {
    constructor(private readonly authService: AuthService) {} //ここで作業をAuthServiceのほうにぶん投げるよっていう宣言

    // @Get()
    // async getAuth( //この()内がぶん投げる処理(関数)
    //     @Query('user_id') name: string,
    //     @Query('pass') password: string,
    //     //@Queryはurlのuser_id/passwordの部分から値をとってきて変数に格納してくれる
    // ) {
    //     return await this.authService.getAuth(name, password);
    //     //認証結果を受け取るやつ
    // }

    //react側をセキュリティ対策で変えたのでこっちも変更
    @Post()
  async signIn(@Body() signInDto: SignInDto) { // Body全体(idとpass)をDTO(Data Transfer Object要はただの箱)として受け取る
    // DTOオブジェクトから値を取り出してServiceに渡す SignInDtoはデータを受け取るときの型確認の役割
    return await this.authService.getAuth(signInDto.user_id, signInDto.pass);
    //ここ最後でserviceのほうにいつもどおりぶん投げ
  }
}
