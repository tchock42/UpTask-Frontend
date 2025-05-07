import { isAxiosError } from "axios";
import { api } from "@/lib/axios";
import { Project, Task, TaskFormData, TaskSchema } from "../types";

type CreateTaskProps = {
    formData: TaskFormData
    projectId: Project["_id"]
    taskId: Task['_id']             // se agrega para la funcion getTaskById
    status: Task['status']
}

export async function createTask({formData, projectId}: Pick<CreateTaskProps, "formData" | "projectId">) {

    try {
        const url = `/projects/${projectId}/tasks`
        const {data} = await api.post<string>(url, formData)    //devuelve un string, se envía la url con el formData del body
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error);
        }
    }
}
// obtención de la tarea para su actualización
export async function getTaskById({projectId, taskId}: Pick<CreateTaskProps, "projectId" | 'taskId'>){
    try {
        const url = `/projects/${projectId}/tasks/${taskId}`
        const {data} = await api(url)
        console.log(data)
        const response = TaskSchema.safeParse(data)
        // console.log(response)
        if(response.success){
            console.log(response.data)
            return response.data
        }
        if(!response.success){
            console.error("Validation failed:", response.error.format())
        }
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error);
        }
    }
}
// actualización de la tarea 
export async function updateTask({projectId, taskId, formData}: Pick<CreateTaskProps, 'projectId' | 'taskId' | 'formData'>){
    try {
        const url = `/projects/${projectId}/tasks/${taskId}`
        const {data} = await api.put(url, formData) // actualiza la tarea con el body
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error);
        }
    }
}
// eliminacion de tarea
export async function deleteTask({projectId, taskId}: Pick<CreateTaskProps, "projectId" | 'taskId'>){
    try {
        const url = `/projects/${projectId}/tasks/${taskId}`
        const {data} = await api.delete<string>(url)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error);
        }
    }
}
// actualizacion del status
export async function updateStatus({projectId, taskId, status}: Pick<CreateTaskProps, "projectId" | 'taskId' | 'status'>){
    try {
        const url = `/projects/${projectId}/tasks/${taskId}/status`
        const {data} = await api.patch<string>(url, {status})
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error);
        }
    }
}