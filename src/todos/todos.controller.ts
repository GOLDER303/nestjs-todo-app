import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Todo } from '@prisma/client';
import { TodoOwnerGuard } from 'src/common/guards/todo-owner.guard';
import { GetUserId } from '../common/decorators/get-user-id.decorator';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { CreateTodoDTO } from './dtos/create-todo.dto';
import { UpdateTodoDTO } from './dtos/update-todo.dto';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  constructor(private todosService: TodosService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  async getTodos(@GetUserId() userId: number): Promise<Todo[]> {
    return this.todosService.getAllTodos(userId);
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  async createTodo(
    @Body() createTodoDTO: CreateTodoDTO,
    @GetUserId() userId: number,
  ): Promise<Todo> {
    return this.todosService.createTodo(createTodoDTO, userId);
  }

  @UseGuards(AccessTokenGuard, TodoOwnerGuard)
  @Delete(':id')
  async deleteTodo(@Param('id') id: string) {
    return this.todosService.deleteTodo(parseInt(id));
  }

  @UseGuards(AccessTokenGuard, TodoOwnerGuard)
  @Patch(':id')
  async patchTodo(
    @Param('id') id: string,
    @Body() updateTodoDTO: UpdateTodoDTO,
  ) {
    return this.todosService.patchTodo(parseInt(id), updateTodoDTO);
  }
}
