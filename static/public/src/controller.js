axios.defaults.baseURL = 'http://127.0.0.1:5000';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/json';

class Newpost extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <button className="btn btn-primary btn-block ">New Post</button>
    }
}


class Classlist extends React.Component{
    constructor(props) {
        super(props);
        this.handleclass = this.handleclass.bind(this);
    }

    handleclass () {
        this.props.onclasschange(this.props.oid,this.props.oname)
    }
    render() {
        return  <a className="dropdown-item text-truncate" href="#" onClick={this.handleclass}>{this.props.oname}</a>
    }


}


class Class extends React.Component {
    constructor(props) {
        super(props);
        this.state= {classinfo:[], choicename:"Loading...", choiceid:-1}
        let claim = window.sessionStorage.getItem("Authorization");
        if (claim) {
            // axios.defaults.headers.common['Authorization'] = claim;
            console.log(claim)
        } else {
            window.location.replace("http://127.0.0.1:3000");
            console.log("redirect")
        }

        axios.get('/class', {
            headers: {'Authorization': claim, 'Content-Type': 'application/json'}
        })
        .then(function (response) {
            console.log(response);
            if (response.data.code === 1) {
                console.log(response);
                this.setState({classinfo: response.data.classinfo,
                    choicename:response.data.classinfo['0'].o_name,
                    choiceid: response.data.classinfo['0'].o_id})
            } else{
                this.setState({choicename: "N/A", choiceid:-1})
            }
        }.bind(this))
        .catch(function (error) {
            console.log("error");
        });

        this.handleclasschange= this.handleclasschange.bind(this)

    }

    handleclasschange(key,oname) {
        this.setState({choicename : oname, choiceid : key})
    }


    render() {
        const listItems = this.state.classinfo.map((classi) =>
            <Classlist key={classi.o_id} oid = {classi.o_id}
                      oname={classi.o_name} onclasschange = {this.handleclasschange}/>

        );

        return<div className="dropright">
                <button className="btn btn-secondary dropdown-toggle btn-block text-truncate" type="button" id="dropdownMenuButton"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {this.state.choicename}
                </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    {listItems}
                </div>
            </div>
    }
}


class Logout extends React.Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout(event) {
        window.sessionStorage.removeItem('Authorization');
        window.location.reload();
    }

    render() {
        return <a className="nav-link" href="#" onClick={this.handleLogout}>Log Out</a>
    }
}



class Question extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div> hello world</div>
        );
    }

}


ReactDOM.render(<Newpost />, document.getElementById('newpost'));
ReactDOM.render(<Class />, document.getElementById('class'));
ReactDOM.render(<Logout />, document.getElementById('logout'));
ReactDOM.render(
    <Question />,
    document.getElementById('question')
);
