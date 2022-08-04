import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './task.entity';
import { Repository } from 'typeorm';
import { TaskStatus } from './task.entity';
import { CreateTaskDto } from '../dto/createTask.dto';
import { UserEntity } from '../user/user.entity';
import { TaskFilterDto } from 'src/dto/taskFilter.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity) private taskRepo: Repository<TaskEntity>,
  ) {}

  async getAllTasks(user: UserEntity, taskFilterDto: TaskFilterDto) {
    const { status, search } = taskFilterDto;
    const query = this.taskRepo.createQueryBuilder('task');
    if (status) {
      query.andWhere('task.userId=: userId AND task.status = :status', {
        userId: user.id,
        status,
      });
    }
    if (search) {
      query.andWhere(
        'task.userId=: userId AND (task.title LIKE: search OR task.description LIKE :search)',
        { userId: user.id, search: `%${search}%` },
      );
    }

    try {
      return await query.getMany();
    } catch (err) {
      throw new NotFoundException('Task Not Found');
    }
  }

  async createNewTask(createTaskDto: CreateTaskDto, user: UserEntity) {
    const { title, description } = createTaskDto;
    const task = new TaskEntity();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.userId = user.id;

    return await this.taskRepo.save(task);
  }

  async updateTaskStatus(id: number, status: TaskStatus, user: UserEntity) {
    await this.taskRepo.update({ id, userId: user.id }, { status });
    return this.taskRepo.findOne({ where: { id } });
  }

  async deleteTask(id: number, user: UserEntity) {
    const result = await this.taskRepo.delete({ id, userId: user.id });
    if (result.affected === 0) {
      throw new NotFoundException(`Task number:${id} NOT FOUND!!!`);
    }
  }

  private async getTaskByID(id: number) {
    const taskFound = await this.taskRepo.findOne({
      where: { id },
    });
    if (!taskFound) {
      throw new NotFoundException(`Task with ID${id}  NOT FOUND!!!`);
    }
    return taskFound;
  }
}
