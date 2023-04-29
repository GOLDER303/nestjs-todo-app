import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { TodosController } from './todos/todos.controller';

@Module({
  imports: [],
  controllers: [TodosController],
  providers: [PrismaService],
})
export class AppModule {}
