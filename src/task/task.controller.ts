import {
  Controller,
  Get,
  Post,
  Body,
  ValidationPipe,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from 'src/dto/createTask.dto';
import { TaskStatusValidationPipe } from '../pipes/taskstatus.validation.pipe';
import { TaskStatus } from './task.entity';
import { TaskFilterDto } from 'src/dto/taskFilter.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.decorator';
import { UserEntity } from '../user/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  getAllTasks(
    @User() user: UserEntity,
    @Query(ValidationPipe) taskFilterDto: TaskFilterDto,
  ) {
    return this.taskService.getAllTasks(user, taskFilterDto);
  }

  @Post()
  createNewTask(
    @Body(ValidationPipe) data: CreateTaskDto,
    @User() user: UserEntity,
  ) {
    return this.taskService.createNewTask(data, user);
  }

  @Patch('/:id')
  updateTaskStatus(
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserEntity,
  ) {
    return this.taskService.updateTaskStatus(id, status, user);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: number, @User() user: UserEntity) {
    return this.taskService.deleteTask(id, user);
  }
}
