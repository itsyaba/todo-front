import { z } from "zod";


export interface Account {
  username: string
  password: string
  role: 'user' | 'admin'
}

export interface FormData {
  username: Account['username']
  password: Account['password']
}


export interface AuthFormData {

  username: string;

  password: string;

}


// Base Schemas
const BaseUserSchema = z.object({
  id: z.number(),
  username: z.string().min(3),
  password: z.string().min(8),
});

const BaseCollectionSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  icon: z.string().min(1),
  favorite: z.boolean().default(false),
  userId: z.number(),
  createdAt: z.date(),
});

const BaseTaskSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  description: z.string().optional(),
  completed: z.boolean().default(false),
  parentId: z.number().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  dueDate: z.date().optional(),
  collectionId: z.number().optional(),
  userId: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Insert Schemas
export const UserInsertSchema = BaseUserSchema.pick({
  username: true,
  password: true,
});

export const CollectionInsertSchema = BaseCollectionSchema.pick({
  name: true,
  icon: true,
  favorite: true,
  userId: true,
});

export const TaskInsertSchema = BaseTaskSchema.pick({
  title: true,
  description: true,
  completed: true,
  parentId: true,
  priority: true,
  dueDate: true,
  collectionId: true,
  userId: true,
});

// Update Schemas
export const UserUpdateSchema = UserInsertSchema.partial();
export const CollectionUpdateSchema = CollectionInsertSchema.partial();
export const TaskUpdateSchema = TaskInsertSchema.partial();

// Response Schemas
export const UserResponseSchema = BaseUserSchema;
export const CollectionResponseSchema = BaseCollectionSchema;
export const TaskResponseSchema = BaseTaskSchema;

// Type Exports
export type User = z.infer<typeof UserResponseSchema>;
export type UserInsert = z.infer<typeof UserInsertSchema>;
export type UserUpdate = z.infer<typeof UserUpdateSchema>;

export type Collection = z.infer<typeof CollectionResponseSchema>;
export type CollectionInsert = z.infer<typeof CollectionInsertSchema>;
export type CollectionUpdate = z.infer<typeof CollectionUpdateSchema>;

export type Task = z.infer<typeof TaskResponseSchema>;
export type TaskInsert = z.infer<typeof TaskInsertSchema>;
export type TaskUpdate = z.infer<typeof TaskUpdateSchema>;

// Optional: Relationship Types
export type CollectionWithTasks = Collection & {
  tasks: Task[];
};

export type TaskWithSubtasks = Task & {
  subtasks: Task[];
};

export type UserWithRelations = User & {
  collections: Collection[];
  tasks: Task[];
};