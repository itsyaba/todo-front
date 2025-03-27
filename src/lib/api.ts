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

export const getLocalTasks = async (): Promise<Task[]> => {
  const response = await api.get("/task");
  console.log("RESPONSEEE TASKKK: " , response);
  
  return response.data.data;
};

// // Local storage keys
// const LOCAL_TASKS_KEY = "local_tasks";

// // Helper function to generate unique ID
// const generateId = (): number => {
//   return Date.now() + Math.floor(Math.random() * 1000);
// };

// // Get tasks from local storage
// const getLocalTasks = (): Task[] => {
//   const tasksJson = localStorage.getItem(LOCAL_TASKS_KEY);
//   return tasksJson ? JSON.parse(tasksJson) : [];
// };

// Tasks - Local Storage Implementation
export const getTasks = async (collectionId: number | undefined): Promise<Task[]> => {
  const tasks = getLocalTasks();
  console.log(collectionId);
  
  return tasks
  }
  
  // Return all top-level tasks
  // return tasks.filter(task => task.parentId === null);
// };

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

export const createTask = async (task: TaskInsert): Promise<Task> => {
  // const tasks = getLocalTasks();
  
   const response = await api.post("/task", task);
  console.log("RESP" , response);
  
  return response.data;

  // const newTask: Task = {
  //   ...task,
  //   // parentId: null,
  //   completed: false,
  //   userId: 1, // Default userId
  //   createdAt: new Date(),
  //   updatedAt: new Date(),
  //   id: 0
  // };
  
  // // tasks.push(newTask);
  // // saveLocalTasks(tasks);
  
  // return newTask;
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
    id: 3,
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


// export const updateCollection = async (id: string, collection: Partial<CollectionUpdate>): Promise<Collection> => {
//   const response = await api.put(`/collections/${id}`, collection);
//   return response.data;
// };

export const updateTask = async (
  id: string,
  taskUpdate: Partial<TaskInsert>
): Promise<Task> => {
  try {
    // const response = await axios.patch(`/task/${id}`, taskUpdate, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   withCredentials: true, 
    // });
    console.log(id , "ID");
    
     const response = await api.put(`/task/${id}`, taskUpdate);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        `Failed to update task: ${error.message}`
      );
    }
    throw new Error('Unknown error occurred');
  }
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
