import React, {
    Component
} from 'react';
import Foto from './Foto';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import TimelineApi from '../services/TimelineApi';
import {connect} from 'react-redux';
 
export class Timeline extends Component {

    constructor(props) {
        super(props);
        this.login = this.props.login;

    }

    carregaFotos() {
        let url;

        if (this.login === undefined) {
            url = "http://localhost:8080/api/fotos?X-AUTH-TOKEN=" + localStorage.getItem('auth-token');
        } else {
            url = "http://localhost:8080/api/public/fotos/" + this.login;
        }
        this.props.lista(url);
    }

    componentDidMount() {
        this.carregaFotos();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.login !== this.login) {
            this.login = nextProps.login;
            this.carregaFotos();
        }
    }
 
    render() {
        return (
            <div className="fotos container">
                <ReactCSSTransitionGroup
                    transitionName="timeline"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>

                    {this.props.fotos.map(foto => <Foto comenta={this.props.comenta} like={this.props.like} key={foto.id} foto={foto} />)}
                </ReactCSSTransitionGroup>

            </div>
        );
    }
}
const mapStateToProps = state => {
    return { fotos: state.timeline }
};

const mapDispatchToProps = dispatch => {
    return {
        like: fotoId => {
            dispatch(TimelineApi.like(fotoId));
        },
        comenta: (id, comentario) => {
            dispatch(TimelineApi.comenta(id, comentario));
        },
        lista: (url) => {
            dispatch(TimelineApi.lista(url));
        }
    }
};

const TimelineContainer = connect(mapStateToProps, mapDispatchToProps)(Timeline);

export default TimelineContainer 