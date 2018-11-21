var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

axios.defaults.baseURL = 'http://127.0.0.1:5000';
axios.defaults.headers.post['Content-Type'] = 'application/json';

var Newpost = function (_React$Component) {
    _inherits(Newpost, _React$Component);

    function Newpost(props) {
        _classCallCheck(this, Newpost);

        var _this = _possibleConstructorReturn(this, (Newpost.__proto__ || Object.getPrototypeOf(Newpost)).call(this, props));

        _this.handlenewpost = _this.handlenewpost.bind(_this);
        return _this;
    }

    _createClass(Newpost, [{
        key: 'handlenewpost',
        value: function handlenewpost(oid) {}
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'button',
                { className: 'btn btn-primary btn-block', 'data-toggle': 'modal', 'data-target': '#postModal' },
                'New Post'
            );
        }
    }]);

    return Newpost;
}(React.Component);

var Classlist = function (_React$Component2) {
    _inherits(Classlist, _React$Component2);

    function Classlist(props) {
        _classCallCheck(this, Classlist);

        var _this2 = _possibleConstructorReturn(this, (Classlist.__proto__ || Object.getPrototypeOf(Classlist)).call(this, props));

        _this2.handleclass = _this2.handleclass.bind(_this2);
        return _this2;
    }

    _createClass(Classlist, [{
        key: 'handleclass',
        value: function handleclass() {
            this.props.onclasschange(this.props.oid, this.props.oname);
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'a',
                { className: 'dropdown-item text-truncate', href: '#', onClick: this.handleclass },
                this.props.oname
            );
        }
    }]);

    return Classlist;
}(React.Component);

var Class = function (_React$Component3) {
    _inherits(Class, _React$Component3);

    function Class(props) {
        _classCallCheck(this, Class);

        var _this3 = _possibleConstructorReturn(this, (Class.__proto__ || Object.getPrototypeOf(Class)).call(this, props));

        _this3.state = { classinfo: [], choicename: "Loading...", choiceid: -1 };
        var claim = window.sessionStorage.getItem("Authorization");
        if (claim) {
            // axios.defaults.headers.common['Authorization'] = claim;
            console.log(claim);
        } else {
            window.location.replace("http://127.0.0.1:3000");
            console.log("redirect");
        }

        axios.get('/class', {
            headers: { 'Authorization': claim, 'Content-Type': 'application/json' }
        }).then(function (response) {
            console.log(response);
            if (response.data.code === 1) {
                console.log(response);
                this.setState({ classinfo: response.data.classinfo,
                    choicename: response.data.classinfo['0'].o_name,
                    choiceid: response.data.classinfo['0'].o_id });
            } else {
                this.setState({ choicename: "N/A", choiceid: -1 });
            }
        }.bind(_this3)).catch(function (error) {
            console.log("error");
        });

        _this3.handleclasschange = _this3.handleclasschange.bind(_this3);

        return _this3;
    }

    _createClass(Class, [{
        key: 'handleclasschange',
        value: function handleclasschange(key, oname) {
            this.setState({ choicename: oname, choiceid: key });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this4 = this;

            var listItems = this.state.classinfo.map(function (classi) {
                return React.createElement(Classlist, { key: classi.o_id, oid: classi.o_id,
                    oname: classi.o_name, onclasschange: _this4.handleclasschange });
            });

            return React.createElement(
                'div',
                { className: 'dropright' },
                React.createElement(
                    'button',
                    { className: 'btn btn-secondary dropdown-toggle btn-block text-truncate', type: 'button', id: 'dropdownMenuButton',
                        'data-toggle': 'dropdown', 'aria-haspopup': 'true', 'aria-expanded': 'false' },
                    this.state.choicename
                ),
                React.createElement(
                    'div',
                    { className: 'dropdown-menu', 'aria-labelledby': 'dropdownMenuButton' },
                    listItems
                )
            );
        }
    }]);

    return Class;
}(React.Component);

