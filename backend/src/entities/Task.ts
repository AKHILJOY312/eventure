// src/domain/entities/Task.ts
export type TaskStatus = "todo" | "in-progress" | "done";

export interface TaskProps {
  id?: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdBy: string; // User ID
  createdAt?: Date;
}

export class Task {
  private _props: TaskProps;

  constructor(props: TaskProps) {
    this._props = { ...props };
  }

  get id() {
    return this._props.id;
  }
  get title() {
    return this._props.title;
  }
  get status() {
    return this._props.status;
  }

  get description(): string {
    return this._props.description;
  }
  get createdBy(): string {
    return this._props.createdBy;
  }
  get createdAt(): Date {
    return this._props.createdAt || new Date();
  }
  setId(id: string) {
    this._props.id = id;
  }

  // BUSINESS METHOD: Restricted status update
  moveToPhase(newStatus: TaskStatus): void {
    // if (this._props.assignedTo !== userId) {
    //   throw new Error("PERMISSION_DENIED: ONLY_ASSIGNEE_CAN_MOVE_TASK");
    // }
    this._props.status = newStatus;
  }

  updateDetails(title: string, description: string): void {
    this._props.title = title;
    this._props.description = description;
  }
}
