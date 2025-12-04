// ログイン認証のためのふぁいる

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from 'src/entities/auth';
import { User } from 'src/entities/user.entity';
import { Equal, Repository } from 'typeorm';
import * as crypto from 'crypto';

@Injectable()
export class AuthService { //Userテーブル,Authテーブルを操作するための準備 これをでデータベースで検索・保存を行う
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
  ) {}

  async getAuth(name: string, password: string) {
    if (!password) {
      throw new UnauthorizedException(); //空欄＝エラー
    }
    // const hash = crypto.createHash('md5').update(password).digest('hex');
    //パスワードをハッシュ化
    const trimmedPassword = password.trim();

    const hash = trimmedPassword;

    const user = await this.userRepository.findOne({//データベースで検索(認証)を行う
      where: {
        id: Number(name),
        // hash: Equal(hash), //ここは元のパスワードではなくハッシュ化されたもの同士で調べる
        hash: hash,
      },
    });

    if (!user) {
      throw new UnauthorizedException(); //見つからなかったらエラー
    }

    const ret = { //tokenとidの最終的な結果をもらうやつ
      token: '',
      user_id: user.id,
    };

    var expire = new Date();
    expire.setDate(expire.getDate() + 1);
    //トークンの有効期限設定(今回は1日後まで)

    const auth = await this.authRepository.findOne({ //すでにトークンを持っているか否かをここで確認(賢いとこらしい。)
      where: {
        user_id: Equal(user.id),
      },
    });
    if (auth) {//一回でもログインしてた場合
      auth.expire = expire; //有効期限を1日延長
      await this.authRepository.save(auth); //保存
      ret.token = auth.token; //今持ってるトークンをお返し
      //要は、今持ってるトークンの有効期限を延長して返す処理

    } else { //初めてトークンを得る場合
      const token = crypto.randomUUID(); //新規トークン作成
      const record = {
        user_id: user.id,
        token: token,
        expire_at: expire.toISOString(),
        //randomUUID：36文字のハイフン付きの英数字を出してくれるから安全なトークンの一意パスを作れる
        //toISOString：現在の時刻をデータベースが理解できるように文字列にする
      };
      await this.authRepository.save(record); //保存
      ret.token = token; //今作った新しいトークンを返す
    }

    return ret; //トークンとユーザーidを返す(コントローラーのほうに渡す)
  }
}
