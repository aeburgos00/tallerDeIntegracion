# Para que sirve cada cosa?

Dentro de src van a encontrar:
## Config
Aca vamos a guardar las configuraciones globales (por ejemplo configuraciones de la integracion con Supabase).
## Routes
Aca se van a definir los endpoints que vamos a exponer.
No va a ver logica aca dentro, simplemente vamos a recibir una request y llamar a su respectivo controller.
## Controllers
Aca manejamos las requests y responses.
Validamos que la requests sea correcta, hacemos un manejo de errores y devolvemos la response.
## Services
Vamos a tener aca la logica real.
Aca dentro vamos a tener las consultas a la base de datos, las reglas del negocio, los calculos que haya que hacer.
Lo mas similiar que vemos en programacion de la facultad.
## Separamos el controller del service porque:
En el 'controller' manejamos la peticion HTTP.
En el 'service' manejamos la logica de la regla del negocio.
Basicamente, estamos haciendo codigo reutilizable.
## Middlewares
Aca vamos a encontrar codigo que se ejecuta antes.
Por ejemplo puede ser autentificacion, logs, permisos, manejo de errores previos a iniciar el llamado.
Un ejemplo puede ser que el usuario intenta ingresar y cargue mal la contraseña, aca se va a validar eso.
## Utils
Aca vamos a guardar funciones reutilizables.

# server.js
Este archivo va a ser el que se va a terminar ejecutando.
Aca se va a levantar Express (este es el framework de node.js que vamos a utilizar para armar el backend), los middlewares, las rutas, el servidor, etc.
# .env
Vamos a guardar las variables de entorno que necesitemos.
