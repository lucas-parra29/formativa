/* global React, ReactDOM, App, BarraNavegacion, Presentacion, SobreMi,
          TarjetaProyecto, Proyectos, SeccionNoticias, Contacto */

window.IS_REACT_ACT_ENVIRONMENT = true;

const proyectoEjemplo = {
    id: 1,
    titulo: 'Huerto Hogar',
    descripcion: 'Página web creada con un amigo.',
    tecnologias: ['HTML', 'CSS'],
    imagen: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"/%3E',
    enlace: 'https://example.com/huerto'
};
const segundoProyecto = {
    ...proyectoEjemplo, id: 2, titulo: 'Portafolio personal'
};
const noticiasEjemplo = [
    {id: 1, categoria: 'portafolio', titulo: 'Mi portafolio', contenido: 'Contenido uno'},
    {id: 2, categoria: 'aprendizaje', titulo: 'Aprendiendo React', contenido: 'Contenido dos'}
];
let zona;
let raizPrueba;

beforeEach(function () {
    zona = document.createElement('div');
    document.body.appendChild(zona);
    raizPrueba = ReactDOM.createRoot(zona);
});

afterEach(async function () {
    await React.act(async function () { raizPrueba.unmount(); });
    zona.remove();
});

async function mostrar(componente) {
    await React.act(async function () { raizPrueba.render(componente); });
}
async function pulsar(elemento) {
    await React.act(async function () { elemento.click(); });
}
async function escribir(selector, valor) {
    await React.act(async function () {
        const campo = zona.querySelector(selector);
        const tipo = campo.tagName === 'TEXTAREA'
            ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
        Object.getOwnPropertyDescriptor(tipo, 'value').set.call(campo, valor);
        campo.dispatchEvent(new Event('input', {bubbles: true}));
    });
}
async function enviarFormulario() {
    await React.act(async function () {
        zona.querySelector('form').dispatchEvent(
            new Event('submit', {bubbles: true, cancelable: true})
        );
    });
}
function simularCargaCorrecta() {
    return spyOn(window, 'fetch').and.callFake(function (ruta) {
        return Promise.resolve({
            ok: true,
            json: function () {
                return Promise.resolve(ruta.includes('proyectos')
                    ? [proyectoEjemplo, segundoProyecto] : noticiasEjemplo);
            }
        });
    });
}

describe('Navegación', function () {
    it('muestra el nombre y los cuatro enlaces de navegación', async function () {
        await mostrar(<BarraNavegacion />);
        expect(zona.querySelector('.navbar-brand').textContent).toContain('Lucas Parra');
        expect(zona.querySelectorAll('.nav-link').length).toBe(4);
    });
    it('abre y cierra el menú con su botón', async function () {
        await mostrar(<BarraNavegacion />);
        const boton = zona.querySelector('button');
        expect(boton.getAttribute('aria-expanded')).toBe('false');
        await pulsar(boton);
        expect(boton.getAttribute('aria-expanded')).toBe('true');
        expect(zona.querySelector('#menuPrincipal').classList.contains('show')).toBeTrue();
        await pulsar(boton);
        expect(boton.getAttribute('aria-expanded')).toBe('false');
    });
    it('cierra el menú al elegir una sección', async function () {
        await mostrar(<BarraNavegacion />);
        await pulsar(zona.querySelector('button'));
        await pulsar(zona.querySelector('.nav-link'));
        expect(zona.querySelector('button').getAttribute('aria-expanded')).toBe('false');
    });
});

describe('Presentación y biografía', function () {
    it('utiliza las props para nombre, carrera y GitHub', async function () {
        await mostrar(<Presentacion nombre="Lucas Parra" carrera="Informática" github="https://github.com/lucas-parra29" />);
        expect(zona.querySelector('h1').textContent).toContain('Lucas Parra');
        expect(zona.querySelector('h2').textContent).toBe('Informática');
        expect(zona.querySelector('a[target]').href).toBe('https://github.com/lucas-parra29');
    });
    it('apunta a la imagen local y tiene texto alternativo', async function () {
        await mostrar(<Presentacion nombre="Lucas" carrera="Informática" github="#" />);
        expect(zona.querySelector('img').getAttribute('src')).toBe('./img/perfil.webp');
        expect(zona.querySelector('img').alt.length).toBeGreaterThan(0);
    });
    it('muestra LP si falla la imagen', async function () {
        await mostrar(<Presentacion nombre="Lucas" carrera="Informática" github="#" />);
        await React.act(async function () {
            zona.querySelector('img').dispatchEvent(new Event('error'));
        });
        expect(zona.querySelector('.avatar').textContent.trim()).toBe('LP');
        expect(zona.querySelector('img')).toBeNull();
    });
    it('muestra la biografía y las cinco tecnologías', async function () {
        await mostrar(<SobreMi />);
        expect(zona.textContent).toContain('Soy Lucas Parra');
        expect(zona.querySelectorAll('.tecnologia').length).toBe(5);
    });
});

