import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TaskEntity } from '../task/task.entity';
import { UserEntity } from '../user/user.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'password',
  database: 'taskman',
  entities: [TaskEntity, UserEntity],
  synchronize: true,
};
