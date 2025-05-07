import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/services/AuthService";

// custom hook para obtener el usuario autenticado
export const useAuth = () => {

    const {data, isError, isLoading} = useQuery({
        queryKey: ['user'],             // identificador de la consulta
        queryFn: getUser,               // funcion que se ejecuta al llamar al custom hook
        retry: 1,                       // solo intenta una vez mas la consulta
        refetchOnWindowFocus: false     // no refresca la consulta cuando se vuelve a mostrar la ventana
    })
    return {data, isError, isLoading}   // retorna los datos de la consulta
}