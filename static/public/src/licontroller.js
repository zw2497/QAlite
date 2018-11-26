axios.defaults.baseURL = 'http://6156.us-east-2.elasticbeanstalk.com';
var env = "http://qalite.s3-website.us-east-2.amazonaws.com";

// var env = "http://127.0.0.1:3000";
// axios.defaults.baseURL = 'http://127.0.0.1:5000';

axios.defaults.headers.post['Content-Type'] = 'application/json';



class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isChecked: true,
            email: "",
            password: "",
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
        axios.post('/login', {
            email: this.state.email,
            password: this.state.password
        })
            .then(function (response) {
                console.log(response);
                if (response.data.code === 1) {
                    let Credential = response.data.token;
                    console.log(Credential)
                    window.sessionStorage.setItem("Credential", Credential);
                    window.location.replace(env + "/class.html");
                } else{
                    this.setState({error: "Incorrect username or password"});
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
                    <h1 className="h3 mb-3 font-weight-normal">Sign in</h1>

                    {/*error message*/}
                    <Errorno msg = {this.state.error} err = {this.state.error !== ""} id = "error"/>

                    <label htmlFor="loginInputEmail" className ="sr-only">Email address</label>
                    <input type="email" id="loginInputEmail" name = "email" className = "form-control" placeholder="Email address" value={this.state.email} onChange={this.handleChange} required
                           autoFocus />
                        <label htmlFor="loginInputPassword" className="sr-only">Password</label>
                        <input type="password" id="loginInputPassword" name = "password" className="form-control" placeholder="Password" value={this.state.password} onChange={this.handleChange}
                               required />
                    <div className="checkbox mb-3">
                        <label>
                            <input type="checkbox" name = "isChecked" value={this.state.isChecked} checked={this.state.isChecked} onChange={this.handleChange} /> Remember me
                        </label>
                    </div>
                </form>

                <div className="modal-footer">
                    <button className="btn btn-lg btn-primary" type="submit" onClick={this.handleSubmit} >Sign in</button>
                    <button type="button " className="btn btn-secondary btn-lg" data-dismiss="modal">Close</button>
                </div>

            </div>


        );
    }
}

/**
 * @return {null}
 */
function Errorno(props){
    if (props.err === true){
        return <div className="alert alert-danger" role="alert">
                {props.msg}
                </div>;
    }else {
        return null
    }
}



ReactDOM.render(
    <Login />,
    document.getElementById('login')
);


class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isChecked: true,
            email: "",
            password: "",
            name:"",
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
        axios.post('/register', {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password
        })
            .then(function (response) {
                console.log(response);
                if (response.data.code === 1) {
                    this.setState({error: response.data.body});
                } else{
                    this.setState({error: response.data.body});
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
                    <h1 className="h3 mb-3 font-weight-normal">Register</h1>
                    {/*error message*/}
                    <Errorno msg = {this.state.error} err = {this.state.error !== ""} id = "error"/>

                    <label htmlFor="registerInputEmail" className ="sr-only">User Name</label>
                    <input type="email" id="registerInputName" name = "name" className = "form-control" placeholder="User name" value={this.state.name} onChange={this.handleChange} required
                           autoFocus />
                    <label htmlFor="registerInputEmail" className ="sr-only">Email address</label>
                    <input type="email" id="registerInputEmail" name = "email" className = "form-control" placeholder="Email address" value={this.state.email} onChange={this.handleChange} required
                           autoFocus />
                    <label htmlFor="registerInputPassword" className="sr-only">Password</label>
                    <input type="password" id="registerInputPassword" name = "password" className="form-control" placeholder="Password" value={this.state.password} onChange={this.handleChange}
                           required />
                    <div className="checkbox mb-3">
                        <label>
                            <input type="checkbox" name = "isChecked" value={this.state.isChecked} checked={this.state.isChecked} onChange={this.handleChange} /> Remember me
                        </label>
                    </div>
                </form>

                <div className="modal-footer">
                    <button className="btn btn-lg btn-primary" type="submit" onClick={this.handleSubmit} >Register</button>
                    <button type="button " className="btn btn-secondary btn-lg" data-dismiss="modal">Close</button>
                </div>

            </div>

        );
    }
}

ReactDOM.render(
    <Register />,
    document.getElementById('register')
);