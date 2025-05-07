import { Project, TeamMember } from "../types"

// fnción que retorna true si el usuario está autorizado para realizar modificaciones
export const isManager = (managerId: Project['manager'], userId: TeamMember['_id']) => {
    return managerId === userId
}