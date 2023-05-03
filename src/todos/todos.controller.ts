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
import { AccessTokenGuard } from './../auth/guards/accessToken.guard';
import { CreateTodoDTO } from './dtos/createTodo.dto';
import { UpdateTodoDTO } from './dtos/updateTodo.dto';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  constructor(private todosService: TodosService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  async getTodos(): Promise<Todo[]> {
    return this.todosService.getAllTodos();
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  async createTodo(@Body() createTodoDTO: CreateTodoDTO): Promise<Todo> {
    return this.todosService.createTodo(createTodoDTO);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  async deleteTodo(@Param('id') id: string) {
    return this.todosService.deleteTodo(parseInt(id));
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  async patchTodo(
    @Param('id') id: string,
    @Body() updateTodoDTO: UpdateTodoDTO,
  ) {
    return this.todosService.patchTodo(parseInt(id), updateTodoDTO);
  }
}
