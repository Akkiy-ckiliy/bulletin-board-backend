import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn() //Primary KeyかつGenerated(自動で番号振り)されるカラム(列) SQLのid SERIAL PRIMARY KEYのとこ
  readonly id: number; //readonlyでTS側で変更ができないようにしとく(セキュリティの問題)

  @Column('varchar')
  name: string;

  @Column('varchar')
  hash: string;
  
  @Column()
  email: string;
  //上３つは普通のカラム(列)定義 varcharでデータベース上の型を定義 SQLのname VARCHARのとこ
  
  @CreateDateColumn() //データが作成されたときに現在時刻を自動入力してくれる
  readonly created_at?: Date;

  @UpdateDateColumn() //データが更新されるたびに現在時刻を自動入力してくれる
  readonly updated_at?: Date;
  //ここ２つはSQLのDEFAULT CURRENT_TIMESTAMPのとこ
}

//他のauthとmicropostsも同じ。