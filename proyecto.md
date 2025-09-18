# Aplicación web de *Caballos de carreras*

Se pretende desarrollar una aplicación para permitir a fans del deporte de *carreras de caballos* informarse sobre sus caballos favoritos y sobre carreras interesantes que hayan ocurrido recientemente. 

Se tendrá una sección para ver los datos de los caballos y otra sección estilo blog con noticias de carreras recientes, sobretodo aquellas en las que hayan participado los caballos listados.
También se tendrá un pequeño apartado con enlaces a unas organizaciones que se encargan del cuidado de caballos retirados y que aceptan donaciones (una de España, otra de EEUU y otra de Japón).

Los usuarios en general podrán ver los caballos, las noticias de carreras (sobre las que podrán comentar) y los enlaces a tres organizaciones.
Los administradores podrán crear/editar/borrar las páginas y borrar comentarios en noticias, además de las acciones de usuario normal.

## Parte 1: Requerimientos <a id="requerimientos"></a>

Los casos de uso básicos son:

* Un usuario sin estar autentificado debe poder ver los datos básicos de la lista de caballos más populares en el sitio
* Un usuario sin estar autentificado debe poder buscar un caballo por nombre o por estado (activo/retirado/fallecido).
* Un usuario sin estar autentificado debe poder ver todos los datos de un caballo, incluyendo enlaces a noticias relacionadas
* Un usuario debe poder hacer login y logout en la aplicación
* Un usuario debe poder darse de alta, editar su perfil y darse de baja
* Un usuario autentificado debe poder añadir un caballo a su lista de favoritos y recibir notificaciones cuando haya noticias suyas.
* Un usuario autentificado debe poder añadir un comentario en la sección de comentarios de una noticia y posteriormente poder editarlo.
* Un usuario autentificado debe poder responder a un comentario de otro usuario en la sección de comentarios de una noticia.
* El usuario administrador autentificado podrá gestionar (crear, ver, modificar y borrar) todas las páginas.
* El usuario administrador autentificado podrá eliminar comentarios de la sección de comentarios de una noticia.

## Parte 2: Modelo de datos <a id="modelo_datos"></a>


```mermaid
erDiagram
    USUARIOS {
        string uid
        string nombre
        string email
        string password
        string rol
        date fecha_registro
    }

    CABALLOS {
        string id
        string nombre
        string descripcion
        string color
        string sexo
        date fecha_nacimiento
        date fecha_retiramiento
        date fecha_fallecimiento
        string duenyo
        string entrenador
        string hogar
    }

    IMAGENES {
        string id
        string id_caballo
        string url
        string descripcion
        date fecha_subida
    }
    
    CARRERAS {
        string id
        string nombre
        date fecha
        string primer_puesto
        string segundo_puesto
        string tercer_puesto
    }

    NOTICIAS {
        string id
        string titulo
        string contenido
        date fecha
    }

    NOTICIA_CABALLO {
        string id_noticia
        string id_caballo
    }

    COMENTARIOS {
        string id
        string contenido
        date fecha
        string uid_usuario
        string id_noticia
    }

    FAVORITOS {
        string uid_usuario
        string id_caballo
    }
    
    PARTICIPACIONES {
        string id_caballo
        string id_evento
    }

    PEDIGRI {
        string id_caballo        "el descendiente"
        string id_ascendiente   "ForeignKey a CABALLOS.id (opcional)"
        string nombre_ascendiente "texto libre si no hay sujeto"
        string tipo_relacion    "padre o madre, pero en terminologia de caballo"
    }
    
    CABALLOS ||--o{ IMAGENES : "tiene"
    CABALLOS ||--o{ PEDIGRI : "tiene"
    CABALLOS ||--o{ PEDIGRI : "es_referido"
    CABALLOS ||--o{ PARTICIPACIONES : "participa"
    CARRERAS ||--o{ PARTICIPACIONES : "tiene"
    USUARIOS ||--o{ COMENTARIOS : "hace"
    NOTICIAS ||--o{ COMENTARIOS : "tiene"
    NOTICIAS ||--o{ NOTICIA_CABALLO : "se_asocia"
    CABALLOS ||--o{ NOTICIA_CABALLO : "se_asocia"
    USUARIOS ||--o{ FAVORITOS : "marca"
    CABALLOS ||--o{ FAVORITOS : "es_favorito"
```
