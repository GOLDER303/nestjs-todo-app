import { Body, Controller, Get, Post } from '@nestjs/common';
import { Todo } from '@prisma/client';
import { CreateTodoDTO } from './dtos/createTodo.dto';
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
}
