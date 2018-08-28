import React, {
    Component
} from 'react';
import Foto from './Foto';
import PubSub from 'pubsub-js';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class Timeline extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fotos: []
        };
        this.login = this.props.login;

    }

    componentWillMount() {
        PubSub.subscribe('timeline', (topico, fotos) => {
            this.setState({ fotos: fotos.fotos });
        });
        PubSub.subscribe('atualiza-liker', (topico, infoLiker) => {
            const fotoAchada = this.state.fotos.find(foto => foto.id === infoLiker.fotoId);
            fotoAchada.likeada = !fotoAchada.likeada;

            const possivelLiker = fotoAchada.likers.find(liker => liker.login)

            if (possivelLiker === undefined) {
                fotoAchada.likers.push(infoLiker.liker);
            } else {
                const novosLikers = fotoAchada.likers.filter(liker => liker.logo)
                fotoAchada.likers = novosLikers;
            }
            this.setState({ fotos: this.state.fotos });
        });

        PubSub.subscribe('novos-comentarios', (topico, infoComentario) => {
            const fotoAchada = this.state.fotos.find(foto => foto.id === infoComentario.fotoId);
            fotoAchada.comentarios.push(infoComentario.novoComentario);
            this.setState({ fotos: this.state.fotos });
        });
    }

    carregaFotos(props) {
        let url;

        if (props === undefined) {
            url = "http://localhost:8080/api/fotos?X-AUTH-TOKEN=" + localStorage.getItem('auth-token');
        } else {
            url = "http://localhost:8080/api/public/fotos/" + props;
        }

        fetch(url)
            .then(resp => resp.json())
            .then(fotos => {
                this.setState({ fotos: fotos });
            });
    }
    componentDidMount() {
        this.carregaFotos(this.login);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.login != undefined) {
            this.carregaFotos(nextProps);
        }
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
                PubSub.publish('atualiza-liker', { liker: liker, fotoId });
            });
    }

    comenta(id, comentario) {
        const requestInfo = {
            method: 'POST',
            body: JSON.stringify({ texto: comentario }),
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
                PubSub.publish('novos-comentarios', { fotoId: id, novoComentario: comentario });
            });
    }

    render() {
        return (
            <div className="fotos container">
                <ReactCSSTransitionGroup
                    transitionName="timeline"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>

                    {this.state.fotos.map(foto => <Foto comenta={this.comenta} like={this.like} key={foto.id} foto={foto} />)}
                </ReactCSSTransitionGroup>

            </div>
        );
    }
}