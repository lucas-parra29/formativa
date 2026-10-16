function BarraNavegacion() {
    const [menuAbierto, setMenuAbierto] = React.useState(false);

    function cerrarMenu() {
        setMenuAbierto(false);
    }

    return (
        <nav
            className="navbar navbar-expand-md navbar-dark sticky-top"
            aria-label="Navegación principal"
        >
            <div className="container">
                <a className="navbar-brand" href="#inicio">
                    Lucas Parra
                </a>

                <button
                    className="navbar-toggler"
                    type="button"
                    aria-label="Abrir o cerrar menú"
                    aria-controls="menuPrincipal"
                    aria-expanded={menuAbierto}
                    onClick={() => setMenuAbierto(!menuAbierto)}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div
                    id="menuPrincipal"
                    className={
                        "collapse navbar-collapse " +
                        (menuAbierto ? "show" : "")
                    }
                >
                    <div className="navbar-nav ms-auto">
                        <a
                            className="nav-link"
                            href="#sobre-mi"
                            onClick={cerrarMenu}
                        >
                            Sobre mí
                        </a>

                        <a
                            className="nav-link"
                            href="#proyectos"
                            onClick={cerrarMenu}
                        >
                            Proyectos
                        </a>

                        <a
                            className="nav-link"
                            href="#noticias"
                            onClick={cerrarMenu}
                        >
                            Noticias
                        </a>

                        <a
                            className="nav-link"
                            href="#contacto"
                            onClick={cerrarMenu}
                        >
                            Contacto
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
}

function Presentacion({ nombre, carrera, github }) {
    const [fotoDisponible, setFotoDisponible] = React.useState(true);

    return (
        <section id="inicio" className="portada">
            <div className="container">
                <div className="row align-items-center g-4">
                    <div className="col-md-8">
                        <p className="text-primary fw-bold">
                            MI PORTAFOLIO PERSONAL
                        </p>

                        <h1>
                            Hola, soy <span>{nombre}</span>
                        </h1>

                        <h2 className="h4 mt-3">{carrera}</h2>

                        <p className="lead mt-3">
                            Bienvenido a mi espacio de aprendizaje
                            y desarrollo de proyectos.
                        </p>

                        <a
                            className="btn btn-primary me-2"
                            href="#proyectos"
                        >
                            Ver proyectos
                        </a>

                        <a
                            className="btn btn-outline-dark"
                            href={github}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Mi GitHub
                        </a>
                    </div>

                    <div className="col-md-4 text-center">
                        {fotoDisponible ? (
                            <img
                                className="foto-perfil"
                                src="./img/perfil.webp"
                                alt="Lucas Parra"
                                width="230"
                                height="230"
                                onError={() => setFotoDisponible(false)}
                            />
                        ) : (
                            <div
                                className="avatar"
                                role="img"
                                aria-label="Iniciales de Lucas Parra"
                            >
                                LP
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

function SobreMi() {
    return (
        <section id="sobre-mi" className="seccion fondo-blanco">
            <div className="container">
                <h2 className="titulo-seccion">Sobre mí</h2>

                <p>
                    Soy Lucas Parra, estudiante de Informática.
                    Me interesa aprender sobre desarrollo de software
                    y crear aplicaciones que permitan resolver
                    diferentes necesidades.
                </p>

                <p>
                    En este portafolio presentaré mis proyectos
                    académicos y compartiré mis avances de aprendizaje.
                </p>

                <h3 className="h5 mt-4">
                    Tecnologías utilizadas en este portafolio
                </h3>

                {["HTML", "CSS", "JavaScript", "React", "Bootstrap"].map(
                    (tecnologia) => (
                        <span className="tecnologia" key={tecnologia}>
                            {tecnologia}
                        </span>
                    )
                )}
            </div>
        </section>
    );
}

function TarjetaProyecto({ proyecto }) {
    return (
        <div className="col-md-6 col-lg-4">
            <article className="card h-100">
                <img
                    className="imagen-proyecto"
                    src={proyecto.imagen}
                    alt={"Ilustración de " + proyecto.titulo}
                    loading="lazy"
                    width="640"
                    height="360"
                />

                <div className="card-body d-flex flex-column">
                    <h3 className="h5">{proyecto.titulo}</h3>

                    <p className="card-text">
                        {proyecto.descripcion}
                    </p>

                    <div className="mb-3">
                        {proyecto.tecnologias.map((tecnologia) => (
                            <span
                                className="tecnologia"
                                key={tecnologia}
                            >
                                {tecnologia}
                            </span>
                        ))}
                    </div>

                    <a
                        href={proyecto.enlace}
                        className="btn btn-outline-primary mt-auto"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Ver proyecto
                    </a>
                </div>
            </article>
        </div>
    );
}

function Proyectos({ proyectos }) {
    const [busqueda, setBusqueda] = React.useState("");

    const proyectosFiltrados = proyectos.filter((proyecto) =>
        proyecto.titulo
            .toLowerCase()
            .includes(busqueda.toLowerCase().trim())
    );

    return (
        <section id="proyectos" className="seccion">
            <div className="container">
                <h2 className="titulo-seccion">Mis proyectos</h2>

                <label htmlFor="buscarProyecto" className="form-label">
                    Buscar por nombre
                </label>

                <input
                    id="buscarProyecto"
                    className="form-control mb-4"
                    type="search"
                    placeholder="Escribe el nombre del proyecto"
                    value={busqueda}
                    onChange={(evento) =>
                        setBusqueda(evento.target.value)
                    }
                />

                <div className="row g-4">
                    {proyectosFiltrados.map((proyecto) => (
                        <TarjetaProyecto
                            key={proyecto.id}
                            proyecto={proyecto}
                        />
                    ))}
                </div>

                {proyectosFiltrados.length === 0 && (
                    <p role="status">
                        No se encontraron proyectos.
                    </p>
                )}
            </div>
        </section>
    );
}

function SeccionNoticias({ titulo, noticias }) {
    return (
        <section className="col-md-6">
            <h3 className="h4 mb-4">{titulo}</h3>

            {noticias.map((noticia) => (
                <article className="noticia" key={noticia.id}>
                    {noticia.fecha && (
                        <time
                            dateTime={noticia.fecha}
                            className="text-muted small"
                        >
                            {noticia.fecha.split("-").reverse().join("/")}
                        </time>
                    )}

                    <h4 className="h5 mt-2">{noticia.titulo}</h4>
                    <p className="mb-0">{noticia.contenido}</p>
                </article>
            ))}
        </section>
    );
}

function Contacto() {
    const [nombre, setNombre] = React.useState("");
    const [mensaje, setMensaje] = React.useState("");
    const [resultado, setResultado] = React.useState("");

    function prepararMensaje(evento) {
        evento.preventDefault();

        if (!nombre.trim() || !mensaje.trim()) {
            setResultado("Completa tu nombre y el mensaje.");
            return;
        }

        setResultado(
            "Mensaje preparado: " + nombre.trim() +
            " escribió: " + mensaje.trim()
        );
    }

    return (
        <section id="contacto" className="seccion fondo-blanco">
            <div className="container">
                <h2 className="titulo-seccion">Contacto</h2>

                <p>
                    Puedes encontrarme en{" "}
                    <a
                        href="https://github.com/lucas-parra29"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        github.com/lucas-parra29
                    </a>.
                </p>

                <form onSubmit={prepararMensaje}>
                    <div className="mb-3">
                        <label htmlFor="nombre" className="form-label">
                            Tu nombre
                        </label>

                        <input
                            id="nombre"
                            className="form-control"
                            value={nombre}
                            onChange={(evento) =>
                                setNombre(evento.target.value)
                            }
                            maxLength="80"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="mensaje" className="form-label">
                            Mensaje
                        </label>

                        <textarea
                            id="mensaje"
                            className="form-control"
                            rows="4"
                            value={mensaje}
                            onChange={(evento) =>
                                setMensaje(evento.target.value)
                            }
                            maxLength="1500"
                        />
                    </div>

                    <p className="text-secondary small">
                        Formulario de demostración: muestra el mensaje
                        en pantalla y no realiza envíos.
                    </p>

                    <button className="btn btn-primary" type="submit">
                        Preparar mensaje
                    </button>

                    <p className="mt-3" role="status">
                        {resultado}
                    </p>
                </form>
            </div>
        </section>
    );
}