// @ts-nocheck
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
  // console.log("RESPONSEEE : " , response);
  
  return response.data.data;
};

export const createCollection = async (collection:CollectionInsert): Promise<Collection> => {
  console.log(collection);
  const response = await api.post("/collections", collection);
  // console.log("RESP" , response);
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
  return response.data.data;
};

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

export const getSubtasks = async (taskId: string): Promise<Task[]> => {
  try {
    const response = await api.get(`/task/${taskId}`);
    // Since getByIdTask returns an array with one task, get the first item
    const parentTask = response.data.data[0];
    console.log("PARENT TASK : " , parentTask , "THIS IS FOR GETTING SUBTASKS" , response.data.data);
    return parentTask?.subTasks || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        `Failed to get subtasks: ${error.message}`
      );
    }
    throw new Error('Unknown error occurred');
  }
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

// Create a subtask for main task
export const createSubtask = async (parentId: string, task: Partial<TaskInsert>): Promise<Task> => {
  try {
    console.log("Creating subtask with:", {
      parentId,
      task,
      url: `/task/${parentId}/subtasks`
    }, "THIS IS FOR CREATING SUBTASK(NOT NESTED)");
    
    const response = await api.post(`/task/${parentId}/subtasks`, {
      title: task.title,
      description: task.description,
      dueDate: task.dueDate
    });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("ERROR while creating subtasks : ", error);
      console.error("Request data:", {
        parentId,
        task,
        error: error.response?.data
      });
      throw new Error(
        error.response?.data?.message || 
        `Failed to create subtask: ${error.message}`
      );
    }
    throw new Error('Unknown error occurred');
  }
};

// Create a nested subtask (subtask of a subtask)
export const createNestedSubtask = async (
  taskId: string,
  parentSubtaskId: string,
  task: Partial<TaskInsert>
): Promise<Task> => {
  try {
    console.log("Creating nested subtask with:", {
      "taskId" : taskId,
      // "parentSubtaskId" : parentSubtaskId,
      "task" : task,
      url: `/task/${taskId}/subtasks/${parentSubtaskId}`
    });
    const response = await api.post(`/task/${taskId}/subtasks/${parentSubtaskId}`, {
      title: task.title,
      description: task.description,
      dueDate: task.dueDate
    });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("ERROR while creating nested subtask : ", error);
      throw new Error(
        error.response?.data?.message || 
        `Failed to create nested subtask: ${error.message}`
      );
    }
    throw new Error('Unknown error occurred');
  }
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

export const deleteTask = async (id: string): Promise<void> => {
  try {
    await api.delete(`/task/${id}`);
  } catch (error) {
    console.error("ERROR while deleting task : " , error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
        `Failed to delete task: ${error.message}`
      );
    }
    throw new Error('Unknown error occurred');
  }
};

export default api;
