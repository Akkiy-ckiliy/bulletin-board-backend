import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('mimicro_post')
export class MicroPost {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  user_id: number;

  @Column()
  content: string;

  @CreateDateColumn()
  readonly created_at?: Date;

  @UpdateDateColumn()
  readonly updated_at?: Date;
}
