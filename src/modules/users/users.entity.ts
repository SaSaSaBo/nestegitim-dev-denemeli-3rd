import { BaseEntity, Column, DeleteDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CoursesEntity } from '../courses/courses.entity';
import { Role } from './enum/role.enum';

@Entity('Users')
export class UsersEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 13 }) 
  phone: string;  

  @Column({ type: 'varchar', length: 150, nullable: false })
  password: string;
  hashedPassword: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: [Role.User], 
  })
  roles: Role;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  deletedAt: Date;

  @ManyToMany(() => CoursesEntity, (courses) => courses.users)
  @JoinTable({
    name: 'users_courses'
  })
  courses: CoursesEntity[]

  userId: any;
  permissions: any;
  
}
