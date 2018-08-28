import PubSub from 'pubsub-js';

export default class TimelineService {

    constructor(fotos) {
        this.fotos = fotos;
    }

    like(fotoId) {
        fetch('http://localhost:8080/api/fotos/' + fotoId + '/like?X-AUTH-TOKEN=' + localStorage.getItem('auth-token'), {
                method: 'POST'
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Não foi possível realizar o like da foto');
                }
            }).then(liker => {
                const fotoAchada = this.fotos.find(foto => foto.id === fotoId);
                fotoAchada.likeada = !fotoAchada.likeada;

                const possivelLiker = fotoAchada.likers.find(likerAtual => liker.login === likerAtual.login)

                if (possivelLiker === undefined) {
                    fotoAchada.likers.push(liker);
                } else {
                    const novosLikers = fotoAchada.likers.filter(likerAtual => likerAtual.login !== liker.login)
                    fotoAchada.likers = novosLikers;
                }
                PubSub.publish('timeline', this.fotos);
            });
    }

    comenta(id, comentario) {
        const requestInfo = {
            method: 'POST',
            body: JSON.stringify({
                texto: comentario
            }),
            headers: new Headers({
                'Content-type': 'application/json'
            })
        };

        fetch(`http://localhost:8080/api/fotos/${id}/comment?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, requestInfo)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Não foi possível comentar");
                }
            })
            .then(comentario => {
                const fotoAchada = this.fotos.find(foto => foto.id === id);
                fotoAchada.comentarios.push(comentario);
                PubSub.publish('timeline', this.fotos);
            });
    }

    lista(url) {
        fetch(url)
            .then(resp => resp.json())
            .then(fotos => {
                PubSub.publish('timeline', fotos);
                this.fotos = fotos;
            });
    }

    subscribe(callback) {
        PubSub.subscribe('timeline', (topico, fotos) => {
            callback(fotos);
        });
    }

}