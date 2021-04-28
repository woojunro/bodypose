import { CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export abstract class LogEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @CreateDateColumn()
  timestamp: Date;
}
