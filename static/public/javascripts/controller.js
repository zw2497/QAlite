var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

axios.defaults.baseURL = 'http://6156.us-east-2.elasticbeanstalk.com';
axios.defaults.headers.post['Content-Type'] = 'application/json';
var env = window.location.protocol + "//" + window.location.host;

// axios.defaults.baseURL = 'http://localhost:5000';


var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this.state = {
            u_name: "Loading",
            u_status: "Loading",
            currentquestionkey: "0",
            currentclasskey: "0",
            questions: { "0": { "title": "loading...", "content": "Loading..." } },
            classes: [{ "o_id": "-1", "o_name": "Loading..." }],
            currentoid: "-1",
            currentqid: "-1",
            comments: [{
                "cs_content": "Loading...",
                "cs_id": 0,
                "ct_content": "Loading...",
                "ct_id": 0,
                "us_name": "Loading...",
                "ut_name": "Loading..."
            }]

        };

        // check Credential
        var claim = window.localStorage.getItem("Credential");
        if (!claim) {
            window.location.replace(env);
            console.log("redirect");
        }

        axios.get('/user', {
            headers: { 'Credential': window.localStorage.getItem("Credential"), 'Content-Type': 'application/json' }
        }).then(function (response) {
            if (response.data.code === 1) {
                console.log(response);
                this.setState({ u_name: response.data.name, u_status: response.data.status });
            }
        }.bind(_this));

        // query question and class
        axios.get('/class', {
            headers: { 'Credential': window.localStorage.getItem("Credential"), 'Content-Type': 'application/json' }
        }).then(function (response) {
            console.log(response);
            if (response.data.code === 1 && response.data.classinfo[0] !== undefined) {
                console.log(response);
                this.setState({ classes: response.data.classinfo });
                this.setState({ currentoid: this.state.classes[this.state.currentclasskey].o_id });

                axios.post('/question', {
                    o_id: this.state.classes[this.state.currentclasskey].o_id
                }, { headers: { 'Credential': window.localStorage.getItem("Credential"), 'Content-Type': 'application/json' }
                }).then(function (response) {
                    console.log(response);
                    if (response.data.code === 1 && response.data.question[this.state.currentquestionkey] !== undefined) {
                        this.setState({ questions: response.data.question });
                        this.setState({ currentqid: this.state.questions[this.state.currentquestionkey].id });

                        axios.post('/comment', {
                            o_id: this.state.currentoid,
                            q_id: this.state.currentqid
                        }, { headers: { 'Credential': window.localStorage.getItem("Credential"), 'Content-Type': 'application/json' }
                        }).then(function (response) {
                            console.log(response);
                            if (response.data.code === 1) {
                                this.setState({ comments: response.data.comments });
                            } else {
                                this.setState({ error: "Post failed" });
                            }
                        }.bind(this)).catch(function (error) {
                            console.log(error);
                        });
                    } else {
                        this.setState({ questions: { "0": { "title": "Please post a question", "content": "" } }, comments: [{
                                "cs_content": "Start a new followup discussion",
                                "cs_id": 0,
                                "ct_content": "",
                                "ct_id": 0,
                                "us_name": "",
                                "ut_name": ""
                            }] });
                    }
                }.bind(this)).catch(function (error) {
                    console.log(error);
                });
            } else {
                this.setState({ classes: [{ "o_id": "-1", "o_name": "No Class" }], questions: { "0": { "title": "Please add or create a course", "content": "No data" } }, comments: [{
                        "cs_content": "No data",
                        "cs_id": 0,
                        "ct_content": "No data",
                        "ct_id": 0,
                        "us_name": "No data",
                        "ut_name": "No data"
                    }] });
            }
        }.bind(_this)).catch(function (error) {
            console.log(error);
        });

        _this.handlecurrentclass = _this.handlecurrentclass.bind(_this);
        _this.handlecurrentquestion = _this.handlecurrentquestion.bind(_this);
        _this.handleCreCourse = _this.handleCreCourse.bind(_this);
        _this.handleLogout = _this.handleLogout.bind(_this);
        _this.handlecurrentquestionnorefresh = _this.handlecurrentquestionnorefresh.bind(_this);
        return _this;
    }

    _createClass(App, [{
        key: 'handleLogout',
        value: function handleLogout(event) {
            window.localStorage.removeItem('Credential');
            window.location.reload();
        }
    }, {
        key: 'handlecurrentclass',
        value: function handlecurrentclass(key) {
            var _this2 = this;

            this.setState({ currentclasskey: key, currentoid: this.state.classes[key].o_id }, function () {
                axios.post('/question', {
                    o_id: _this2.state.currentoid
                }, { headers: { 'Credential': window.localStorage.getItem("Credential"), 'Content-Type': 'application/json' }
                }).then(function (response) {
                    console.log(response);
                    if (response.data.code === 1 && response.data.question[0] !== undefined) {
                        this.setState({ questions: response.data.question });
                        this.setState({ currentqid: this.state.questions[this.state.currentquestionkey].id });

                        axios.post('/comment', {
                            o_id: this.state.currentoid,
                            q_id: this.state.currentqid
                        }, { headers: { 'Credential': window.localStorage.getItem("Credential"), 'Content-Type': 'application/json' }
                        }).then(function (response) {
                            console.log(response);
                            if (response.data.code === 1) {
                                this.setState({ comments: response.data.comments });
                            } else {
                                this.setState({ error: "Post failed" });
                            }
                        }.bind(this)).catch(function (error) {
                            console.log(error);
                        });
                    } else {
                        this.setState({ currentquestionkey: "0", error: "Post failed", questions: { "0": { "title": "No Post", "content": "Please add a new post", "id": -1 } } });
                    }
                }.bind(_this2)).catch(function (error) {
                    console.log(error);
                });
            });
        }
    }, {
        key: 'handlecurrentquestion',
        value: function handlecurrentquestion(key) {
            var _this3 = this;

            this.setState({ comments: [{
                    "cs_content": "Loading...",
                    "cs_id": 0,
                    "ct_content": "Loading...",
                    "ct_id": 0,
                    "us_name": "Loading...",
                    "ut_name": "Loading..."
                }] });
            this.setState({ currentquestionkey: key, currentqid: this.state.questions[key].id }, function () {
                axios.post('/comment', {
                    o_id: _this3.state.currentoid,
                    q_id: _this3.state.currentqid
                }, { headers: { 'Credential': window.localStorage.getItem("Credential"), 'Content-Type': 'application/json' }
                }).then(function (response) {
                    console.log(response);
                    if (response.data.code === 1) {
                        this.setState({ comments: response.data.comments });
                    } else {
                        this.setState({ error: "Post failed" });
                    }
                }.bind(_this3)).catch(function (error) {
                    console.log(error);
                });
            });
        }
    }, {
        key: 'handlecurrentquestionnorefresh',
        value: function handlecurrentquestionnorefresh(key) {
            var _this4 = this;

            this.setState({ currentquestionkey: key, currentqid: this.state.questions[key].id }, function () {
                axios.post('/comment', {
                    o_id: _this4.state.currentoid,
                    q_id: _this4.state.currentqid
                }, { headers: { 'Credential': window.localStorage.getItem("Credential"), 'Content-Type': 'application/json' }
                }).then(function (response) {
                    console.log(response);
                    if (response.data.code === 1) {
                        this.setState({ comments: response.data.comments });
                    } else {
                        this.setState({ error: "Post failed" });
                    }
                }.bind(_this4)).catch(function (error) {
                    console.log(error);
                });
            });
        }
    }, {
        key: 'handleCreCourse',
        value: function handleCreCourse() {}
    }, {
        key: 'render',
        value: function render() {
            var questions = this.state.questions;
            var classes = this.state.classes;
            var currentclasskey = this.state.currentclasskey;
            var currentquestionkey = this.state.currentquestionkey;
            var currentquestion = questions[currentquestionkey];
            var currentoname = classes[currentclasskey].o_name;
            var currentoid = classes[currentclasskey].o_id;
            var currentqid = currentquestion.id;

            var title;
            var content;
            if (currentquestion !== undefined) title = currentquestion.title;else title = "No data";

            if (currentquestion !== undefined) content = currentquestion.content;else content = "No data";

            return React.createElement(
                'div',
                null,
                React.createElement(Newpostmodal, { oid: currentoid, newpost: this.handlecurrentclass, mykey: this.state.currentclasskey }),
                React.createElement(
                    'div',
                    { className: 'wrapper' },
                    React.createElement(
                        'nav',
                        { id: 'sidebar' },
                        React.createElement(
                            'div',
                            { className: 'sidebar-header' },
                            React.createElement(
                                'strong',
                                { style: { fontSize: 'xx-large' } },
                                'QAlite'
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'sidebar-header' },
                            React.createElement(Classlist, { classes: classes, name: currentoname, onclasschange: this.handlecurrentclass }),
                            React.createElement(
                                'button',
                                { className: 'btn btn-primary btn-block', 'data-toggle': 'modal', 'data-target': '#postModal' },
                                ' New Post '
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'list-group' },
                            React.createElement(Questionlist, { questions: questions, onchange: this.handlecurrentquestion })
                        )
                    ),
                    React.createElement(
                        'div',
                        { id: 'content' },
                        React.createElement(
                            'nav',
                            { className: 'navbar navbar-expand-lg navbar-light bg-light' },
                            React.createElement(
                                'div',
                                { className: 'container-fluid' },
                                React.createElement(
                                    'button',
                                    { type: 'button', id: 'sidebarCollapse', className: 'navbar-btn' },
                                    React.createElement('span', null),
                                    React.createElement('span', null),
                                    React.createElement('span', null)
                                ),
                                React.createElement(
                                    'button',
                                    { className: 'btn btn-dark d-inline-block d-lg-none ml-auto', type: 'button', 'data-toggle': 'collapse', 'data-target': '#navbarSupportedContent', 'aria-controls': 'navbarSupportedContent', 'aria-expanded': 'false', 'aria-label': 'Toggle navigation' },
                                    React.createElement('i', { className: 'fas fa-align-justify' })
                                ),
                                React.createElement(
                                    'div',
                                    { className: 'collapse navbar-collapse', id: 'navbarSupportedContent' },
                                    React.createElement(
                                        'ul',
                                        { className: 'nav navbar-nav ml-auto' },
                                        React.createElement(
                                            'li',
                                            { className: 'nav-item' },
                                            React.createElement(
                                                'div',
                                                { className: 'nav-link' },
                                                React.createElement(
                                                    'a',
                                                    { className: 'nav-link', href: env + '/profile.html' },
                                                    this.state.u_name
                                                )
                                            )
                                        ),
                                        React.createElement(
                                            'li',
                                            { className: 'nav-item' },
                                            React.createElement(
                                                'div',
                                                { className: 'nav-link' },
                                                React.createElement(Status, { status: this.state.u_status })
                                            )
                                        ),
                                        React.createElement(
                                            'li',
                                            { className: 'nav-item' },
                                            React.createElement(
                                                'div',
                                                { className: 'nav-link' },
                                                React.createElement(
                                                    'a',
                                                    { className: 'nav-link', href: '#', onClick: this.handleCreCourse, 'data-toggle': 'modal', 'data-target': '#createModal' },
                                                    'New Course'
                                                )
                                            )
                                        ),
                                        React.createElement(
                                            'li',
                                            { className: 'nav-item' },
                                            React.createElement(
                                                'div',
                                                { className: 'nav-link', id: 'logout' },
                                                React.createElement(
                                                    'a',
                                                    { className: 'nav-link', href: '#', onClick: this.handleLogout },
                                                    'Log Out'
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        ),
                        React.createElement(Questiondetail, { title: title, content: content }),
                        React.createElement('div', { className: 'line' }),
                        React.createElement(Comment, { currentoid: currentoid, currentqid: currentqid, comments: this.state.comments, currentquestionkey: this.state.currentquestionkey, refresh: this.handlecurrentquestionnorefresh })
                    )
                )
            );
        }
    }]);

    return App;
}(React.Component);

function Status(props) {
    var status = props.status;
    if (status === "False") {
        return React.createElement(
            'button',
            { type: 'button', className: 'btn btn-danger' },
            'Not Verified'
        );
    } else if (status === "True") {
        return React.createElement(
            'button',
            { type: 'button', className: 'btn btn-success' },
            'Verified'
        );
    }
    return null;
}

var Newpostmodal = function (_React$Component2) {
    _inherits(Newpostmodal, _React$Component2);

    function Newpostmodal(props) {
        _classCallCheck(this, Newpostmodal);

        var _this5 = _possibleConstructorReturn(this, (Newpostmodal.__proto__ || Object.getPrototypeOf(Newpostmodal)).call(this, props));

        _this5.state = {
            isNote: false,
            isPrivate: false,
            title: "",
            content: "",
            error: "",
            search: "",
            classlist: [],
            courseName: "",
            description: "",
            term: "2019,fall"
        };

        _this5.handleChange = _this5.handleChange.bind(_this5);
        _this5.handleSubmit = _this5.handleSubmit.bind(_this5);
        _this5.handleSearch = _this5.handleSearch.bind(_this5);
        _this5.handleSelect = _this5.handleSelect.bind(_this5);
        _this5.handleCreate = _this5.handleCreate.bind(_this5);
        return _this5;
    }

    _createClass(Newpostmodal, [{
        key: 'handleChange',
        value: function handleChange(event) {
            var target = event.target;
            var value = target.type === 'checkbox' ? target.checked : target.value;
            var name = target.name;
            this.setState(_defineProperty({}, name, value));
            console.log(this.state.term.year);
        }
    }, {
        key: 'handleSubmit',
        value: function handleSubmit(event) {
            var claim = window.localStorage.getItem("Credential");

            axios.post('/newpost', {
                title: this.state.title,
                content: this.state.content,
                q_type: this.state.isNote ? '0' : '1',
                p_type: this.state.isPrivate ? '0' : '1',
                o_id: this.props.oid
            }, { headers: { 'Credential': claim, 'Content-Type': 'application/json' }
            }).then(function (response) {
                console.log(response);
                if (response.data.code === 1) {
                    this.setState({ error: "Post success" });
                    this.props.newpost(this.props.mykey);
                } else {
                    this.setState({ error: "Post failed" });
                }
            }.bind(this)).catch(function (error) {
                console.log(error);
            });

            event.preventDefault();
        }
    }, {
        key: 'handleSearch',
        value: function handleSearch(event) {
            axios.post('/allclass', {
                search: this.state.search
            }, { headers: { 'Credential': window.localStorage.getItem("Credential"), 'Content-Type': 'application/json' }
            }).then(function (response) {
                console.log(response);
                if (response.data.code === 1) {
                    this.setState({ classlist: response.data.classinfo });
                } else {
                    this.setState({ error: "search failed" });
                }
            }.bind(this)).catch(function (error) {
                console.log(error);
            });

            event.preventDefault();
        }
    }, {
        key: 'handleadd',
        value: function handleadd(oid) {
            axios.post('/addclass', {
                o_id: oid
            }, { headers: { 'Credential': window.localStorage.getItem("Credential"), 'Content-Type': 'application/json' }
            }).then(function (response) {
                console.log(response);
                if (response.data.code === 1) {
                    this.setState({ error: "add success" });
                    window.location.replace(env + "/class.html");
                } else {
                    this.setState({ error: "search failed" });
                }
            }.bind(this)).catch(function (error) {
                console.log(error);
            });

            event.preventDefault();
        }
    }, {
        key: 'handleSelect',
        value: function handleSelect(event) {
            var name = event.target.name;
            this.setState(_defineProperty({}, name, event.target.value));
        }
    }, {
        key: 'handleCreate',
        value: function handleCreate(event) {
            var term = this.state.term.split(',');

            axios.post('/createcourse', {
                courseName: this.state.courseName,
                description: this.state.description,
                termyear: term[0],
                termsemester: term[1]
            }, { headers: { 'Credential': window.localStorage.getItem("Credential"), 'Content-Type': 'application/json' }
            }).then(function (response) {
                console.log(response);
                if (response.data.code === 1) {
                    this.setState({ error: "add success" });
                    window.location.replace(env + "/class.html");
                } else {
                    this.setState({ error: "search failed" });
                }
            }.bind(this)).catch(function (error) {
                console.log(error);
            });

            event.preventDefault();
        }
    }, {
        key: 'render',
        value: function render() {
            var _this6 = this;

            var rows = [];
            var classes = this.state.classlist;
            var i = "0";

            classes.forEach(function (classi) {
                rows.push(React.createElement(
                    'li',
                    { key: i },
                    React.createElement(
                        'div',
                        null,
                        classi.o_name,
                        React.createElement(
                            'div',
                            { style: { 'text-align': 'right' } },
                            React.createElement(
                                'button',
                                { className: "btn btn-success btn-sm", onClick: function onClick() {
                                        return _this6.handleadd(classi.id);
                                    } },
                                'ADD'
                            ),
                            React.createElement('div', { className: 'line' })
                        )
                    )
                ));
                i++;
            });

            return React.createElement(
                'div',
                null,
                React.createElement(
                    'div',
                    { className: 'modal fade', id: 'postModal', tabIndex: -1, role: 'dialog', 'aria-labelledby': 'postModalLabel', 'aria-hidden': 'true' },
                    React.createElement(
                        'div',
                        { className: 'modal-dialog', role: 'document' },
                        React.createElement(
                            'div',
                            { className: 'modal-content' },
                            React.createElement(
                                'div',
                                { className: 'modal-header' },
                                React.createElement(
                                    'h5',
                                    { className: 'modal-title', id: 'postModalLabel' },
                                    'QAlite'
                                ),
                                React.createElement(
                                    'button',
                                    { type: 'button', className: 'close', 'data-dismiss': 'modal', 'aria-label': 'Close' },
                                    React.createElement(
                                        'span',
                                        { 'aria-hidden': 'true' },
                                        '\xD7'
                                    )
                                )
                            ),
                            React.createElement(
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
                                    React.createElement(Errorno, { msg: this.state.error, err: this.state.error !== "", id: 'error' }),
                                    React.createElement(
                                        'div',
                                        { className: 'input-group mb-3' },
                                        React.createElement('input', { value: this.state.title, onChange: this.handleChange, type: 'text', name: 'title', className: 'form-control', placeholder: 'Title', 'aria-label': 'Title', 'aria-describedby': 'basic-addon1' })
                                    ),
                                    React.createElement(
                                        'div',
                                        { className: 'input-group' },
                                        React.createElement('textarea', { value: this.state.content, onChange: this.handleChange, className: 'form-control', name: 'content', placeholder: 'Content', 'aria-label': 'With textarea', style: { 'minHeight': '250px' } })
                                    ),
                                    React.createElement(
                                        'div',
                                        { className: 'checkbox mb-3' },
                                        React.createElement(
                                            'label',
                                            null,
                                            React.createElement('input', { value: this.state.isNote, checked: this.state.isNote, onChange: this.handleChange, type: 'checkbox', name: 'isNote' }),
                                            ' Is a note?'
                                        ),
                                        React.createElement(
                                            'label',
                                            null,
                                            React.createElement('input', { value: this.state.isPrivate, checked: this.state.isPrivate, onChange: this.handleChange, type: 'checkbox', name: 'isPrivate' }),
                                            ' Is private?'
                                        )
                                    )
                                ),
                                React.createElement(
                                    'div',
                                    { className: 'modal-footer' },
                                    React.createElement(
                                        'button',
                                        { onClick: this.handleSubmit, className: 'btn btn-lg btn-primary', type: 'submit', 'data-dismiss': 'modal' },
                                        'Post'
                                    ),
                                    React.createElement(
                                        'button',
                                        { type: 'button ', className: 'btn btn-secondary btn-lg', 'data-dismiss': 'modal' },
                                        'Close'
                                    )
                                )
                            )
                        )
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'modal fade', id: 'courseModal', tabIndex: -1, role: 'dialog', 'aria-labelledby': 'courseModalLabel', 'aria-hidden': 'true' },
                    React.createElement(
                        'div',
                        { className: 'modal-dialog', role: 'document' },
                        React.createElement(
                            'div',
                            { className: 'modal-content' },
                            React.createElement(
                                'div',
                                { className: 'modal-header' },
                                React.createElement(
                                    'h5',
                                    { className: 'modal-title', id: 'courseModalLabel' },
                                    'QAlite'
                                ),
                                React.createElement(
                                    'button',
                                    { type: 'button', className: 'close', 'data-dismiss': 'modal', 'aria-label': 'Close' },
                                    React.createElement(
                                        'span',
                                        { 'aria-hidden': 'true' },
                                        '\xD7'
                                    )
                                )
                            ),
                            React.createElement(
                                'div',
                                { className: 'modal-body' },
                                React.createElement(
                                    'h1',
                                    { className: 'h3 mb-3 font-weight-normal text-center' },
                                    'Course'
                                ),
                                React.createElement(Errorno, { msg: this.state.error, err: this.state.error !== "", id: 'error' }),
                                React.createElement(
                                    'form',
                                    { className: 'form-inline' },
                                    React.createElement('input', { style: { 'marginLeft': '18px' }, value: this.state.search, onChange: this.handleChange, name: "search", className: 'form-control' }),
                                    React.createElement(
                                        'button',
                                        { style: { 'align': 'right' }, className: 'btn btn-outline-success', onClick: this.handleSearch },
                                        'Search'
                                    )
                                ),
                                React.createElement(
                                    'div',
                                    { style: { 'overflow': 'hidden', 'overflowY': 'scroll', 'height': '300px' } },
                                    React.createElement(
                                        'ul',
                                        null,
                                        rows
                                    )
                                ),
                                React.createElement(
                                    'div',
                                    { className: 'modal-footer' },
                                    React.createElement(
                                        'button',
                                        { type: 'button ', className: 'btn btn-secondary btn-lg', 'data-dismiss': 'modal' },
                                        'Close'
                                    )
                                )
                            )
                        )
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'modal fade', id: 'createModal', tabIndex: -1, role: 'dialog', 'aria-labelledby': 'createModalLabel', 'aria-hidden': 'true' },
                    React.createElement(
                        'div',
                        { className: 'modal-dialog', role: 'document' },
                        React.createElement(
                            'div',
                            { className: 'modal-content' },
                            React.createElement(
                                'div',
                                { className: 'modal-header' },
                                React.createElement(
                                    'h5',
                                    { className: 'modal-title', id: 'createModalLabel' },
                                    'QAlite'
                                ),
                                React.createElement(
                                    'button',
                                    { type: 'button', className: 'close', 'data-dismiss': 'modal', 'aria-label': 'Close' },
                                    React.createElement(
                                        'span',
                                        { 'aria-hidden': 'true' },
                                        '\xD7'
                                    )
                                )
                            ),
                            React.createElement(
                                'div',
                                { className: 'modal-body text-center' },
                                React.createElement(
                                    'h1',
                                    { className: 'h3 mb-3 font-weight-normal text-center' },
                                    'Course'
                                ),
                                React.createElement(Errorno, { msg: this.state.error, err: this.state.error !== "", id: 'error' }),
                                React.createElement(
                                    'form',
                                    { className: 'form-inline text-center' },
                                    React.createElement(
                                        'div',
                                        null,
                                        React.createElement(
                                            'div',
                                            { className: 'input-group mb-3' },
                                            React.createElement(
                                                'div',
                                                { className: 'input-group-prepend' },
                                                React.createElement(
                                                    'span',
                                                    { className: 'input-group-text',
                                                        id: 'inputGroup-sizing-default' },
                                                    'Name'
                                                )
                                            ),
                                            React.createElement('input', { type: 'text', className: 'form-control',
                                                'aria-label': 'Sizing example input',
                                                'aria-describedby': 'inputGroup-sizing-default', name: 'courseName', value: this.state.courseName, onChange: this.handleChange })
                                        ),
                                        React.createElement(
                                            'div',
                                            { className: 'input-group mb-3' },
                                            React.createElement(
                                                'div',
                                                { className: 'input-group-prepend' },
                                                React.createElement(
                                                    'label',
                                                    { className: 'input-group-text',
                                                        htmlFor: 'inputGroupSelect01' },
                                                    'Term'
                                                )
                                            ),
                                            React.createElement(
                                                'select',
                                                { className: 'custom-select', id: 'inputGroupSelect01', name: 'term', value: this.state.value, onChange: this.handleSelect },
                                                React.createElement(
                                                    'option',
                                                    { value: ['2019', 'fall'] },
                                                    '2019 Fall'
                                                ),
                                                React.createElement(
                                                    'option',
                                                    { value: ['2019', 'spring'] },
                                                    '2019 Spring'
                                                ),
                                                React.createElement(
                                                    'option',
                                                    { value: ['2018', 'fall'] },
                                                    '2018 Fall'
                                                ),
                                                React.createElement(
                                                    'option',
                                                    { value: ['2018', 'spring'] },
                                                    '2018 Spring'
                                                ),
                                                React.createElement(
                                                    'option',
                                                    { value: ['2017', 'fall'] },
                                                    '2017 Fall'
                                                ),
                                                React.createElement(
                                                    'option',
                                                    { value: ['2017', 'spring'] },
                                                    '2017 Spring'
                                                ),
                                                React.createElement(
                                                    'option',
                                                    { value: ['2016', 'fall'] },
                                                    '2016 Fall'
                                                ),
                                                React.createElement(
                                                    'option',
                                                    { value: ['2016', 'spring'] },
                                                    '2016 Spring'
                                                ),
                                                React.createElement(
                                                    'option',
                                                    { value: ['2015', 'fall'] },
                                                    '2015 Fall'
                                                )
                                            )
                                        ),
                                        React.createElement(
                                            'div',
                                            { className: 'input-group' },
                                            React.createElement(
                                                'div',
                                                { className: 'input-group-prepend' },
                                                React.createElement(
                                                    'span',
                                                    { className: 'input-group-text' },
                                                    'Description'
                                                )
                                            ),
                                            React.createElement('textarea', { value: this.state.description, onChange: this.handleChange, name: 'description', className: 'form-control', 'aria-label': 'With textarea' })
                                        )
                                    )
                                ),
                                React.createElement(
                                    'div',
                                    { className: 'modal-footer' },
                                    React.createElement(
                                        'button',
                                        { type: 'button ', className: 'btn btn-secondary btn-lg', 'data-dismiss': 'modal', onClick: this.handleCreate },
                                        'Add'
                                    ),
                                    React.createElement(
                                        'button',
                                        { type: 'button ', className: 'btn btn-secondary btn-lg', 'data-dismiss': 'modal' },
                                        'Close'
                                    )
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return Newpostmodal;
}(React.Component);

var Classrow = function (_React$Component3) {
    _inherits(Classrow, _React$Component3);

    function Classrow() {
        var _ref;

        var _temp, _this7, _ret;

        _classCallCheck(this, Classrow);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this7 = _possibleConstructorReturn(this, (_ref = Classrow.__proto__ || Object.getPrototypeOf(Classrow)).call.apply(_ref, [this].concat(args))), _this7), _this7.handleclick = function () {
            _this7.props.onclasschange(_this7.props.mykey);
        }, _temp), _possibleConstructorReturn(_this7, _ret);
    }

    _createClass(Classrow, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'a',
                { className: 'dropdown-item text-truncate', href: '#', onClick: this.handleclick },
                this.props.oname
            );
        }
    }]);

    return Classrow;
}(React.Component);

var Classlist = function (_React$Component4) {
    _inherits(Classlist, _React$Component4);

    function Classlist() {
        var _ref2;

        var _temp2, _this8, _ret2;

        _classCallCheck(this, Classlist);

        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        return _ret2 = (_temp2 = (_this8 = _possibleConstructorReturn(this, (_ref2 = Classlist.__proto__ || Object.getPrototypeOf(Classlist)).call.apply(_ref2, [this].concat(args))), _this8), _this8.handleclasschange = function (mykey) {
            _this8.props.onclasschange(mykey);
        }, _temp2), _possibleConstructorReturn(_this8, _ret2);
    }

    _createClass(Classlist, [{
        key: 'render',
        value: function render() {
            var _this9 = this;

            var rows = [];
            var classes = this.props.classes;
            var name = this.props.name;
            var i = "0";

            classes.forEach(function (classi) {
                rows.push(React.createElement(Classrow, { key: i, mykey: i, oname: classi.o_name, onclasschange: _this9.handleclasschange }));
                i++;
            });
            rows.push(React.createElement(
                'a',
                { key: "-2", className: 'dropdown-item text-truncate', href: '#', 'data-toggle': 'modal', 'data-target': '#courseModal' },
                'Course Management'
            ));

            return React.createElement(
                'div',
                { className: 'dropright' },
                React.createElement(
                    'button',
                    { className: 'btn btn-secondary dropdown-toggle btn-block text-truncate', type: 'button', id: 'dropdownMenuButton',
                        'data-toggle': 'dropdown', 'aria-haspopup': 'true', 'aria-expanded': 'false' },
                    name
                ),
                React.createElement(
                    'div',
                    { className: 'dropdown-menu', 'aria-labelledby': 'dropdownMenuButton' },
                    rows
                )
            );
        }
    }]);

    return Classlist;
}(React.Component);

function Questiontag(props) {
    var type = props.type;
    if (type === "note") {
        return React.createElement(
            'small',
            { className: 'badge badge-success' },
            type
        );
    } else {
        return React.createElement(
            'small',
            { className: 'badge badge-primary' },
            type
        );
    }
}

var Questionrow = function (_React$Component5) {
    _inherits(Questionrow, _React$Component5);

    function Questionrow() {
        var _ref3;

        var _temp3, _this10, _ret3;

        _classCallCheck(this, Questionrow);

        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
        }

        return _ret3 = (_temp3 = (_this10 = _possibleConstructorReturn(this, (_ref3 = Questionrow.__proto__ || Object.getPrototypeOf(Questionrow)).call.apply(_ref3, [this].concat(args))), _this10), _this10.handleclick = function () {
            _this10.props.onchange(_this10.props.mykey);
        }, _temp3), _possibleConstructorReturn(_this10, _ret3);
    }

    _createClass(Questionrow, [{
        key: 'render',
        value: function render() {
            var question = this.props.question;
            var title = question['title'];
            var content = question['content'];
            var type = question['type'];
            return React.createElement(
                'a',
                { onClick: this.handleclick, href: '#', className: 'list-group-item list-group-item-action flex-column align-items-start' },
                React.createElement(
                    'div',
                    { className: 'd-flex w-100 justify-content-between' },
                    React.createElement(
                        'h6',
                        { className: 'mb-1 text-truncate' },
                        title
                    )
                ),
                React.createElement(
                    'p',
                    { className: 'mb-1', style: { textOverflow: 'ellipsis', overflow: 'hidden', maxHeight: 60 } },
                    content
                ),
                React.createElement(Questiontag, { type: type })
            );
        }
    }]);

    return Questionrow;
}(React.Component);

var Questionlist = function (_React$Component6) {
    _inherits(Questionlist, _React$Component6);

    function Questionlist() {
        _classCallCheck(this, Questionlist);

        return _possibleConstructorReturn(this, (Questionlist.__proto__ || Object.getPrototypeOf(Questionlist)).apply(this, arguments));
    }

    _createClass(Questionlist, [{
        key: 'render',
        value: function render() {
            var rows = [];
            var questions = this.props.questions;
            var i = void 0;
            for (i in questions) {
                rows.push(React.createElement(Questionrow, { key: i, question: questions[i], onchange: this.props.onchange, mykey: i }));
            }

            return React.createElement(
                'div',
                null,
                rows
            );
        }
    }]);

    return Questionlist;
}(React.Component);

var Questiondetail = function (_React$Component7) {
    _inherits(Questiondetail, _React$Component7);

    function Questiondetail() {
        _classCallCheck(this, Questiondetail);

        return _possibleConstructorReturn(this, (Questiondetail.__proto__ || Object.getPrototypeOf(Questiondetail)).apply(this, arguments));
    }

    _createClass(Questiondetail, [{
        key: 'render',
        value: function render() {
            var title = this.props.title;
            var content = this.props.content;

            return React.createElement(
                'div',
                null,
                React.createElement(
                    'h2',
                    null,
                    title
                ),
                React.createElement(
                    'h5',
                    null,
                    content
                )
            );
        }
    }]);

    return Questiondetail;
}(React.Component);

function Replytag(props) {
    var utname = props.utname;
    if (utname !== null) return React.createElement(
        'small',
        { className: 'badge badge-primary' },
        'Reply to: ',
        utname
    );else return null;
}

function Commenttag(props) {
    var usname = props.usname;

    return React.createElement(
        'div',
        null,
        React.createElement(
            'small',
            { className: 'badge badge-secondary' },
            'Creator: ',
            usname
        )
    );
}

var Commentrow = function (_React$Component8) {
    _inherits(Commentrow, _React$Component8);

    function Commentrow() {
        _classCallCheck(this, Commentrow);

        return _possibleConstructorReturn(this, (Commentrow.__proto__ || Object.getPrototypeOf(Commentrow)).apply(this, arguments));
    }

    _createClass(Commentrow, [{
        key: 'render',
        value: function render() {
            var _this14 = this;

            var comment = this.props.comment;
            var us_content = comment.cs_content;
            var us_name = comment.us_name;
            var ut_name = comment.ut_name;
            var c_id = comment.cs_id;

            return React.createElement(
                'a',
                { className: 'list-group-item list-group-item-action flex-column align-items-start', onClick: function onClick() {
                        return _this14.props.handlereply(c_id, us_name);
                    } },
                React.createElement(Commenttag, { usname: us_name }),
                React.createElement(Replytag, { utname: ut_name }),
                React.createElement(
                    'div',
                    { className: 'd-flex w-100 justify-content-between' },
                    React.createElement(
                        'h6',
                        { className: 'mb-1' },
                        us_content
                    )
                )
            );
        }
    }]);

    return Commentrow;
}(React.Component);

var Comment = function (_React$Component9) {
    _inherits(Comment, _React$Component9);

    function Comment(props) {
        _classCallCheck(this, Comment);

        var _this15 = _possibleConstructorReturn(this, (Comment.__proto__ || Object.getPrototypeOf(Comment)).call(this, props));

        _this15.state = { c_id: "-1", replycontent: "", replyname: "None" };

        _this15.handlereply = _this15.handlereply.bind(_this15);
        _this15.handleChange = _this15.handleChange.bind(_this15);
        _this15.handlereplysubmit = _this15.handlereplysubmit.bind(_this15);
        return _this15;
    }

    _createClass(Comment, [{
        key: 'handlereply',
        value: function handlereply(c_id, replyname) {
            this.setState({ c_id: c_id, replyname: replyname });
        }
    }, {
        key: 'handleChange',
        value: function handleChange(event) {
            var target = event.target;
            var name = target.name;
            var value = target.value;
            this.setState(_defineProperty({}, name, value));
        }
    }, {
        key: 'handlereplysubmit',
        value: function handlereplysubmit() {
            var c_id = this.state.c_id;
            var replycontent = this.state.replycontent;

            var claim = window.localStorage.getItem("Credential");

            axios.post('/newcomment', {
                t_cid: c_id,
                content: replycontent,
                q_id: this.props.currentqid,
                o_id: this.props.currentoid
            }, { headers: { 'Credential': claim, 'Content-Type': 'application/json' }
            }).then(function (response) {
                console.log(response);
                if (response.data.code === 1) {
                    this.setState({ error: "Post success", replycontent: "", c_id: "-1" });
                    this.props.refresh(this.props.currentquestionkey);
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
            var rows = [];
            var comments = this.props.comments;
            var i = void 0;
            for (i in comments) {
                rows.push(React.createElement(Commentrow, { key: i, comment: comments[i], mykey: i, handlereply: this.handlereply }));
            }
            return React.createElement(
                'div',
                null,
                rows,
                React.createElement('input', { type: 'text', className: 'form-control', placeholder: "Reply to:" + this.state.replyname, name: "replycontent", value: this.state.replycontent, onChange: this.handleChange }),
                React.createElement(
                    'h2',
                    null,
                    React.createElement(
                        'span',
                        { className: 'btn btn-outline-secondary', onClick: this.handlereplysubmit },
                        'Reply'
                    )
                )
            );
        }
    }]);

    return Comment;
}(React.Component);

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

var classes = {
    "classinfo": [{
        "create_time": "Sun, 02 Sep 2018 00:00:00 GMT",
        "creator": "Eugene Wu",
        "o_id": 1,
        "o_name": "DATABASES W4111: Introduction to Databases"
    }, {
        "create_time": "Tue, 09 Oct 2018 00:00:00 GMT",
        "creator": "Chingyung Lin",
        "o_id": 18,
        "o_name": "Guided Historical Tour"
    }],
    "code": 1
};

var questions = {
    "question": {
        "0": {
            "content": "Would it be possible to please extend the deadline by a 2-3 days?",
            "create_time": "Sun, 14 Oct 2018 00:00:00 GMT",
            "creator_id": 5,
            "pin": "unpinned",
            "public_type": "public",
            "q_id": 9,
            "q_type": "question",
            "solved_type": "unresolved",
            "tag_id": 3,
            "title": "Request for extension of deadline for Homework 2",
            "update_time": "Sun, 14 Oct 2018 00:00:00 GMT",
            "views": 1
        },
        "1": {
            "content": "I am traveling today and hence will be shifting my OH for this week to Friday (10/26): 10 am - 12 noon. Outside of this change, my usual schedule remains the same.",
            "create_time": "Wed, 03 Oct 2018 00:00:00 GMT",
            "creator_id": 5,
            "pin": "pinned",
            "public_type": "public",
            "q_id": 8,
            "q_type": "note",
            "solved_type": null,
            "tag_id": 7,
            "title": "Sidharth’s OH this week shifted to Friday",
            "update_time": "Fri, 12 Oct 2018 00:00:00 GMT",
            "views": 1
        },
        "2": {
            "content": "In problem2, we have to initialize each ui and vj, but whats the value of M and N? N can be known from movies.txt, but what about N?",
            "create_time": "Fri, 28 Sep 2018 00:00:00 GMT",
            "creator_id": 5,
            "pin": "unpinned",
            "public_type": "public",
            "q_id": 10,
            "q_type": "question",
            "solved_type": "resolved",
            "tag_id": 7,
            "title": "The value of M and N?",
            "update_time": "Fri, 12 Oct 2018 00:00:00 GMT",
            "views": 1
        }
    }
};

var comment = {
    "code": 1,
    "comment": [{
        "cs_content": "Yep, you write the UNI of the student whose answer you'd like to substitute in place of your own.",
        "cs_id": 3,
        "ct_content": null,
        "ct_id": null,
        "us_name": "Ivy Chen",
        "ut_name": null
    }, {
        "cs_content": "Cool, does this substitution apply to one/a few questions we designate or does it automatically apply to all questions? The latter would make less sense of course, just wanted to make sure.",
        "cs_id": 4,
        "ct_content": "Yep, you write the UNI of the student whose answer you'd like to substitute in place of your own.",
        "ct_id": 3,
        "us_name": "Anonymous",
        "ut_name": "Ivy Chen"
    }, {
        "cs_content": "We will specify the one question where this is applicable on the exam.",
        "cs_id": 5,
        "ct_content": null,
        "ct_id": null,
        "us_name": "Ivy Chen",
        "ut_name": null
    }, {
        "cs_content": "Got it, that makes sense. Thanks!",
        "cs_id": 6,
        "ct_content": "We will specify the one question where this is applicable on the exam.",
        "ct_id": 5,
        "us_name": "Anonymous",
        "ut_name": "Ivy Chen"
    }, {
        "cs_content": "So if I write other student's UNI, will his/her answer replace mine or would I be given the credit of the higher one of the credits of  my answer and that student's?",
        "cs_id": 7,
        "ct_content": "Cool, does this substitution apply to one/a few questions we designate or does it automatically apply to all questions? The latter would make less sense of course, just wanted to make sure.",
        "ct_id": 4,
        "us_name": "danyang xiang",
        "ut_name": "Anonymous"
    }, {
        "cs_content": " The higher one",
        "cs_id": 8,
        "ct_content": "So if I write other student's UNI, will his/her answer replace mine or would I be given the credit of the higher one of the credits of  my answer and that student's?",
        "ct_id": 7,
        "us_name": "Ivy Chen",
        "ut_name": "danyang xiang"
    }, {
        "cs_content": " The higher one",
        "cs_id": 8,
        "ct_content": "Yep, you write the UNI of the student whose answer you'd like to substitute in place of your own.",
        "ct_id": 3,
        "us_name": "Ivy Chen",
        "ut_name": "Ivy Chen"
    }]
};

ReactDOM.render(React.createElement(App, null), document.getElementById('container'));