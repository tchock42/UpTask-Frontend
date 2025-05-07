import {z} from 'zod'

/* Autenticacion y usuarios*/ 
const authSchema = z.object({       // 
    name: z.string(),
    email: z.string().email(),
    current_password: z.string(),
    password: z.string(),
    password_confirmation: z.string(),
    token: z.string()                       // type solo usado para el token de confirmación
})

type Auth = z.infer<typeof authSchema>              // type para autenticacion (global)
export type UserLoginForm = Pick<Auth, 'email' | 'password' >   // type para formulario de inicio de sesion
export type UserRegistrationForm = Pick<Auth, 'name' | 'email' | 'password' |  'password_confirmation'> // type para formulario de registro
export type ConfirmToken = Pick<Auth, 'token'>      // para ingresar el token al formulario de confirmacion
export type RequestConfirmationCodeForm = Pick<Auth, 'email'>   // para solicitar un nuevo token
export type ForgotPasswordForm = Pick<Auth, 'email'>    // type para formulario de recuperacion de contraseña
export type NewPasswordForm = Pick<Auth, 'password' | 'password_confirmation'>
export type UpdateCurrentUserPasswordForm = Pick<Auth, 'current_password'| 'password' | 'password_confirmation'>
export type CheckPasswordForm = Pick<Auth, 'password'>        // para el formulario de eliminar proyecto

/* User */  
export const userSchema = authSchema.pick({    // schema usado para la consulta del req.user en useAuth
    name: true,
    email: true
}).extend({
    _id: z.string()
})
export type User = z.infer<typeof userSchema>
export type UserProfileForm = Pick<User, 'name' | 'email'>      // type para el formulario de perfil

/** Notes */
const noteSchema = z.object({                       // schema de notas
    _id: z.string(),
    content: z.string(),
    createdBy: userSchema,
    task: z.string(),
    createdAt: z.string()
});
export type Note = z.infer<typeof noteSchema>       // schema general de notas
export type NoteFormData = Pick<Note, 'content'>    // schema para el formulario de creación de notas

/* Task */
export const taskStatusSchema = z.enum(["pending", "onHold", "inProgress", "underReview", "completed"]) // schema para las tareas con zod
export type TaskStatus = z.infer<typeof taskStatusSchema>   // crea type solo para el diccionario de status

export const TaskSchema = z.object({    // schema para las tareas con zod
    _id: z.string(),
    name: z.string(),
    description: z.string(),
    project: z.string(),
    status: taskStatusSchema,
    completedBy: z.array(z.object({
        user: userSchema,       // tendra id, name, email
        status: taskStatusSchema,
        _id: z.string()
    })),
    notes: z.array(noteSchema.extend({      // agrega noteschema y ademas l ainformacion de useSchema
        createdBy: userSchema
    })),
    createdAt: z.string(),
    updatedAt: z.string()
})
export type Task = z.infer<typeof TaskSchema>                   // type para la informacion de tarea
export type TaskFormData = Pick<Task, 'name' | 'description'>   // type para informacion de formulario

export const taskProjectSchema = TaskSchema.pick({              // schema intermedio para limitar los datos de task en ProjectSchema
    _id: true,
    name: true,
    description: true,
    status: true
})

export type TaskProject = z.infer<typeof taskProjectSchema>   // type desde el schema intermedio
/* Projects */
// schema de projecto con zod
export const ProjectSchema = z.object({
    _id: z.string(),
    projectName: z.string(),
    clientName: z.string(),
    description: z.string(),
    tasks: z.array(taskProjectSchema),          // aqui va taskProjectSchema
    manager: z.string(userSchema.pick({_id:true})),      // toma el id de usuario
    team: z.array(z.string(userSchema.pick({_id: true})))
})
export const dashboardProjectSchema = z.array(ProjectSchema.pick({  // schema para las datos devueltos por la API
    _id: true,
    projectName: true,
    clientName: true,
    description: true,
    manager: true
}))

export const editProjectSchema = ProjectSchema.pick({   // type para EditProjectView
    projectName: true,
    clientName: true,
    description: true,
})

export type Project = z.infer<typeof ProjectSchema>         // type para la informacion de proyecto

// type para informacion de formulario
export type ProjectFormData = Pick<Project, 'projectName' | 'clientName' | 'description'>

/**Team */
export const teamMemberSchema = userSchema.pick({
    name: true,
    email: true,
    _id: true
})
export const teamMembersSchema = z.array(teamMemberSchema)  // schema para la información de colaboradore(s)

export type TeamMember = z.infer<typeof teamMemberSchema>   // type para la informacion de colaborador
export type TeamMemberForm = Pick<TeamMember, 'email'>      // type para la búsqueda de usuario para colaborador

