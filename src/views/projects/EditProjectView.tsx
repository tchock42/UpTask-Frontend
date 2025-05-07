import { getProjectById } from "@/services/ProjectService"
import { useQuery } from "@tanstack/react-query"
import { Navigate, useParams } from "react-router-dom"
import EditProjectForm from "../../components/projects/EditProjectForm"

const EditProjectView = () => {

  const params = useParams()
  const projectId = params.projectId!        // se obtiene el id como se nombre en el router. El ! indica que no puede ser undefined
  
  const { data, isLoading, isError } = useQuery({  // extrae los datos, si está cargando, el error y si hay error
    queryKey: ['editProject', projectId], // Key unico de la consulta y el ID del proyecto a buscar
    queryFn: () => getProjectById(projectId), // Función con su argumento 
    retry: false                              // No reintentar la consulta
  });
  
  if(isLoading) return 'Cargando'           // si está cargando, muestra cargando en el documento
  if(isError) return <Navigate to='/404'/>  // si hay error, redirecciona a 404

  if (data) return ( <EditProjectForm data={data} projectId={projectId}/> )
}

export default EditProjectView
