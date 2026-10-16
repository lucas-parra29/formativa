function App() {
    const [proyectos, setProyectos] = React.useState([]);
    const [noticias, setNoticias] = React.useState([]);
    const [cargando, setCargando] = React.useState(true);
    const [error, setError] = React.useState("");

    React.useEffect(() => {
        let activo = true;

        async function cargarDatos() {
            try {
                const respuestas = await Promise.all([
                    fetch("./data/proyectos.json"),
                    fetch("./data/noticias.json")
                ]);

                if (respuestas.some((respuesta) => !respuesta.ok)) {
                    throw new Error("No se encontraron los archivos JSON.");
                }

                const datos = await Promise.all(
                    respuestas.map((respuesta) => respuesta.json())
                );

                if (!Array.isArray(datos[0]) || !Array.isArray(datos[1])) {
                    throw new Error("Revisa el formato de los archivos JSON.");
                }

                if (activo) {
                    setProyectos(datos[0]);
                    setNoticias(datos[1]);
                }
            } catch (problema) {
                if (activo) {
                    setError(problema.message);
                }
            } finally {
                if (activo) {
                    setCargando(false);
                }
            }
        }

        cargarDatos();

        return () => {
            activo = false;
        };
    }, []);

    return (
        <>
            <BarraNavegacion />

            <main id="contenido">
                <Presentacion
                    nombre="Lucas Parra"
                    carrera="Estudiante de Informática"
                    github="https://github.com/lucas-parra29"
                />

                <SobreMi />

                {cargando && (
                    <p className="container py-4" role="status">
                        Cargando proyectos y noticias…
                    </p>
                )}

                {error && (
                    <div className="container py-4">
                        <p className="alert alert-danger" role="alert">
                            {error}
                        </p>

                        <button
                            className="btn btn-primary"
                            onClick={() => window.location.reload()}
                        >
                            Reintentar
                        </button>
                    </div>
                )}

                {!cargando && !error && (
                    <>
                        <Proyectos proyectos={proyectos} />

                        <section
                            id="noticias"
                            className="seccion"
                        >
                            <div className="container">
                                <h2 className="titulo-seccion">
                                    Noticias y aprendizaje
                                </h2>

                                <div className="row g-4">
                                    <SeccionNoticias
                                        titulo="Sobre el portafolio"
                                        noticias={noticias.filter(
                                            (noticia) =>
                                                noticia.categoria === "portafolio"
                                        )}
                                    />

                                    <SeccionNoticias
                                        titulo="Notas de aprendizaje"
                                        noticias={noticias.filter(
                                            (noticia) =>
                                                noticia.categoria === "aprendizaje"
                                        )}
                                    />
                                </div>
                            </div>
                        </section>
                    </>
                )}

                <Contacto />
            </main>

            <footer>
                <p className="mb-0">
                    Lucas Parra · Portafolio personal · 2026
                </p>
            </footer>
        </>
    );
}

// Montar solamente cuando existe el contenedor de la página.
// Karma prueba los componentes en su propio contenedor.
const contenedor = document.getElementById("root");
if (contenedor) {
    const raiz = ReactDOM.createRoot(contenedor);
    raiz.render(<App />);
}