describe('Tarjetas y buscador de proyectos', function () {
    it('muestra título, descripción, tecnologías y enlace recibidos', async function () {
        await mostrar(<TarjetaProyecto proyecto={proyectoEjemplo} />);
        expect(zona.querySelector('h3').textContent).toBe('Huerto Hogar');
        expect(zona.textContent).toContain(proyectoEjemplo.descripcion);
        expect(zona.querySelectorAll('.tecnologia').length).toBe(2);
        expect(zona.querySelector('a').href).toBe(proyectoEjemplo.enlace);
        expect(zona.querySelector('img').alt).toContain('Huerto Hogar');
    });
    it('muestra todos los proyectos antes de buscar', async function () {
        await mostrar(<Proyectos proyectos={[proyectoEjemplo, segundoProyecto]} />);
        expect(zona.querySelectorAll('.card').length).toBe(2);
    });
    it('filtra sin distinguir mayúsculas y elimina espacios extremos', async function () {
        await mostrar(<Proyectos proyectos={[proyectoEjemplo, segundoProyecto]} />);
        await escribir('input', '  HUERTO  ');
        expect(zona.querySelectorAll('.card').length).toBe(1);
        expect(zona.querySelector('.card h3').textContent).toBe('Huerto Hogar');
    });
    it('informa cuando no existen coincidencias', async function () {
        await mostrar(<Proyectos proyectos={[proyectoEjemplo]} />);
        await escribir('input', 'No existe');
        expect(zona.querySelectorAll('.card').length).toBe(0);
        expect(zona.querySelector('[role="status"]').textContent).toContain('No se encontraron');
    });
    it('recupera todos los proyectos al limpiar la búsqueda', async function () {
        await mostrar(<Proyectos proyectos={[proyectoEjemplo, segundoProyecto]} />);
        await escribir('input', 'Huerto');
        await escribir('input', '');
        expect(zona.querySelectorAll('.card').length).toBe(2);
    });
    it('maneja una lista de proyectos vacía', async function () {
        await mostrar(<Proyectos proyectos={[]} />);
        expect(zona.textContent).toContain('No se encontraron proyectos.');
    });
});

describe('Noticias sin fechas', function () {
    it('muestra el título de sección y las noticias sin necesitar fecha', async function () {
        await mostrar(<SeccionNoticias titulo="Aprendizaje" noticias={noticiasEjemplo} />);
        expect(zona.querySelector('h3').textContent).toBe('Aprendizaje');
        expect(zona.querySelectorAll('article').length).toBe(2);
        expect(zona.textContent).toContain('Contenido uno');
        expect(zona.querySelector('time')).toBeNull();
    });
    it('acepta una sección sin noticias', async function () {
        await mostrar(<SeccionNoticias titulo="Vacía" noticias={[]} />);
        expect(zona.querySelector('h3').textContent).toBe('Vacía');
        expect(zona.querySelectorAll('article').length).toBe(0);
    });
});

describe('Formulario', function () {
    it('incluye etiquetas asociadas a los campos', async function () {
        await mostrar(<Contacto />);
        expect(zona.querySelector('label[for="nombre"]')).not.toBeNull();
        expect(zona.querySelector('label[for="mensaje"]')).not.toBeNull();
    });
    it('rechaza ambos campos vacíos', async function () {
        await mostrar(<Contacto />);
        await enviarFormulario();
        expect(zona.querySelector('[role="status"]').textContent).toContain('Completa tu nombre');
    });
    it('rechaza nombre compuesto solamente de espacios', async function () {
        await mostrar(<Contacto />);
        await escribir('input', '   ');
        await escribir('textarea', 'Hola');
        await enviarFormulario();
        expect(zona.querySelector('[role="status"]').textContent).toContain('Completa');
    });
    it('rechaza mensaje vacío aunque exista nombre', async function () {
        await mostrar(<Contacto />);
        await escribir('input', 'Lucas');
        await enviarFormulario();
        expect(zona.querySelector('[role="status"]').textContent).toContain('Completa');
    });
    it('prepara el mensaje y elimina espacios exteriores', async function () {
        await mostrar(<Contacto />);
        await escribir('input', '  Ana  ');
        await escribir('textarea', '  Hola Lucas  ');
        await enviarFormulario();
        expect(zona.querySelector('[role="status"]').textContent.trim()).toBe('Mensaje preparado: Ana escribió: Hola Lucas');
    });
    it('no interpreta el mensaje como HTML ni realiza envíos', async function () {
        const solicitud = spyOn(window, 'fetch');
        await mostrar(<Contacto />);
        await escribir('input', 'Ana');
        await escribir('textarea', '<strong>Hola</strong>');
        await enviarFormulario();
        expect(zona.querySelector('[role="status"] strong')).toBeNull();
        expect(zona.querySelector('[role="status"]').textContent).toContain('<strong>Hola</strong>');
        expect(solicitud).not.toHaveBeenCalled();
    });
});