var Logout = function (_React$Component4) {
    _inherits(Logout, _React$Component4);

    function Logout(props) {
        _classCallCheck(this, Logout);

        var _this5 = _possibleConstructorReturn(this, (Logout.__proto__ || Object.getPrototypeOf(Logout)).call(this, props));

        _this5.handleLogout = _this5.handleLogout.bind(_this5);
        return _this5;
    }

    _createClass(Logout, [{
        key: 'handleLogout',
        value: function handleLogout(event) {
            window.sessionStorage.removeItem('Authorization');
            window.location.reload();
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'a',
                { className: 'nav-link', href: '#', onClick: this.handleLogout },
                'Log Out'
            );
        }
    }]);

    return Logout;
}(React.Component);

var Question = function (_React$Component5) {
    _inherits(Question, _React$Component5);

    function Question(props) {
        _classCallCheck(this, Question);

        return _possibleConstructorReturn(this, (Question.__proto__ || Object.getPrototypeOf(Question)).call(this, props));
    }

    _createClass(Question, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                null,
                ' hello world'
            );
        }
    }]);

    return Question;
}(React.Component);

var Post = function (_React$Component6) {
    _inherits(Post, _React$Component6);

    function Post(props) {
        _classCallCheck(this, Post);

        var _this7 = _possibleConstructorReturn(this, (Post.__proto__ || Object.getPrototypeOf(Post)).call(this, props));

        _this7.state = {
            isNote: false,
            isPrivate: false,
            title: "",
            content: "",
            error: ""
        };

        _this7.handleChange = _this7.handleChange.bind(_this7);
        _this7.handleSubmit = _this7.handleSubmit.bind(_this7);
        return _this7;
    }

    _createClass(Post, [{
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
            var claim = window.sessionStorage.getItem("Authorization");
            if (!claim) {
                window.location.replace("http://127.0.0.1:3000");
                console.log("redirect");
            }

            axios.post('/newpost', {
                title: this.state.title,
                content: this.state.content,
                q_type: this.state.isNote ? '0' : '1',
                p_type: this.state.isPrivate ? '0' : '1',
                o_id: '1'
            }, { headers: { 'Authorization': claim, 'Content-Type': 'application/json' }
            }).then(function (response) {
                console.log(response);
                if (response.data.code === 1) {
                    this.setState({ error: "Post success" });
                } else {
                    this.setState({ error: "Post failed" });
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
                        'New Post'
                    ),
                    React.createElement(
                        'div',
                        { className: 'input-group mb-3' },
                        React.createElement('input', { type: 'text', name: 'title', value: this.state.title, onChange: this.handleChange, className: 'form-control', placeholder: 'Title', 'aria-label': 'Title', 'aria-describedby': 'basic-addon1' })
                    ),
                    React.createElement(
                        'div',
                        { className: 'input-group' },
                        React.createElement('textarea', { className: 'form-control', name: 'content', value: this.state.content, onChange: this.handleChange, placeholder: 'Content', 'aria-label': 'With textarea', style: { 'minHeight': '250px' } })
                    ),
                    React.createElement(
                        'div',
                        { className: 'checkbox mb-3' },
                        React.createElement(
                            'label',
                            null,
                            React.createElement('input', { type: 'checkbox', name: 'isNote', value: this.state.isNote, checked: this.state.isNote, onChange: this.handleChange }),
                            ' Is a note?'
                        ),
                        React.createElement(
                            'label',
                            null,
                            React.createElement('input', { type: 'checkbox', name: 'isPrivate', value: this.state.isPrivate, checked: this.state.isPrivate, onChange: this.handleChange }),
                            ' Is private?'
                        )
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'modal-footer' },
                    React.createElement(
                        'button',
                        { className: 'btn btn-lg btn-primary', type: 'submit', onClick: this.handleSubmit },
                        'Post'
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

    return Post;
}(React.Component);

ReactDOM.render(React.createElement(Newpost, null), document.getElementById('newpost'));
ReactDOM.render(React.createElement(Class, null), document.getElementById('class'));
ReactDOM.render(React.createElement(Logout, null), document.getElementById('logout'));
ReactDOM.render(React.createElement(Question, null), document.getElementById('question'));
ReactDOM.render(React.createElement(Post, null), document.getElementById('post'));