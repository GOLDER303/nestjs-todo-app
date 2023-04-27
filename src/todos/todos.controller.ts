import { Body, Controller, Get, Post } from '@nestjs/common';
import { todosData } from './todos-mock';
import { TodoDTO } from './todo.dto';
import { CreateTodoDTO } from './createTodo.dto';

@Controller('todos')
export class TodosController {
  @Get()
  getTodos(): TodoDTO[] {
    return todosData;
  }

  @Post()
  createTodo(@Body() createTodoDTO: CreateTodoDTO): TodoDTO {
    const newTodoDTO: TodoDTO = {
      id: todosData.length + 1,
      title: createTodoDTO.title,
      status: 'inProgress',
    };

    todosData.push(newTodoDTO);

    return newTodoDTO;
  }
}
