// employee.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  position: string;

  @ManyToOne(() => Employee, (employee) => employee.subordinates, {
    nullable: true,
  })
  manager: Employee;

  @OneToMany(() => Employee, (employee) => employee.manager)
  subordinates: Employee[];
}
