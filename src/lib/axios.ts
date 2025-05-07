import axios from "axios";

export const api = axios.create({  // crea una instancia de axios
    baseURL: import.meta.env.VITE_API_URL   // asigna la url de la api desde la variable de entorno
})

api.interceptors.request.use( config => {   // intercepta la peticion y agrega el token si existe
    const token = localStorage.getItem('AUTH_TOKEN')    // obtiene el token del localStorage
    if(token){
        config.headers.Authorization = `Bearer ${token}`    // agrega el token al header de la peticion
    }
    return config
})

export default api;