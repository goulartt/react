import {
    List
} from 'immutable';

function trocaFoto(lista, fotoId, callback) {

    const fotoEstadoAntigo = lista.find(foto => foto.id === fotoId);
    const novasPropriedades = callback(fotoEstadoAntigo);
    const fotoEstadoNovo = Object.assign({}, fotoEstadoAntigo, novasPropriedades);
    const indiceDaLista = lista.findIndex(foto => foto.id === fotoId);

    return lista.set(indiceDaLista, fotoEstadoNovo);
}

export function timeline(state = new List(), action) {
    if (action.type === 'LISTAGEM') {
        return new List(action.fotos);
    }

    if (action.type === 'COMENTARIO') {
        return trocaFoto(state, action.id, (fotoAntiga) => {
            const novosComentarios = fotoAntiga.comentarios.concat(action.comentario);
            return {
                comentarios: novosComentarios
            };
        });
    }

    if (action.type === 'LIKE') {
        return trocaFoto(state, action.fotoId, (fotoEstadoAntigo) => {

            const likeada = !fotoEstadoAntigo.likeada;

            const possivelLiker = fotoEstadoAntigo.likers.find(likerAtual => action.liker.login === likerAtual.login)

            let novosLikers;
            if (possivelLiker === undefined) {
                novosLikers = fotoEstadoAntigo.likers.concat(action.liker);
            } else {
                novosLikers = fotoEstadoAntigo.likers.filter(likerAtual => action.liker.login !== likerAtual.login)
            }
            return {
                likeada,
                likers: novosLikers
            };
        });
    }

    return state;
}