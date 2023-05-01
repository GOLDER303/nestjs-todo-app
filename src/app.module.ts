import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [TodosModule, PrismaModule],
})
export class AppModule {}
