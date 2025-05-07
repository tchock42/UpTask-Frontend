// api de consultas a la base de datos (servicios)
import { api } from "@/lib/axios";
import { dashboardProjectSchema, editProjectSchema, Project, ProjectFormData, ProjectSchema } from "@/types/index";
import { isAxiosError } from "axios";


export const CreateProject = async (formData: ProjectFormData) => {
    
    try {
        const {data} = await api.post('/projects', formData)    // realiza la consulta a la base de datos con el metodo post y la data del formulario
        
        return data                        // retorna la data
    } catch (error) {
        if(isAxiosError(error) && error.response) { // si es un error de axios y tiene respuesta de la API
            throw new Error(error.response.data.error)  // lanza un error con el mensaje de error de la respuesta
        }  
    } 
}

export const getProjects = async () => {
    
    try {
        const {data} = await api('/projects')
        const response = dashboardProjectSchema.safeParse(data)     // validacion de data
        if(response.success){
            return response.data
        }

    } catch (error) {
        // en caso de error envia una instancia de error para que react-query la gestione con el onError:
        if(isAxiosError(error) && error.response) { // si es un error de axios y tiene respuesta
            throw new Error(error.response.data.error)  // lanza un error con el mensaje de error de la respuesta
        }  
    }
}

export const getProjectById = async (id: Project['_id']) => { // usa el type de Project con el lookup de _id | para EditProjectView
    try{
        const {data} = await api(`/projects/${id}`)
        const response = editProjectSchema.safeParse(data)
        if(response.success){
            return response.data
        } 
    }catch(error){
        if(isAxiosError(error) && error.response){          // si es un error de axios y tiene respuesta
            throw new Error(error.response.data.error)     // lanza un error con el mensaje de error de la respuesta
        }
    }
}
export const getFullProject = async (id: Project['_id']) => { // para ProjectDetailsView
    try{
        const {data} = await api(`/projects/${id}`)
        const response = ProjectSchema.safeParse(data)
        if(response.success){
            return response.data
        } 
    }catch(error){
        if(isAxiosError(error) && error.response){          // si es un error de axios y tiene respuesta
            throw new Error(error.response.data.error)     // lanza un error con el mensaje de error de la respuesta
        }
    }
}

type UpdateProjectType = {
    formData: ProjectFormData,
    projectId: Project['_id']
}

export const updateProject = async ({formData, projectId}: UpdateProjectType) => { // usa el type de Project con el lookup de _id
    try{
        const {data} = await api.put<string>(`/projects/${projectId}`, formData)
        
        return data
    }catch(error){
        if(isAxiosError(error) && error.response){          // si es un error de axios y tiene respuesta
            throw new Error(error.response.data.error)     // lanza un error con el mensaje de error de la respuesta
        }
        //throw new Error('Ocurrió un error inesperado')      // si no es un error de axios, lanza un error inesperado 
    }
}
export const deleteProject = async (id: Project['_id']) => { // usa el type de Project con el lookup de _id
    try{
        const {data} = await api.delete<string>(`/projects/${id}`)
        
        return data
    }catch(error){
        if(isAxiosError(error) && error.response){          // si es un error de axios y tiene respuesta
            throw new Error(error.response.data.error)     // lanza un error con el mensaje de error de la respuesta
        }
        //throw new Error('Ocurrió un error inesperado')      // si no es un error de axios, lanza un error inesperado 
    }
}