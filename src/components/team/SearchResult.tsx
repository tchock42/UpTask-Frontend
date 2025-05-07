import { addUserToProject } from "@/services/TeamService"
import { TeamMember } from "@/types/index"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"

type SearchResultProps = {
    user: TeamMember
    reset: () => void
}

const SearchResult = ({user, reset}: SearchResultProps) => {

    const params = useParams()
    const projectId = params.projectId!;
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const {mutate} = useMutation({
        mutationFn: addUserToProject,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            reset()
            navigate(location.pathname, {replace: true})
            queryClient.invalidateQueries({queryKey: ['projectTeam']})
        }
    })

    const handlerAddUserToProject = () => {
        const data = {
            projectId,
            id: user._id
        }
        mutate(data)
    }

    return (
        <>
            <p className="mt-10 text-center font-bold">Resultado:</p>
            <div className="flex justify-between items-center">
                <p>{user.name}</p>
                <button onClick={handlerAddUserToProject} className="text-purple-600 hover:bg-purple-100 px-10 py-3 font-bold cursor-pointer">Agregar al Proyecto</button>
            </div>
        </>
    )
}

export default SearchResult
