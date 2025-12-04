//投稿機能の管理(読み込み・新規投稿)サービスふぁいる

import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from 'src/entities/auth';
import { MicroPost } from 'src/entities/microposts';
import { Equal, MoreThan, Repository } from 'typeorm';

@Injectable()
export class PostService {
    constructor( //いつものデータベース操作セット
        @InjectRepository(MicroPost)
        private microPostsRepository: Repository<MicroPost>,
        @InjectRepository(Auth)
        private authRepository: Repository<Auth>,
    ) {}

    async getList(token: string, start: number = 0, nr_records: number = 1) { //読み込みの機能
        const now = new Date();
        const auth = await this.authRepository.findOne({
            where: {
                token: Equal(token),
                expire: MoreThan(now),
            },
        });
        if (!auth) {
            throw new ForbiddenException();
        }
        //ここまではいつも通りの認証チェック

        const qb = await this.microPostsRepository
        .createQueryBuilder('micro_post') //クエリ作成開始(しかしmicro_postには数字しかない)
        .leftJoinAndSelect('user', 'user', 'user.id=micro_post.user_id') 
        //なのでleftJoinAndSelectでユーザーテーブルと結合する(ユーザー名を取得するために。)
        //細かく言うと userっていうテーブルを持ってきて、それにuserっていうあだ名付けて、結合条件を書いてるだけ
 
        .select([ //各要素をわかりやすく名前変更してるだけ
            'micro_post.id as id',
            'user.name as user_name', //ユーザー名をuser_nameとして取得 みたいな。他も一緒
            'micro_post.content as content',
            'micro_post.created_at as created_at',
        ])
        .orderBy('micro_post.created_at', 'DESC') //新しい順に並び替え
        .offset(start) //何件目から～
        .limit(nr_records); //～何件取得する？の設定

        type ResultType = { //返すデータを指定
            id: number;
            content: string;
            user_name: string;
            created_at: Date;
        };
        const records = await qb.getRawMany<ResultType>();
        console.log(records);

        return records; //上で整列されたデータを返す
    }

    async createPost(message: string, token: string) { //新規投稿の作成の処理コード
        const now = new Date();
        const auth = await this.authRepository.findOne({
            where: {
                token: Equal(token),
                expire: MoreThan(now),
            },
        });
        if (!auth) {
            throw new ForbiddenException();
        }
        //ここまでいつもの認証＆特定

        const record = {
            user_id: auth.user_id, //トークンから特定したID
            content: message, //投稿内容
        };
        await this.microPostsRepository.save(record);
        //保存用のプリセットを組んでそれごと保存
    }
}
