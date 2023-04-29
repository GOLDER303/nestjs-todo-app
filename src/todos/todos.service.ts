import { Injectable } from '@nestjs/common';
import { Todo } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTodoDTO } from './dtos/createTodo.dto';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  async getAllTodos(): Promise<Todo[]> {
    const todos = await this.prisma.todo.findMany();
    return todos;
  }

  async createTodo(createTodoDTO: CreateTodoDTO): Promise<Todo> {
    const createdTodo = await this.prisma.todo.create({
      data: {
        content: createTodoDTO.content,
      },
    });

    return createdTodo;
  }
}
