import { isAxiosError } from "axios";
import { UpdateCurrentUserPasswordForm, UserProfileForm } from "../types";
import api from "@/lib/axios";

// actualizar el correo y el nombre del usuario
export async function updateProfile(formData: UserProfileForm) {

    try {
        const url = '/auth/profile';
        const {data} = await api.put<string>(url, formData)

        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}
// actualiza la contraseña
export async function changePassword(formData: UpdateCurrentUserPasswordForm) {

    try {
        const url = '/auth/update-password';
        const {data} = await api.post<string>(url, formData)
        console.log(data)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}