import { Column, Entity, PrimaryColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('tools')
export class Tool {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  link: string;

  @Column()
  description: string;

  @Column('varchar')
  tags: string[];

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
