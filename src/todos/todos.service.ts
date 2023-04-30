import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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

  async deleteTodo(todoId: number): Promise<Todo> {
    try {
      const deletedTodo = await this.prisma.todo.delete({
        where: {
          id: todoId,
        },
      });

      return deletedTodo;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Todo with id ${todoId} not found`);
      }
      throw new InternalServerErrorException(
        'Something went wrong try again later',
      );
    }
  }
}
