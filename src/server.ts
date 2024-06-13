import express from 'express'
import db from './config/db'
import router from './router'
import colors from 'colors'
import cors, {CorsOptions} from 'cors'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec, {swaggerUiOptions} from './config/swagger'

// conectar a base de datos
export const connectDb = async() => {
    try {
        await db.authenticate()
        db.sync()
        //console.log(colors.bgGreen.red.bold('conexion correcta a la base de datos'))
    } catch (error) {
        console.log(error)
        console.log(colors.bgRed('Error al conectar a la base de datos!!'))
    }
}
connectDb()

// instancia de Express
const server = express()

// permitir conexiones cors
const corsOptions: CorsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            process.env.FRONTEND_URL, 
            process.env.DOCS_URL
        ]
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Error de CORS'))
        }
    },
    optionsSuccessStatus: 200 //para navegadores legacy como IE11
}
server.use(cors(corsOptions))

// Leer datos de formularios
server.use(express.json())

// uso de morgan para logging
server.use(morgan('dev'))

//Routing
server.use('/api/products', router)

// Docs
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions))

export default server