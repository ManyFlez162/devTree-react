import colors from 'colors'
import server from './server'

const port = process.env.port || 3000 // Usa el puerto del host en el deploy. Si es local, utiliza el puerto 3000

server.listen(port, () => {
    console.log(colors.blue.bold('Servidor corriendo en: '), port)
})