import { Body, Controller, Get, Post } from '@nestjs/common';
import { Todo } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTodoDTO } from './dtos/createTodo.dto';

@Controller('todos')
export class TodosController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getTodos(): Promise<Todo[]> {
    const todos = await this.prisma.todo.findMany();
    return todos;
  }

  @Post()
  async createTodo(@Body() createTodoDTO: CreateTodoDTO): Promise<Todo> {
    const createdTodo = await this.prisma.todo.create({
      data: {
        content: createTodoDTO.content,
      },
    });

    return createdTodo;
  }
}
