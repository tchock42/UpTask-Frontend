import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import ProjectForm from "@/components/projects/ProjectForm"
import { ProjectFormData } from "@/types/index"
import { CreateProject } from "@/services/ProjectService"
import {toast} from 'react-toastify'
// en este componente se gestiona la información y boton de envío del formulario de ProjectForm

const CreateProjectView = () => { // Componente

    const navigate = useNavigate()                      //hook de navigate para redireccionar
    const initialValues: ProjectFormData = {             // objeto con los valores iniciales del formulario
        projectName: "",
        clientName: "",
        description: ""
    }
    const {register, handleSubmit, formState: {errors}} = useForm({defaultValues: initialValues})  // hook de react-hook-form para la información del formulario
    
    const mutation = useMutation({                  // crea la instancia de useMutation para POST, ya que get es con useQuery
        mutationFn: CreateProject,                  // consulta a la base de datos
        onError: (error) =>{     // en caso de error, se recupera el error dado por la api
            toast.error(error.message)    
        },
        onSuccess: (data) => {  // al realizar exitosamente la consulta
            
            toast.success(data)                             // si se crea pryecto retorna Creado correctamente en el AppLayout
            navigate('/')                                   // redirecciona a home
        }
    })

    // manejo del formulario
    const handleForm = async (formData: ProjectFormData) => {   // formData es el contenido del formulario
        await mutation.mutateAsync(formData)        // ejecuta de forma asincrona la consulta
    }

    return (
        <>  
            <div className="max-w-3xl mx-auto">
                <h1 className="text-5xl font-black">Crear Proyectos</h1>
                <p className="text-2xl font-light text-gray-500 mt-5">Llena el siguiente formularios para crear un proyecto</p>

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
                        value='Crear Proyecto'
                        className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors"    
                    />
                </form>
            </div>
            
        </>
    )
}

export default CreateProjectView
