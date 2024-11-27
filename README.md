Blog
📄 Descripción
El propósito de este ejercicio es crear una API que respalde una aplicación de blog con las siguientes funcionalidades:

Registro de usuarios.
Inicio de sesión.
Roles de usuario: admin y simpleUser.
Funcionalidades para todos los usuarios:
Crear publicaciones.
Dar like a publicaciones.
Ver y eliminar sus propias publicaciones.
Editar datos personales.
Funcionalidades exclusivas del admin:
Ver todos los usuarios.
Bannear/reactivar usuarios.
Eliminar publicaciones. ( esto solo lo pueden hacer los admin o los autores de las publicaciones)

Páginas del frontend:
Formularios de registro
formulario de inicio de sesión.
Página de inicio con publicaciones ordenadas por fecha de creación.
Perfil de usuario para editar datos personales.

paginas solo para admin( ver a todos los usuarios) en esta pagina solo podran acceder los admin y pueden banear y desbanear a los usuarios se encuentra en el perfil de usuario
Requisitos adicionales:
Realizar el ejercicio en TypeScript.
Utilizar MySQL como base de datos con Prisma como ORM.
- Nivel 1
Documentar las rutas con Swagger.
Implementar tests para cada endpoint.
- Nivel 2
Posibilidad de ordenar publicaciones por popularidad y autor.
- Nivel 3
Uso del patrón Clean Architecture.
Barra de búsqueda en la página de inicio con función debounce.
- Tecnologías Utilizadas
TypeScript
Node.js
Express
Prisma ORM
MySQL
Swagger para documentación
Jest para pruebas
- Requisitos
Node.js
MySQL
Prisma CLI
npm como gestor de dependencias
  - Instalación
1.Clona el repositorio
 git clone https://github.com/miguelrp23/Blog.git


2. Instala las dependencias del backend:
 npm install

3. Configura las variables de entorno del backend:
Crea un archivo .env basándote en la configuración proporcionada en el archivo env.test ###Edit to connect to your MySQL database DATABASE_URL = "mysql://user:password@localhost:3306/Blog?schema=public" ###DataBase for testing DATABASE_URL_TEST="mysql://user:password@localhost:3306/sprint_5_blog_test?schema=public" ###You can edit PORT number PORT = 3300 ###You can edit your JWT_SECRET_KEY JWT_SECRET_KEY = 'yoursecretkey' 

###You can edit your admin key ADMIN_KEY= "your_admin_key"

4. Configura Prisma:
Utilizamos la base de datos acorde este esquema:



npx prisma migrate dev --name init npx prisma generate

5. Instala las dependencias del frontend:
npm install

- Ejecución
Inicia el servidor de desarrollo del backend:
 npm run dev 

Este script realizará la migración a la base de datos principal en caso de que se hayan realizado los test con anterioridad.

-- Nota: Aparecerá en la consola una dirección local donde podrás revisar la documentación usando Swagger. http://localhost:XXXX/api-docs
Usará el puerto que hayas configurado.

- Ejecutar Test
Para ejecutar los tests, utiliza el siguiente comando:

 npm run test

Este comando iniciara los test de el blog

