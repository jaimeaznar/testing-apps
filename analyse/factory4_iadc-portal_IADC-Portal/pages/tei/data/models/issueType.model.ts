import { Status } from './status.model';

export interface IssueType {
  id: number;
  name: string;
  subtask?: boolean;
  statuses: Array<Status>;
}
