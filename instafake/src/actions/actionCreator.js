
export function listagem(fotos) {
    return {type: 'LISTAGEM', fotos};
}

export function comenta(id, comentario) {
    return {type: 'COMENTARIO', id, comentario};
}

export function like(fotoId,liker){
    return {type: 'LIKE',fotoId,liker};
}

export function alert(msg){
    return {type: 'ALERT',msg};
}
