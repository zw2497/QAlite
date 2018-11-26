var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

axios.defaults.baseURL = 'http://6156.us-east-2.elasticbeanstalk.com';
var env = "http://qalite.s3-website.us-east-2.amazonaws.com";

// var env = "http://127.0.0.1:3000";
// axios.defaults.baseURL = 'http://127.0.0.1:5000';

axios.defaults.headers.post['Content-Type'] = 'application/json';

var Login = function (_React$Component) {
    _inherits(Login, _React$Component);

    function Login(props) {
        _classCallCheck(this, Login);

        var _this = _possibleConstructorReturn(this, (Login.__proto__ || Object.getPrototypeOf(Login)).call(this, props));

        _this.state = {
            isChecked: true,
            email: "",
            password: "",
            error: ""
        };

        _this.handleChange = _this.handleChange.bind(_this);
        _this.handleSubmit = _this.handleSubmit.bind(_this);
        return _this;
    }

    _createClass(Login, [{
        key: 'handleChange',
        value: function handleChange(event) {
            var target = event.target;
            var value = target.type === 'checkbox' ? target.checked : target.value;
            var name = target.name;
            this.setState(_defineProperty({}, name, value));
        }
    }, {
        key: 'handleSubmit',
        value: function handleSubmit(event) {
            axios.post('/login', {
                email: this.state.email,
                password: this.state.password
            }).then(function (response) {
                console.log(response);
                if (response.data.code === 1) {
                    var Credential = response.data.token;
                    console.log(Credential);
                    window.sessionStorage.setItem("Credential", Credential);
                    window.location.replace(env + "/class.html");
                } else {
                    this.setState({ error: "Incorrect username or password" });
                }
            }.bind(this)).catch(function (error) {
                console.log(error);
            });

            event.preventDefault();
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { className: 'modal-body text-center' },
                React.createElement(
                    'form',
                    { className: 'form-signin' },
                    React.createElement(
                        'h1',
                        { className: 'h3 mb-3 font-weight-normal' },
                        'Sign in'
                    ),
                    React.createElement(Errorno, { msg: this.state.error, err: this.state.error !== "", id: 'error' }),
                    React.createElement(
                        'label',
                        { htmlFor: 'loginInputEmail', className: 'sr-only' },
                        'Email address'
                    ),
                    React.createElement('input', { type: 'email', id: 'loginInputEmail', name: 'email', className: 'form-control', placeholder: 'Email address', value: this.state.email, onChange: this.handleChange, required: true,
                        autoFocus: true }),
                    React.createElement(
                        'label',
                        { htmlFor: 'loginInputPassword', className: 'sr-only' },
                        'Password'
                    ),
                    React.createElement('input', { type: 'password', id: 'loginInputPassword', name: 'password', className: 'form-control', placeholder: 'Password', value: this.state.password, onChange: this.handleChange,
                        required: true }),
                    React.createElement(
                        'div',
                        { className: 'checkbox mb-3' },
                        React.createElement(
                            'label',
                            null,
                            React.createElement('input', { type: 'checkbox', name: 'isChecked', value: this.state.isChecked, checked: this.state.isChecked, onChange: this.handleChange }),
                            ' Remember me'
                        )
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'modal-footer' },
                    React.createElement(
                        'button',
                        { className: 'btn btn-lg btn-primary', type: 'submit', onClick: this.handleSubmit },
                        'Sign in'
                    ),
                    React.createElement(
                        'button',
                        { type: 'button ', className: 'btn btn-secondary btn-lg', 'data-dismiss': 'modal' },
                        'Close'
                    )
                )
            );
        }
    }]);

    return Login;
}(React.Component);

/**
 * @return {null}
 */


function Errorno(props) {
    if (props.err === true) {
        return React.createElement(
            'div',
            { className: 'alert alert-danger', role: 'alert' },
            props.msg
        );
    } else {
        return null;
    }
}

ReactDOM.render(React.createElement(Login, null), document.getElementById('login'));

var Register = function (_React$Component2) {
    _inherits(Register, _React$Component2);

    function Register(props) {
        _classCallCheck(this, Register);

        var _this2 = _possibleConstructorReturn(this, (Register.__proto__ || Object.getPrototypeOf(Register)).call(this, props));

        _this2.state = {
            isChecked: true,
            email: "",
            password: "",
            name: "",
            error: ""
        };

        _this2.handleChange = _this2.handleChange.bind(_this2);
        _this2.handleSubmit = _this2.handleSubmit.bind(_this2);
        return _this2;
    }

    _createClass(Register, [{
        key: 'handleChange',
        value: function handleChange(event) {
            var target = event.target;
            var value = target.type === 'checkbox' ? target.checked : target.value;
            var name = target.name;
            this.setState(_defineProperty({}, name, value));
        }
    }, {
        key: 'handleSubmit',
        value: function handleSubmit(event) {
            axios.post('/register', {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password
            }).then(function (response) {
                console.log(response);
                if (response.data.code === 1) {
                    this.setState({ error: response.data.body });
                } else {
                    this.setState({ error: response.data.body });
                }
            }.bind(this)).catch(function (error) {
                console.log(error);
            });

            event.preventDefault();
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { className: 'modal-body text-center' },
                React.createElement(
                    'form',
                    { className: 'form-signin' },
                    React.createElement(
                        'h1',
                        { className: 'h3 mb-3 font-weight-normal' },
                        'Register'
                    ),
                    React.createElement(Errorno, { msg: this.state.error, err: this.state.error !== "", id: 'error' }),
                    React.createElement(
                        'label',
                        { htmlFor: 'registerInputEmail', className: 'sr-only' },
                        'User Name'
                    ),
                    React.createElement('input', { type: 'email', id: 'registerInputName', name: 'name', className: 'form-control', placeholder: 'User name', value: this.state.name, onChange: this.handleChange, required: true,
                        autoFocus: true }),
                    React.createElement(
                        'label',
                        { htmlFor: 'registerInputEmail', className: 'sr-only' },
                        'Email address'
                    ),
                    React.createElement('input', { type: 'email', id: 'registerInputEmail', name: 'email', className: 'form-control', placeholder: 'Email address', value: this.state.email, onChange: this.handleChange, required: true,
                        autoFocus: true }),
                    React.createElement(
                        'label',
                        { htmlFor: 'registerInputPassword', className: 'sr-only' },
                        'Password'
                    ),
                    React.createElement('input', { type: 'password', id: 'registerInputPassword', name: 'password', className: 'form-control', placeholder: 'Password', value: this.state.password, onChange: this.handleChange,
                        required: true }),
                    React.createElement(
                        'div',
                        { className: 'checkbox mb-3' },
                        React.createElement(
                            'label',
                            null,
                            React.createElement('input', { type: 'checkbox', name: 'isChecked', value: this.state.isChecked, checked: this.state.isChecked, onChange: this.handleChange }),
                            ' Remember me'
                        )
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'modal-footer' },
                    React.createElement(
                        'button',
                        { className: 'btn btn-lg btn-primary', type: 'submit', onClick: this.handleSubmit },
                        'Register'
                    ),
                    React.createElement(
                        'button',
                        { type: 'button ', className: 'btn btn-secondary btn-lg', 'data-dismiss': 'modal' },
                        'Close'
                    )
                )
            );
        }
    }]);

    return Register;
}(React.Component);

ReactDOM.render(React.createElement(Register, null), document.getElementById('register'));