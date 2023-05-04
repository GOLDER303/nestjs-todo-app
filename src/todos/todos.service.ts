import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Todo } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTodoDTO } from './dtos/create-todo.dto';
import { UpdateTodoDTO } from './dtos/update-todo.dto';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  async getAllTodos(userId: number): Promise<Todo[]> {
    const todos = await this.prisma.todo.findMany({
      where: {
        userId,
      },
    });
    return todos;
  }

  async createTodo(
    createTodoDTO: CreateTodoDTO,
    userId: number,
  ): Promise<Todo> {
    const createdTodo = await this.prisma.todo.create({
      data: {
        userId,
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

  async patchTodo(todoId: number, updateTodoDTO: UpdateTodoDTO) {
    try {
      const updatedTodo = await this.prisma.todo.update({
        where: { id: todoId },
        data: {
          ...updateTodoDTO,
        },
      });

      return updatedTodo;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Todo with id ${todoId} not found`);
      }

      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Request body is wrong');
      }

      throw new InternalServerErrorException(
        'Something went wrong try again later',
      );
    }
  }
}
