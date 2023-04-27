export interface TodoDTO {
  id: number;
  title: string;
  status: 'todo' | 'done' | 'inProgress';
}
