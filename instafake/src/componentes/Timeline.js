import React, {
    Component
} from 'react';
import Foto from './Foto';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import TimelineService from '../services/TimelineService';

export default class Timeline extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fotos: []
        };
        this.login = this.props.login;

        this.timelineService = new TimelineService([]);

    }

    componentWillMount() {
        this.timelineService.subscribe(fotos => {
            this.setState({ fotos: fotos });
        });
    }

    carregaFotos(props) {
        let url;

        if (props === undefined) {
            url = "http://localhost:8080/api/fotos?X-AUTH-TOKEN=" + localStorage.getItem('auth-token');
        } else {
            url = "http://localhost:8080/api/public/fotos/" + props;
        }

        this.timelineService.lista(url);
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
        this.timelineService.like(fotoId);
    }

    comenta(id, comentario) {
      this.timelineService.comenta(id, comentario);
    }

    render() {
        return (
            <div className="fotos container">
                <ReactCSSTransitionGroup
                    transitionName="timeline"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>

                    {this.state.fotos.map(foto => <Foto comenta={this.comenta.bind(this)} like={this.like.bind(this)} key={foto.id} foto={foto} />)}
                </ReactCSSTransitionGroup>

            </div>
        );
    }
}