export type TaskStatusEnum = 'TODO' | 'COMPLETED'
export interface TaskType {
  id: string,
  title: string,
  event: string,
  details: string,
  datetime: string,
  status: TaskStatusEnum
  created_at: string,
  updated_at: string,
}