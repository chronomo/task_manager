import { TaskStatus } from 'src/task/task.entity';
import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';

export class TaskFilterDto {
  @IsOptional()
  @IsIn(Object.values(TaskStatus))
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
