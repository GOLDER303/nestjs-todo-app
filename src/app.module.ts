import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { TodosController } from './todos/todos.controller';
import { TodosService } from './todos/todos.service';

@Module({
  imports: [],
  controllers: [TodosController],
  providers: [PrismaService, TodosService],
})
export class AppModule {}
