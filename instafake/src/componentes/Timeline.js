import React, {
    Component
} from 'react';
import Foto from './Foto';

export default class Timeline extends Component {

    constructor() {
        super();
        this.state = {
            fotos: []
        };
    }
    carregaFotos(props) {
        let url;

        if (props.login === undefined) {
            url = "http://localhost:8080/api/fotos?X-AUTH-TOKEN=" + localStorage.getItem('auth-token');
        } else {
            url = "http://localhost:8080/api/public/fotos/"+props.login;
        }

        fetch(url)
            .then(resp => resp.json())
            .then(fotos => {
                this.setState({ fotos: fotos });
            });
    }
    componentDidMount() {
        this.carregaFotos(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.login != undefined) {
            this.carregaFotos(nextProps);
        }
    }

    render() {
        return (
            <div className="fotos container">
                {this.state.fotos.map(foto => <Foto key={foto.id} foto={foto} />)}
            </div>
        );
    }
}