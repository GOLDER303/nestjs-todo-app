import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Todo } from '@prisma/client';
import { CreateTodoDTO } from './dtos/createTodo.dto';
import { UpdateTodoDTO } from './dtos/updateTodo.dto';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  constructor(private todosService: TodosService) {}

  @Get()
  async getTodos(): Promise<Todo[]> {
    return this.todosService.getAllTodos();
  }

  @Post()
  async createTodo(@Body() createTodoDTO: CreateTodoDTO): Promise<Todo> {
    return this.todosService.createTodo(createTodoDTO);
  }

  @Delete(':id')
  async deleteTodo(@Param('id') id: string) {
    return this.todosService.deleteTodo(parseInt(id));
  }

  @Patch(':id')
  async patchTodo(
    @Param('id') id: string,
    @Body() updateTodoDTO: UpdateTodoDTO,
  ) {
    return this.todosService.patchTodo(parseInt(id), updateTodoDTO);
  }
}
