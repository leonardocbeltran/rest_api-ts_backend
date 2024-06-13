import server from "./server";
import colors from 'colors'
import doten from 'dotenv'
doten.config()

const port = process.env.PORT || 3000

server.listen(port, () => {
    console.log(colors.red.bold('Rest API corre en puerto 4000'))
})
