import { TodoStatus } from '@prisma/client';

export interface UpdateTodoDTO {
  content?: string;
  status?: TodoStatus;
}
