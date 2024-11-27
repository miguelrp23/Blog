import express from "express";
import bodyParser from "body-parser";
import PostRoutes from "./publicaciones/aplication/postruter";
import UserRoutes from "./user/aplication/UserRoutes"
import AdminRoutes from "./user/aplication/AdminRoutes"
import cors from 'cors';
import { authenticateToken } from "./publicaciones/infraestructure/authMiddleware";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();
const PORT  = 3000;


const swaggerDefinition = {
     openapi: "3.0.0", 
     info: {
       title: "API de Blog", 
       version: "1.0.0", 
       description: "Documentación de la API de blog", 
     },
     servers: [
       {
         url: `http://localhost:${PORT}`,
       },
     ],
   };
   
   const options = {
     swaggerDefinition,
     apis: ["./src/publicaciones/aplication/*.ts", "./src/user/aplication/*.ts"], 
   };
   
   const swaggerSpec = swaggerJSDoc(options);

   app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.static('public'));
app.use(cors());
app.use(express.json())
app.use(bodyParser.json())
app.use("/", UserRoutes)
app.use("/", PostRoutes);
app.use("/",authenticateToken, AdminRoutes)

export default app.listen(PORT, () => {
     console.log(`Server running on http://localhost:${PORT}`)
})

