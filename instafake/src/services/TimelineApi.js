import {
    listagem,
    comenta,
    like,
    alert
} from '../actions/actionCreator';
export default class TimelineApi {

    static like(fotoId) {
        return dispatch => {
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
                    dispatch(like(fotoId, liker));
                    return liker;
                });
        }
    }

    static comenta(id, comentario) {
        return dispatch => {
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
                    dispatch(comenta(id, comentario));
                });
        }

    }

    static lista(url) {
        return (dispatch => {
            fetch(url)
                .then(resp => resp.json())
                .then(fotos => {
                    dispatch(listagem(fotos));
                    return fotos;
                });
        });
    }

    static pesquisa(input) {
        return dispatch => {
            fetch(`http://localhost:8080/api/public/fotos/${input}`)
            .then(response => response.json())
            .then(fotos => {
                if(fotos.length === 0) {
                    dispatch(alert('usuario não encontrado'));
                } else {
                    dispatch(alert('usuario encontrado'));
                }

                dispatch(listagem(fotos));
                return fotos;
            });
        }
     

    }
}