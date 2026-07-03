import { sileo } from "sileo";

export function exito(titulo, descripcion = "") {
    sileo.success({
        title: titulo,
        description: descripcion
    });
}

export function error(titulo, descripcion = "") {
    sileo.error({
        title: titulo,
        description: descripcion
    });
}

export function advertencia(titulo, descripcion = "") {
    sileo.warning({
        title: titulo,
        description: descripcion
    });
}

export function info(titulo, descripcion = "") {
    sileo.info({
        title: titulo,
        description: descripcion
    });
}

export function accion(titulo, descripcion, textoBoton, callback) {
    sileo.action({
        title: titulo,
        description: descripcion,
        button: {
            title: textoBoton,
            onClick: callback
        }
    });
}

export function promesa(promesa, cargando, exitoTitulo, errorTitulo) {
    return sileo.promise(promesa, {
        loading: {
            title: cargando
        },
        success: {
            title: exitoTitulo
        },
        error: {
            title: errorTitulo
        }
    });
}