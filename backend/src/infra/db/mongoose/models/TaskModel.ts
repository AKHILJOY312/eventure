// src/infrastructure/models/TaskModel.ts
import mongoose, { Document, Schema, Types } from "mongoose";
import { Task, TaskProps, TaskStatus } from "@/entities/Task";

export interface TaskDoc extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  status: TaskStatus;
  createdBy: string; // Stored as string ID
  isDeleted: boolean;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<TaskDoc>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
      index: true,
    },

    createdBy: { type: String, required: true },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export const TaskModel = mongoose.model<TaskDoc>("Task", taskSchema);

// Mapper: Mongo → Domain
export const toTaskEntity = (doc: TaskDoc): Task => {
  const props: TaskProps = {
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    status: doc.status,
    createdBy: doc.createdBy,
    createdAt: doc.createdAt,
  };

  return new Task(props);
};
