axios.defaults.baseURL = 'http://127.0.0.1:5000';
axios.defaults.headers.post['Content-Type'] = 'application/json';

class Newpost extends React.Component {
    constructor(props) {
        super(props);
        this.handlenewpost = this.handlenewpost.bind(this)
    }

    handlenewpost (oid) {

    }

    render() {
        return <button className="btn btn-primary btn-block" data-toggle="modal" data-target="#postModal">New Post</button>
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
            <a href="#" className="list-group-item list-group-item-action flex-column align-items-start">
                <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1 text-truncate">Practice problems for Functional Dependencies</h6>
                </div>
                <p className="mb-1" style="text-overflow: ellipsis; overflow:hidden; max-height: 60px">We have created a
                    webpage with 100 randomly generated functional dependency problems for you to practice with. The
                    page is linked from the class website. It is here:

                    https://w4111.github.io/fd.html

                    Have fun playing with them!
                    #pin</p>
                <small className="badge badge-primary">Note</small>
            </a>
        );
    }

}

class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isNote: false,
            isPrivate: false,
            title: "",
            content: "",
            error:""
        };


        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target =  event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value,
        });
    }

    handleSubmit(event) {
        let claim = window.sessionStorage.getItem("Authorization");
        if (!claim) {
            window.location.replace("http://127.0.0.1:3000");
            console.log("redirect")
        }


        axios.post('/newpost',{
            title: this.state.title,
            content: this.state.content,
            q_type: this.state.isNote? '0' : '1',
            p_type: this.state.isPrivate? '0' : '1',
            o_id: '1'
        },{headers: {'Authorization': claim, 'Content-Type': 'application/json'}
        })
        .then(function (response) {
            console.log(response);
            if (response.data.code === 1) {
                this.setState({error: "Post success"});
            } else{
                this.setState({error: "Post failed"});
            }
        }.bind(this))
        .catch(function (error) {
            console.log(error);
        });

        event.preventDefault();
    }

    render() {
        return (
            <div className="modal-body text-center">
                <form className="form-signin">
                    <h1 className="h3 mb-3 font-weight-normal">New Post</h1>

                    <div className="input-group mb-3">
                        <input type="text" name = "title" value={this.state.title} onChange={this.handleChange} className="form-control" placeholder="Title" aria-label="Title" aria-describedby="basic-addon1" />
                    </div>

                    <div className="input-group">
                        <textarea className="form-control" name = "content" value={this.state.content} onChange={this.handleChange} placeholder="Content"  aria-label="With textarea" style={{'minHeight': '250px'}} ></textarea>
                    </div>

                    <div className="checkbox mb-3">
                        <label>
                            <input type="checkbox" name = "isNote" value={this.state.isNote} checked={this.state.isNote} onChange={this.handleChange} /> Is a note?
                        </label>
                        <label>
                            <input type="checkbox" name = "isPrivate" value={this.state.isPrivate} checked={this.state.isPrivate} onChange={this.handleChange} /> Is private?
                        </label>
                    </div>
                </form>

                <div className="modal-footer">
                    <button className="btn btn-lg btn-primary" type="submit" onClick={this.handleSubmit}>Post</button>
                    <button type="button " className="btn btn-secondary btn-lg" data-dismiss="modal">Close</button>
                </div>

            </div>


        );
    }
}

ReactDOM.render(<Newpost />, document.getElementById('newpost'));
ReactDOM.render(<Class />, document.getElementById('class'));
ReactDOM.render(<Logout />, document.getElementById('logout'));
ReactDOM.render(<Question />, document.getElementById('question'));
ReactDOM.render(<Post />, document.getElementById('post'));

