axios.defaults.baseURL = 'http://127.0.0.1:5000';
axios.defaults.headers.post['Content-Type'] = 'application/json';

class App extends React.Component{
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
    render() {
        const currentquestion = this.props.questions["0"];
        const currentnumber = "0";
        const currentoname = this.props.classes[currentnumber].o_name;
        const currentoid = this.props.classes[currentnumber].o_id;

        return (<div>

                <Newpostmodal oid = {currentoid}/>

                <div className="wrapper">
                    <nav id="sidebar">
                        <div className="sidebar-header">
                            <strong style={{fontSize: 'xx-large'}}>QAlite</strong>
                        </div>
                        <div className="sidebar-header">

                            {/*class selection*/}
                            <Classlist classes = {this.props.classes} name = {currentoname}/>

                            <button className="btn btn-primary btn-block" data-toggle="modal" data-target="#postModal"> New Post </button>

                        </div>
                        <div className="list-group">

                            {/*question list*/}
                            <Questionlist questions = {this.props.questions}/>

                        </div>
                    </nav>
                    {/* Page Content Holder */}
                    <div id="content">
                        <nav className="navbar navbar-expand-lg navbar-light bg-light">
                            <div className="container-fluid">
                                <button type="button" id="sidebarCollapse" className="navbar-btn">
                                    <span />
                                    <span />
                                    <span />
                                </button>
                                <button className="btn btn-dark d-inline-block d-lg-none ml-auto" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                    <i className="fas fa-align-justify" />
                                </button>
                                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                    <ul className="nav navbar-nav ml-auto">
                                        <li className="nav-item">
                                            <div className="nav-link" id="logout">
                                                <a className="nav-link" href="#">Log Out</a>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </nav>

                        <Questiondetail title = {currentquestion.title} content = {currentquestion.content}/>

                        <div className="line" />

                        {/*<Comment currentoid = {currentoid} currentquestion = {currentquestion}/>*/}

                        <input type="text" className="form-control" placeholder="Compose a new followup discussion" />
                    </div>
                </div>
            </div>
        );

    }
}

class Newpostmodal extends React.Component {
    render() {
        return (
            <div className="modal fade" id="postModal" tabIndex={-1} role="dialog" aria-labelledby="postModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="postModalLabel">QAlite</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body text-center">
                            <form className="form-signin">
                                <h1 className="h3 mb-3 font-weight-normal">New Post</h1>

                                <div className="input-group mb-3">
                                    <input type="text" name = "title" className="form-control" placeholder="Title" aria-label="Title" aria-describedby="basic-addon1" />
                                </div>

                                <div className="input-group">
                                    <textarea className="form-control" name = "content" placeholder="Content"  aria-label="With textarea" style={{'minHeight': '250px'}} ></textarea>
                                </div>

                                <div className="checkbox mb-3">
                                    <label>
                                        <input type="checkbox" name = "isNote" /> Is a note?
                                    </label>
                                    <label>
                                        <input type="checkbox" name = "isPrivate"/> Is private?
                                    </label>
                                </div>
                            </form>

                            <div className="modal-footer">
                                <button className="btn btn-lg btn-primary" type="submit">Post</button>
                                <button type="button " className="btn btn-secondary btn-lg" data-dismiss="modal">Close</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )

    }
}


class Classrow extends React.Component{
    render() {
        return  <a className="dropdown-item text-truncate" href="#">{this.props.oname}</a>
    }
}

class Classlist extends React.Component {
    render() {
        const rows = [];
        const classes = this.props.classes;
        const name = this.props.name;

        classes.forEach(
            (classi) => {
                rows.push(
                    <Classrow key = {classi.o_id} oname = {classi.oname}/>

                    )
            }
        )

        return<div className="dropright">
                <button className="btn btn-secondary dropdown-toggle btn-block text-truncate" type="button" id="dropdownMenuButton"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {name}
                </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    {rows}
                </div>
            </div>
    }
}

class Questionrow extends React.Component {
    render() {
        const question = this.props.question;
        const title = question['title'];
        const content = question['content'];
        const type = question['q_type'];
        return (
            <a href="#" className="list-group-item list-group-item-action flex-column align-items-start">
                <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1 text-truncate">{title}</h6>
                </div>
                <p className="mb-1" style={{textOverflow: 'ellipsis', overflow: 'hidden', maxHeight: 60}}>{content}</p>
                <small className="badge badge-primary">{type}</small>
            </a>
        )
    }
}




class Questionlist extends React.Component {
    render(){
        const rows = [];
        const questions = this.props.questions;
        let i;
        for(i in questions) {
            rows.push(
                <Questionrow question = {questions[i]}/>
            )
        }

        return (
            <div>
                {rows}
            </div>
        )
    }
}

class Questiondetail extends React.Component {

    render() {
        const title = this.props.title;
        const content = this.props.content;

        return (
            <div>
                <h2>{title}</h2>
                <p>{content}</p>
            </div>

        );
    }
}


const classes =
    {
        "classinfo": [
            {
                "create_time": "Sun, 02 Sep 2018 00:00:00 GMT",
                "creator": "Eugene Wu",
                "o_id": 1,
                "o_name": "DATABASES W4111: Introduction to Databases"
            },
            {
                "create_time": "Tue, 09 Oct 2018 00:00:00 GMT",
                "creator": "Chingyung Lin",
                "o_id": 18,
                "o_name": "Guided Historical Tour"
            }
        ],
        "code": 1
    }


const questions =
    {
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
}



ReactDOM.render(<App classes = {classes.classinfo} questions = {questions.question}/>, document.getElementById('container'));

