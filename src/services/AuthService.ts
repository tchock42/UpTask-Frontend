import {api} from '@/lib/axios'
import { isAxiosError } from 'axios'
import { CheckPasswordForm, ConfirmToken, ForgotPasswordForm, NewPasswordForm, RequestConfirmationCodeForm, UserLoginForm, UserRegistrationForm, userSchema } from '../types'

export async function createAccount(formData: UserRegistrationForm){
    try {
        const url = '/auth/create-account'
        const {data} = await api.post<string>(url, formData) // <string> porque retorna un string
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}
export async function confirmAccount(formData: ConfirmToken) {  // no se coloca el ['token'] porque se espera un objeto en el formData
    try {
        const url = '/auth/confirm-account';
        const {data} = await api.post<string>(url, formData)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){          // si es un error de axios
            throw new Error(error.response.data.error)      // retorna un error con la respuesta de la api
        }
    }   
}
export async function requestConfirmationCode(formData: RequestConfirmationCodeForm) {  // type para el envío de correo 
    try {
        const url = '/auth/request-code';           // url de la api para la solicitud de nuevo token
        const {data} = await api.post<string>(url, formData)    // el formData es el correo
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){          // si es un error de axios
            throw new Error(error.response.data.error)      // retorna un error con la respuesta de la api
        }
    }   
}
export async function authenticateUser( formData:UserLoginForm){
    try {
        const url = '/auth/login';           // url de la api para la solicitud de nuevo token
        const {data} = await api.post<string>(url, formData)    // el formData es el correo
        localStorage.setItem('AUTH_TOKEN', data);               // guarda al usuario al iniciar sesión
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){          // si es un error de axios
            throw new Error(error.response.data.error)      // retorna un error con la respuesta de la api
        }
    }   
}
export async function forgotPassword(formData: ForgotPasswordForm){
    try {
        const url = '/auth/forget-password';
        const {data} = await api.post<string>(url, formData)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}
export async function validateToken(formData: ConfirmToken){
    try {
        const url = '/auth/validate-token';
        const {data} = await api.post<string>(url, formData)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}
export async function updatePasswordWithToken({formData, token}: {formData: NewPasswordForm, token: ConfirmToken['token']}){
    try {
        const url = `/auth/update-password/${token}`;
    
        const {data} = await api.post<string>(url, formData)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}
export async function getUser() {
    try {   
        const {data} = await api('/auth/user')          // obtiene el usuario
        const response = userSchema.safeParse(data)      // valida el usuario
        if(response.success){                     // si el usuario es válido    
            return response.data                // retorna el usuario
        }
    
    } catch (error) {   
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}
export async function checkPassword (formData: CheckPasswordForm) {
    try {
        const url = '/auth/check-password'
        const {data} = await api.post(url, formData)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)  //
        }
    }
}