import { BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from 'src/task/task.entity';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = Object.values(TaskStatus);
  transform(value: any) {
    value = value.toUpperCase();

    if (!this.isValidStatus(value)) {
      throw new BadRequestException(`${value} is an INVALID status.`);
    }

    return value;
  }

  private isValidStatus(status: any) {
    const index = this.allowedStatuses.indexOf(status);
    return index !== -1;
  }
}
