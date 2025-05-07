import { isAxiosError } from "axios";
import api from "@/lib/axios";
import { Project, TeamMember, TeamMemberForm, teamMembersSchema } from "../types";

// 
export async function findUserByEmail({projectId, formData}: {projectId: Project['_id'], formData: TeamMemberForm} ){
    try {
        const url = `/projects/${projectId}/team/find`;
        const {data} = await api.post(url, formData)
        
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

// agrega el usuario al proyecto con el projectId y el id del usuario en el body 
export async function addUserToProject({projectId, id}: {projectId: Project['_id'], id: TeamMember['_id']} ){   
    try {
        const url = `/projects/${projectId}/team`;
        const {data} = await api.post<string>(url, {id})            // la api espera el id como un objeto

       
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}
// obtener los miembros del equipo de colaboradores del proyecto
export async function getProjectTeam(projectId: Project['_id']){   
    try {
        const url = `/projects/${projectId}/team`;
        const {data} = await api.get(url)            // la api espera el id como un objeto
        const response = teamMembersSchema.safeParse(data)  // valida la respuesta de la API con el type de teamMembersSchema
        if(response.success){
            return response.data
        }
        
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

// elimina al miembro del team 
export async function removeUserFromProject({projectId, userId}: {projectId: Project['_id'], userId: TeamMember['_id']} ){   
    try {
        const url = `/projects/${projectId}/team/${userId}`;
        const {data} = await api.delete<string>(url,)            // la api espera el id como un objeto

       
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}
