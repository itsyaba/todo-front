import { Collection, CollectionInsert, CollectionUpdate, Task, TaskInsert } from "@/@types";
import { BACKEND_URL } from "@/constants";

import axios from "axios";
const token = localStorage.getItem("token")

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Authorization" : `Bearer ${token}` ,
    "Content-Type": "application/json",
  },
});

// Collections
export const getCollections = async (): Promise<Collection[]> => {
  const response = await api.get("/collections");
  console.log("RESPONSEEE : " , response);
  
  return response.data.data;
};

export const createCollection = async (collection:CollectionInsert): Promise<Collection> => {
  console.log(collection);
  const response = await api.post("/collections", collection);
  console.log("RESP" , response);
  
  return response.data;
};

export const updateCollection = async (id: string, collection: Partial<CollectionUpdate>): Promise<Collection> => {
  const response = await api.put(`/collections/${id}`, collection);
  return response.data;
};

export const deleteCollection = async (id: number): Promise<void> => {
  await api.delete(`/collections/${id}`);
};

// Local storage keys
const LOCAL_TASKS_KEY = "local_tasks";

// Helper function to generate unique ID
const generateId = (): number => {
  return Date.now() + Math.floor(Math.random() * 1000);
};

// Get tasks from local storage
const getLocalTasks = (): Task[] => {
  const tasksJson = localStorage.getItem(LOCAL_TASKS_KEY);
  return tasksJson ? JSON.parse(tasksJson) : [];
};

// Save tasks to local storage
const saveLocalTasks = (tasks: Task[]): void => {
  localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(tasks));
};

// Tasks - Local Storage Implementation
export const getTasks = async (collectionId?: number): Promise<Task[]> => {
  const tasks = getLocalTasks();
  
  // Filter by collection if specified
  if (collectionId) {
    return tasks.filter(task => 
      task.collectionId === collectionId && 
      task.parentId === null // Only return top-level tasks
    );
  }
  
  // Return all top-level tasks
  return tasks.filter(task => task.parentId === null);
};

export const getTask = async (id: number): Promise<Task> => {
  const tasks = getLocalTasks();
  const task = tasks.find(t => t.id === id);
  
  if (!task) {
    throw new Error(`Task with ID ${id} not found`);
  }
  
  return task;
};

export const getSubtasks = async (taskId: number): Promise<Task[]> => {
  const tasks = getLocalTasks();
  return tasks.filter(task => task.parentId === taskId);
};

export const createTask = async (task: Omit<TaskInsert, "userId">): Promise<Task> => {
  const tasks = getLocalTasks();
  
  const newTask: Task = {
    ...task,
    id: generateId(),
    // parentId: null,
    completed: false,
    userId: 1, // Default userId
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  tasks.push(newTask);
  saveLocalTasks(tasks);
  
  return newTask;
};

export const createSubtask = async (parentId: number, task: Omit<TaskInsert, "userId">): Promise<Task> => {
  const tasks = getLocalTasks();
  
  // Find parent task to ensure it exists
  const parentTask = tasks.find(t => t.id === parentId);
  if (!parentTask) {
    throw new Error(`Parent task with ID ${parentId} not found`);
  }
  
  const newTask: Task = {
    ...task,
    id: generateId(),
    parentId: parentId,
    completed: false,
    userId: 1, // Default userId
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  tasks.push(newTask);
  saveLocalTasks(tasks);
  
  return newTask;
};

export const updateTask = async (id: number, taskUpdate: Partial<TaskInsert>): Promise<Task> => {
  const tasks = getLocalTasks();
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    throw new Error(`Task with ID ${id} not found`);
  }
  
  // Update the task
  const updatedTask = {
    ...tasks[taskIndex],
    ...taskUpdate,
  };
  
  tasks[taskIndex] = updatedTask;
  saveLocalTasks(tasks);
  
  return updatedTask;
};

export const deleteTask = async (id: number): Promise<void> => {
  let tasks = getLocalTasks();
  
  // Find all subtasks recursively
  const findSubtaskIds = (parentId: number): number[] => {
    const directSubtasks = tasks.filter(t => t.parentId === parentId);
    const directIds = directSubtasks.map(t => t.id);
    
    // Get all nested subtask ids
    const nestedIds = directIds.flatMap(subtaskId => findSubtaskIds(subtaskId));
    
    return [...directIds, ...nestedIds];
  };
  
  // Get all subtask ids to delete
  const subtaskIds = findSubtaskIds(id);
  
  // Filter out the task and all its subtasks
  tasks = tasks.filter(t => t.id !== id && !subtaskIds.includes(t.id));
  saveLocalTasks(tasks);
};

export default api;
