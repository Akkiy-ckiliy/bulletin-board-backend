//ユーザーの新規登録・会員情報取得の処理をするふぁいる

import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'crypto';
import { Auth } from 'src/entities/auth';
import { User } from 'src/entities/user.entity';
import { Equal, MoreThan, Repository } from 'typeorm';

@Injectable()
export class UserService { //これはデータベースとの同期準備
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Auth)
        private authRepository: Repository<Auth>,
    ) {}

    createUser(name: string, email: string, password: string) {
        const hash = createHash('md5').update(password).digest('hex'); //パスワードをハッシュ化
        const record = { //保存用のデータ作成
            name: name,
            email: email,
            hash: hash, //さっきauthの時も言ったけどパスワードはハッシュ化したものを使用
        };
        this.userRepository.save(record); //データベースに保存
    }

    async getUser(token: string, id:number) { //会員情報の取得の処理(確認処理)はこっちで行う
        const now = new Date();
        const auth = await this.authRepository.findOne({
            where: {
                token: Equal(token), //渡されたトークンと一致するか確認
                expire: MoreThan(now), //有効期限切れでないかの確認
            },
        });

        if (!auth) { //どっちかでも合わなかったらエラー
            throw new ForbiddenException();
        }

        const user = await this.userRepository.findOne({ //通ったらこっちの処理を行う
            where: {
                id: Equal(id),
            },
            //ここでidを確認
        });
        if (!user) {
            throw new NotFoundException();
            //いなかったらエラー
        }
        return user; //全部通ったらユーザー情報を返す(もちろんコントローラーに)
    }
}
