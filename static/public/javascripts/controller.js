var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

axios.defaults.baseURL = 'http://127.0.0.1:5000';
axios.defaults.headers.post['Content-Type'] = 'application/json';

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App() {
        _classCallCheck(this, App);

        return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
    }

    _createClass(App, [{
        key: 'render',

        // constructor (props) {
        //     super(props);
        //     this.state = {
        //         currentquestionkey: "0",
        //         currentclasskey:"0"
        //     }
        //
        //
        // }
        //
        //
        //
        //
        //
        value: function render() {
            var currentquestion = this.props.questions["0"];
            var currentnumber = "0";
            var currentoname = this.props.classes[currentnumber].o_name;
            var currentoid = this.props.classes[currentnumber].o_id;

            return React.createElement(
                'div',
                null,
                React.createElement(Newpostmodal, { oid: currentoid }),
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
                            React.createElement(Classlist, { classes: this.props.classes, name: currentoname }),
                            React.createElement(
                                'button',
                                { className: 'btn btn-primary btn-block', 'data-toggle': 'modal', 'data-target': '#postModal' },
                                ' New Post '
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'list-group' },
                            React.createElement(Questionlist, { questions: this.props.questions })
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
                                                { className: 'nav-link', id: 'logout' },
                                                React.createElement(
                                                    'a',
                                                    { className: 'nav-link', href: '#' },
                                                    'Log Out'
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        ),
                        React.createElement(Questiondetail, { title: currentquestion.title, content: currentquestion.content }),
                        React.createElement('div', { className: 'line' }),
                        React.createElement('input', { type: 'text', className: 'form-control', placeholder: 'Compose a new followup discussion' })
                    )
                )
            );
        }
    }]);

    return App;
}(React.Component);

var Newpostmodal = function (_React$Component2) {
    _inherits(Newpostmodal, _React$Component2);

    function Newpostmodal() {
        _classCallCheck(this, Newpostmodal);

        return _possibleConstructorReturn(this, (Newpostmodal.__proto__ || Object.getPrototypeOf(Newpostmodal)).apply(this, arguments));
    }

    _createClass(Newpostmodal, [{
        key: 'render',
        value: function render() {
            return React.createElement(
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
                                React.createElement(
                                    'div',
                                    { className: 'input-group mb-3' },
                                    React.createElement('input', { type: 'text', name: 'title', className: 'form-control', placeholder: 'Title', 'aria-label': 'Title', 'aria-describedby': 'basic-addon1' })
                                ),
                                React.createElement(
                                    'div',
                                    { className: 'input-group' },
                                    React.createElement('textarea', { className: 'form-control', name: 'content', placeholder: 'Content', 'aria-label': 'With textarea', style: { 'minHeight': '250px' } })
                                ),
                                React.createElement(
                                    'div',
                                    { className: 'checkbox mb-3' },
                                    React.createElement(
                                        'label',
                                        null,
                                        React.createElement('input', { type: 'checkbox', name: 'isNote' }),
                                        ' Is a note?'
                                    ),
                                    React.createElement(
                                        'label',
                                        null,
                                        React.createElement('input', { type: 'checkbox', name: 'isPrivate' }),
                                        ' Is private?'
                                    )
                                )
                            ),
                            React.createElement(
                                'div',
                                { className: 'modal-footer' },
                                React.createElement(
                                    'button',
                                    { className: 'btn btn-lg btn-primary', type: 'submit' },
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
            );
        }
    }]);

    return Newpostmodal;
}(React.Component);

var Classrow = function (_React$Component3) {
    _inherits(Classrow, _React$Component3);

    function Classrow() {
        _classCallCheck(this, Classrow);

        return _possibleConstructorReturn(this, (Classrow.__proto__ || Object.getPrototypeOf(Classrow)).apply(this, arguments));
    }

    _createClass(Classrow, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'a',
                { className: 'dropdown-item text-truncate', href: '#' },
                this.props.oname
            );
        }
    }]);

    return Classrow;
}(React.Component);

var Classlist = function (_React$Component4) {
    _inherits(Classlist, _React$Component4);

    function Classlist() {
        _classCallCheck(this, Classlist);

        return _possibleConstructorReturn(this, (Classlist.__proto__ || Object.getPrototypeOf(Classlist)).apply(this, arguments));
    }

    _createClass(Classlist, [{
        key: 'render',
        value: function render() {
            var rows = [];
            var classes = this.props.classes;
            var name = this.props.name;

            classes.forEach(function (classi) {
                rows.push(React.createElement(Classrow, { key: classi.o_id, oname: classi.oname }));
            });

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

var Questionrow = function (_React$Component5) {
    _inherits(Questionrow, _React$Component5);

    function Questionrow() {
        _classCallCheck(this, Questionrow);

        return _possibleConstructorReturn(this, (Questionrow.__proto__ || Object.getPrototypeOf(Questionrow)).apply(this, arguments));
    }

    _createClass(Questionrow, [{
        key: 'render',
        value: function render() {
            var question = this.props.question;
            var title = question['title'];
            var content = question['content'];
            var type = question['q_type'];
            return React.createElement(
                'a',
                { href: '#', className: 'list-group-item list-group-item-action flex-column align-items-start' },
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
                React.createElement(
                    'small',
                    { className: 'badge badge-primary' },
                    type
                )
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
                rows.push(React.createElement(Questionrow, { question: questions[i] }));
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
                    'p',
                    null,
                    content
                )
            );
        }
    }]);

    return Questiondetail;
}(React.Component);

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

ReactDOM.render(React.createElement(App, { classes: classes.classinfo, questions: questions.question }), document.getElementById('container'));