describe('Aplicación y carga JSON con mocks', function () {
    it('muestra un indicador mientras los datos están pendientes', async function () {
        spyOn(window, 'fetch').and.returnValue(new Promise(function () {}));
        await mostrar(<App />);
        expect(zona.textContent).toContain('Cargando proyectos y noticias');
    });
    it('solicita los dos JSON y muestra los datos', async function () {
        const solicitud = simularCargaCorrecta();
        await mostrar(<App />);
        expect(solicitud).toHaveBeenCalledWith('./data/proyectos.json');
        expect(solicitud).toHaveBeenCalledWith('./data/noticias.json');
        expect(zona.querySelectorAll('.card').length).toBe(2);
        expect(zona.querySelectorAll('.noticia').length).toBe(2);
        expect(zona.textContent).not.toContain('Cargando proyectos y noticias');
    });
    it('separa las noticias por su categoría', async function () {
        simularCargaCorrecta();
        await mostrar(<App />);
        const secciones = zona.querySelectorAll('#noticias .row > section');
        expect(secciones[0].textContent).toContain('Mi portafolio');
        expect(secciones[0].textContent).not.toContain('Aprendiendo React');
        expect(secciones[1].textContent).toContain('Aprendiendo React');
    });
    it('informa una respuesta HTTP fallida', async function () {
        spyOn(window, 'fetch').and.returnValue(Promise.resolve({ok: false}));
        await mostrar(<App />);
        expect(zona.querySelector('[role="alert"]').textContent).toContain('No se encontraron los archivos JSON.');
    });
    it('informa un error de red', async function () {
        spyOn(window, 'fetch').and.returnValue(Promise.reject(new Error('Sin conexión')));
        await mostrar(<App />);
        expect(zona.querySelector('[role="alert"]').textContent).toContain('Sin conexión');
    });
    it('informa JSON mal escrito', async function () {
        spyOn(window, 'fetch').and.returnValue(Promise.resolve({
            ok: true, json: function () { return Promise.reject(new Error('JSON inválido')); }
        }));
        await mostrar(<App />);
        expect(zona.querySelector('[role="alert"]').textContent).toContain('JSON inválido');
    });
    it('rechaza datos JSON que no sean arreglos', async function () {
        spyOn(window, 'fetch').and.returnValue(Promise.resolve({
            ok: true, json: function () { return Promise.resolve({incorrecto: true}); }
        }));
        await mostrar(<App />);
        expect(zona.querySelector('[role="alert"]').textContent).toContain('Revisa el formato');
    });
    it('ignora una respuesta correcta que llega después del desmontaje', async function () {
        let resolver;
        spyOn(window, 'fetch').and.returnValue(new Promise(function (resolve) { resolver = resolve; }));
        await mostrar(<App />);
        await React.act(async function () { raizPrueba.render(<p>Otra pantalla</p>); });
        await React.act(async function () {
            resolver({ok: true, json: function () { return Promise.resolve([]); }});
        });
        expect(zona.textContent).toBe('Otra pantalla');
    });
    it('ignora un error de red después del desmontaje', async function () {
        let rechazar;
        spyOn(window, 'fetch').and.returnValue(new Promise(function (resolve, reject) { rechazar = reject; }));
        await mostrar(<App />);
        await React.act(async function () { raizPrueba.render(<p>Otra pantalla</p>); });
        await React.act(async function () { rechazar(new Error('Tardío')); });
        expect(zona.textContent).toBe('Otra pantalla');
    });
});
