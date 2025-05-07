import ProjectForm from '@/components/projects/ProjectForm'
import { Project, ProjectFormData } from '@/types/index'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProject } from '@/services/ProjectService'
import { toast } from 'react-toastify'

type EditProjectFormProps = {
    data: ProjectFormData
    projectId: Project['_id']
}

const EditProjectForm = ({data, projectId}: EditProjectFormProps) => {
    const navigate = useNavigate()
    const initialValues: ProjectFormData = {             // objeto con los valores iniciales del formulario
        projectName: data.projectName,
        clientName: data.clientName,
        description: data.description
    }
    const {register, handleSubmit, formState: {errors}} = useForm({defaultValues: initialValues})  // hook de react-hook-form para la información del formulario

    const queryClient = useQueryClient()        // crea instancia de usequeryclient para invalidar cache

    const { mutate } = useMutation({            // crea la instancia de useMutation para POST, ya que get es con useQuery
        mutationFn: updateProject,              // funcion de la api para actualizar proyecto
        onError: (error) => {                   // estado de error
            toast.error(error.message)
        },
        onSuccess: (data) => {                  // al actualizar correctamente, invalida cache y redirige con toast de success
            queryClient.invalidateQueries({queryKey: ['projects']}) 
            queryClient.invalidateQueries({queryKey: ['editProject', projectId]})
            toast.success(data)
            navigate('/')
        }

    })
    const handleForm = async (formData: ProjectFormData) => {
        const data = {
            formData,
            projectId
        }
        mutate(data)
    }

    return (
        <>  
            <div className="max-w-3xl mx-auto">
                <h1 className="text-5xl font-black">Editar Proyecto</h1>
                <p className="text-2xl font-light text-gray-500 mt-5">Llena el siguiente formulario para editar el proyecto</p>

                <nav className="my-5">
                    <Link
                        className="bg-purple-400 hover:bg-amber-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
                        to="/">
                        Ver Proyectos
                    </Link>
                </nav>
                <form 
                    className="mt-10 bg-white shadow-lg p-10 rounded-lg"
                    onSubmit={ handleSubmit(handleForm) }     // pasa la información del formulario (data)
                    noValidate                          // deshabilita la validacion de html5
                >

                    <ProjectForm 
                        register = {register}           // pasa el hook register y errors como props
                        errors = {errors}
                    />

                    <input 
                        type="submit" 
                        value='Guardar cambios'
                        className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors"    
                    />
                </form>
            </div>
            
        </>
    )
}

export default EditProjectForm
