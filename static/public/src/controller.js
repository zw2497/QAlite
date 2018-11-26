axios.defaults.baseURL = 'http://6156.us-east-2.elasticbeanstalk.com';
var env = "http://qalite.s3-website.us-east-2.amazonaws.com";

// axios.defaults.baseURL = 'http://127.0.0.1:5000';
// var env = "http://127.0.0.1:3000";
axios.defaults.headers.post['Content-Type'] = 'application/json';

class App extends React.Component{
    constructor (props) {
        super(props);
        this.state = {
            currentquestionkey: "0",
            currentclasskey:"0",
            questions:{"0": {"title": "loading...", "content": "Loading..."}},
            classes:[{"o_id" : "-1", "o_name" : "Loading..."}],
            currentoid: "-1",
            currentqid:"-1",
            comments: [
                {
                    "cs_content": "Loading...",
                    "cs_id": 0,
                    "ct_content": "Loading...",
                    "ct_id": 0,
                    "us_name": "Loading...",
                    "ut_name": "Loading..."
                }]

        };

        // check Credential
        var claim = window.sessionStorage.getItem("Credential");
        if (!claim){
            window.location.replace(env);
            console.log("redirect")
        }

        // query question and class
        axios.get('/class', {
            headers: {'Credential': window.sessionStorage.getItem("Credential"), 'Content-Type': 'application/json'}
        })
            .then(function (response) {
                console.log(response);
                if (response.data.code === 1 && response.data.classinfo[0] !== undefined) {
                    console.log(response);
                    this.setState({classes: response.data.classinfo});
                    this.setState({currentoid: this.state.classes[this.state.currentclasskey].o_id});

                    axios.post('/question',{
                        o_id: this.state.classes[this.state.currentclasskey].o_id
                    },{headers: {'Credential': window.sessionStorage.getItem("Credential"), 'Content-Type': 'application/json'}
                    })
                        .then(function (response) {
                            console.log(response);
                            if (response.data.code === 1 && response.data.question[this.state.currentquestionkey] !== undefined) {
                                this.setState({questions: response.data.question});
                                this.setState({currentqid: this.state.questions[this.state.currentquestionkey].q_id});

                                axios.post('/comment',{
                                    o_id: this.state.currentoid,
                                    q_id: this.state.currentqid
                                },{headers: {'Credential': window.sessionStorage.getItem("Credential"), 'Content-Type': 'application/json'}
                                })
                                    .then(function (response) {
                                        console.log(response);
                                        if (response.data.code === 1) {
                                            this.setState({comments: response.data.comments});

                                        } else{
                                            this.setState({error: "Post failed"});
                                        }
                                    }.bind(this))
                                    .catch(function (error) {
                                        console.log(error);
                                    });
                            } else{
                                this.setState({questions:{"0": {"title": "Please post a question", "content": ""}}, comments: [
                                        {
                                            "cs_content": "Start a new followup discussion",
                                            "cs_id": 0,
                                            "ct_content": "",
                                            "ct_id": 0,
                                            "us_name": "",
                                            "ut_name": ""
                                        }]})
                            }
                        }.bind(this))
                        .catch(function (error) {
                            console.log(error);
                        });

                } else {
                    this.setState({classes:[{"o_id" : "-1", "o_name" : "No Class"}], questions:{"0": {"title": "Please add or create a course", "content": "No data"}}, comments: [
                            {
                                "cs_content": "No data",
                                "cs_id": 0,
                                "ct_content": "No data",
                                "ct_id": 0,
                                "us_name": "No data",
                                "ut_name": "No data"
                            }]})
                }
            }.bind(this))
            .catch(function (error) {
                console.log(error);
            });

        this.handlecurrentclass=this.handlecurrentclass.bind(this);
        this.handlecurrentquestion=this.handlecurrentquestion.bind(this);
        this.handleCreCourse=this.handleCreCourse.bind(this);
        this.handleLogout=this.handleLogout.bind(this);
        this.handlecurrentquestionnorefresh=this.handlecurrentquestionnorefresh.bind(this)
    }

    handleLogout(event) {
        window.sessionStorage.removeItem('Credential');
        window.location.reload();
    }

    handlecurrentclass(key) {
        this.setState({currentclasskey : key,currentoid : this.state.classes[key].o_id},
            () => {
                axios.post('/question',{
                    o_id: this.state.currentoid
                },{headers: {'Credential': window.sessionStorage.getItem("Credential"), 'Content-Type': 'application/json'}
                })
                    .then(function (response) {
                        console.log(response);
                        if (response.data.code === 1 && response.data.question[0] !== undefined) {
                            this.setState({questions: response.data.question});
                            this.setState({currentqid: this.state.questions[this.state.currentquestionkey].q_id});


                            axios.post('/comment',{
                                o_id: this.state.currentoid,
                                q_id: this.state.currentqid
                            },{headers: {'Credential': window.sessionStorage.getItem("Credential"), 'Content-Type': 'application/json'}
                            })
                                .then(function (response) {
                                    console.log(response);
                                    if (response.data.code === 1) {
                                        this.setState({comments: response.data.comments});
                                    } else{
                                        this.setState({error: "Post failed"});
                                    }
                                }.bind(this))
                                .catch(function (error) {
                                    console.log(error);
                                });

                        } else{
                            this.setState({currentquestionkey: "0", error: "Post failed", questions:{"0": {"title": "No Post", "content": "Please add a new post", "q_id": -1}}});
                        }
                    }.bind(this))
                    .catch(function (error) {
                        console.log(error);
                    });
            }
            )



    }

    handlecurrentquestion(key) {
        this.setState({comments: [
                {
                    "cs_content": "Loading...",
                    "cs_id": 0,
                    "ct_content": "Loading...",
                    "ct_id": 0,
                    "us_name": "Loading...",
                    "ut_name": "Loading..."
                }]});
        this.setState({currentquestionkey : key, currentqid: this.state.questions[key].q_id, },
            () => {
                axios.post('/comment',{
                    o_id: this.state.currentoid,
                    q_id: this.state.currentqid
                },{headers: {'Credential': window.sessionStorage.getItem("Credential"), 'Content-Type': 'application/json'}
                })
                    .then(function (response) {
                        console.log(response);
                        if (response.data.code === 1) {
                            this.setState({comments: response.data.comments});

                        } else{
                            this.setState({error: "Post failed"});
                        }
                    }.bind(this))
                    .catch(function (error) {
                        console.log(error);
                    });
            }
            )
    }

    handlecurrentquestionnorefresh(key) {
        this.setState({currentquestionkey : key, currentqid: this.state.questions[key].q_id, },
            () => {
                axios.post('/comment',{
                    o_id: this.state.currentoid,
                    q_id: this.state.currentqid
                },{headers: {'Credential': window.sessionStorage.getItem("Credential"), 'Content-Type': 'application/json'}
                })
                    .then(function (response) {
                        console.log(response);
                        if (response.data.code === 1) {
                            this.setState({comments: response.data.comments});

                        } else{
                            this.setState({error: "Post failed"});
                        }
                    }.bind(this))
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        )
    }

    handleCreCourse(){

    }

    render() {
        const questions = this.state.questions;
        const classes = this.state.classes;
        const currentclasskey = this.state.currentclasskey;
        const currentquestionkey = this.state.currentquestionkey;
        const currentquestion = questions[currentquestionkey];
        const currentoname = classes[currentclasskey].o_name;
        const currentoid = classes[currentclasskey].o_id;
        const currentqid = currentquestion.q_id;

        var title;
        var content;
        if (currentquestion !== undefined)
            title = currentquestion.title;
        else
            title = "No data";

        if (currentquestion !== undefined)
            content = currentquestion.content;
        else
            content = "No data";

        return (<div>

                <Newpostmodal oid = {currentoid} newpost = {this.handlecurrentclass} mykey = {this.state.currentclasskey}/>

                <div className="wrapper">
                    <nav id="sidebar">
                        <div className="sidebar-header">
                            <strong style={{fontSize: 'xx-large'}}>QAlite</strong>
                        </div>
                        <div className="sidebar-header">

                            {/*class selection*/}
                            <Classlist classes = {classes} name = {currentoname} onclasschange = {this.handlecurrentclass}/>

                            <button className="btn btn-primary btn-block" data-toggle="modal" data-target="#postModal"> New Post </button>

                        </div>
                        <div className="list-group">

                            {/*question list*/}
                            <Questionlist questions = {questions} onchange={this.handlecurrentquestion}/>

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
                                                <a className="nav-link" href="#" onClick={this.handleCreCourse} data-toggle="modal" data-target="#createModal">Create New Course</a>
                                            </div>
                                        </li>
                                        <li className="nav-item">
                                            <div className="nav-link" id="logout">
                                                <a className="nav-link" href="#" onClick={this.handleLogout}>Log Out</a>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </nav>

                        <Questiondetail title = {title} content = {content}/>

                        <div className="line" />


                        <Comment currentoid = {currentoid} currentqid = {currentqid} comments={this.state.comments} currentquestionkey={this.state.currentquestionkey} refresh={this.handlecurrentquestionnorefresh}/>
                    </div>
                </div>
            </div>
        );

    }
}

class Newpostmodal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isNote: false,
            isPrivate: false,
            title: "",
            content: "",
            error:"",
            search:"",
            classlist:[],
            courseName:"",
            description:"",
            term:"2019,fall"
        }
        ;


        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
    }

    handleChange(event) {
        const target =  event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value,
        });
        console.log(this.state.term.year)
    }

    handleSubmit(event) {
        let claim = window.sessionStorage.getItem("Credential");

        axios.post('/newpost',{
            title: this.state.title,
            content: this.state.content,
            q_type: this.state.isNote? '0' : '1',
            p_type: this.state.isPrivate? '0' : '1',
            o_id: this.props.oid,
        },{headers: {'Credential': claim, 'Content-Type': 'application/json'}
        })
            .then(function (response) {
                console.log(response);
                if (response.data.code === 1) {
                    this.setState({error: "Post success"});
                    this.props.newpost(this.props.mykey);
                } else{
                    this.setState({error: "Post failed"});
                }
            }.bind(this))
            .catch(function (error) {
                console.log(error);
            });

        event.preventDefault();
    }

    handleSearch(event) {
        axios.post('/allclass',{
            search: this.state.search
        },{headers: {'Credential': window.sessionStorage.getItem("Credential"), 'Content-Type': 'application/json'}
        })
            .then(function (response) {
                console.log(response);
                if (response.data.code === 1) {
                    this.setState({classlist: response.data.classinfo});
                } else{
                    this.setState({error: "search failed"});
                }

            }.bind(this))
            .catch(function (error) {
                console.log(error);
            });

        event.preventDefault();
    }

    handleadd(oid) {
        axios.post('/addclass',{
            o_id: oid
        },{headers: {'Credential': window.sessionStorage.getItem("Credential"), 'Content-Type': 'application/json'}
        })
            .then(function (response) {
                console.log(response);
                if (response.data.code === 1) {
                    this.setState({error: "add success"});
                } else{
                    this.setState({error: "search failed"});
                }

            }.bind(this))
            .catch(function (error) {
                console.log(error);
            });

        event.preventDefault();

    }

    handleSelect(event) {
        const name = event.target.name
        this.setState({[name]: event.target.value});
    }

    handleCreate(event) {
        const term = this.state.term.split(',');

        axios.post('/createcourse',{
            courseName: this.state.courseName,
            description: this.state.description,
            termyear: term[0],
            termsemester:  term[1]
        },{headers: {'Credential': window.sessionStorage.getItem("Credential"), 'Content-Type': 'application/json'}
        })
            .then(function (response) {
                console.log(response);
                if (response.data.code === 1) {
                    this.setState({error: "add success"});
                } else{
                    this.setState({error: "search failed"});
                }

            }.bind(this))
            .catch(function (error) {
                console.log(error);
            });

        event.preventDefault();
    }

    render() {
        const rows = [];
        const classes = this.state.classlist;
        let i = "0";

        classes.forEach(
            (classi) => {
                rows.push(

                    <li key = {i}>
                        <div>
                            {classi.o_name}
                            <button className={"btn btn-primary btn-sm"} onClick={() => this.handleadd(classi.o_id)}>ADD</button>
                        </div>

                    </li>

                );
                i++;
            }
        )

        return (

            <div>
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

                                {/*error message*/}
                                <Errorno msg = {this.state.error} err = {this.state.error !== ""} id = "error"/>


                                <div className="input-group mb-3">
                                    <input value={this.state.title} onChange={this.handleChange} type="text" name = "title" className="form-control" placeholder="Title" aria-label="Title" aria-describedby="basic-addon1" />
                                </div>

                                <div className="input-group">
                                    <textarea  value={this.state.content} onChange={this.handleChange} className="form-control" name = "content" placeholder="Content"  aria-label="With textarea" style={{'minHeight': '250px'}} ></textarea>
                                </div>

                                <div className="checkbox mb-3">
                                    <label>
                                        <input value={this.state.isNote} checked={this.state.isNote} onChange={this.handleChange} type="checkbox" name = "isNote" /> Is a note?
                                    </label>
                                    <label>
                                        <input value={this.state.isPrivate} checked={this.state.isPrivate} onChange={this.handleChange} type="checkbox" name = "isPrivate"/> Is private?
                                    </label>
                                </div>
                            </form>

                            <div className="modal-footer">
                                <button onClick={this.handleSubmit} className="btn btn-lg btn-primary" type="submit" data-dismiss="modal">Post</button>
                                <button type="button " className="btn btn-secondary btn-lg" data-dismiss="modal">Close</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
                <div className="modal fade" id="courseModal" tabIndex={-1} role="dialog" aria-labelledby="courseModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="courseModalLabel">QAlite</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div className="modal-body text-center">

                                <h1 className="h3 mb-3 font-weight-normal text-center">Course</h1>

                                {/*error message*/}
                                <Errorno msg = {this.state.error} err = {this.state.error !== ""} id = "error"/>



                                <form className="form-inline text-center">
                                    <input value={this.state.search} onChange={this.handleChange} name={"search"} className="form-control"/>
                                    <button className="btn btn-outline-success" onClick={this.handleSearch}>Search</button>
                                </form>
                                <ul>
                                    {rows}
                                </ul>

                                <div className="modal-footer">
                                    <button type="button " className="btn btn-secondary btn-lg" data-dismiss="modal">Close</button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade" id="createModal" tabIndex={-1} role="dialog" aria-labelledby="createModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="createModalLabel">QAlite</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div className="modal-body text-center">

                                <h1 className="h3 mb-3 font-weight-normal text-center">Course</h1>

                                {/*error message*/}
                                <Errorno msg = {this.state.error} err = {this.state.error !== ""} id = "error"/>

                                <form className="form-inline text-center">
                                    <div>
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text"
                                                      id="inputGroup-sizing-default">Name</span>
                                            </div>
                                            <input type="text" className="form-control"
                                                   aria-label="Sizing example input"
                                                   aria-describedby="inputGroup-sizing-default" name="courseName" value={this.state.courseName} onChange={this.handleChange}/>
                                        </div>
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <label className="input-group-text"
                                                       htmlFor="inputGroupSelect01">Term</label>
                                            </div>
                                            <select className="custom-select" id="inputGroupSelect01" name='term' value={this.state.value} onChange={this.handleSelect}>
                                                <option value={['2019','fall']}>2019 Fall</option>
                                                <option value={['2019','spring']}>2019 Spring</option>
                                                <option value={['2018','fall']}>2018 Fall</option>
                                                <option value={['2018','spring']}>2018 Spring</option>
                                                <option value={['2017','fall']}>2017 Fall</option>
                                                <option value={['2017','spring']}>2017 Spring</option>
                                                <option value={['2016','fall']}>2016 Fall</option>
                                                <option value={['2016','spring']}>2016 Spring</option>
                                                <option value={['2015','fall']}>2015 Fall</option>
                                            </select>
                                        </div>
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">Description</span>
                                            </div>
                                            <textarea value={this.state.description} onChange={this.handleChange} name="description" className="form-control" aria-label="With textarea"/>
                                        </div>
                                    </div>

                                </form>

                                <div className="modal-footer">
                                    <button type="button " className="btn btn-secondary btn-lg" data-dismiss="modal" onClick={this.handleCreate}>Add</button>
                                    <button type="button " className="btn btn-secondary btn-lg" data-dismiss="modal">Close</button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )

    }
}

class Classrow extends React.Component{
    handleclick = () => {
        this.props.onclasschange(this.props.mykey)
    }
    render() {
        return  <a className="dropdown-item text-truncate" href="#" onClick={this.handleclick}>{this.props.oname}</a>
    }
}

class Classlist extends React.Component {

    handleclasschange = (mykey) => {
        this.props.onclasschange(mykey);
    }

    render() {
        const rows = [];
        const classes = this.props.classes;
        const name = this.props.name;
        let i = "0";

        classes.forEach(
            (classi) => {
                rows.push(
                    <Classrow key = {i} mykey={i} oname = {classi.o_name} onclasschange = {this.handleclasschange}/>

                    );
                i++;
            }
        )
        rows.push(
            <a key = {"-2"} className="dropdown-item text-truncate" href="#" data-toggle="modal" data-target="#courseModal" >Course Management</a>

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

function Questiontag(props) {
    const type = props.type
    if (type === "note") {
        return (
            <small className="badge badge-success">{type}</small>
        )
    } else {
        return (
            <small className="badge badge-primary">{type}</small>
        )
    }
}

class Questionrow extends React.Component {
    handleclick = () => {
        this.props.onchange(this.props.mykey)
    }

    render() {
        const question = this.props.question;
        const title = question['title'];
        const content = question['content'];
        const type = question['q_type'];
        return (
            <a onClick={this.handleclick} href="#" className="list-group-item list-group-item-action flex-column align-items-start">
                <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1 text-truncate">{title}</h6>
                </div>
                <p className="mb-1" style={{textOverflow: 'ellipsis', overflow: 'hidden', maxHeight: 60}}>{content}</p>
                <Questiontag type = {type} />
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
                <Questionrow key = {i} question = {questions[i]} onchange={this.props.onchange} mykey = {i}/>
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
                <h5>{content}</h5>
            </div>

        );
    }
}

function Replytag(props) {
    const utname = props.utname;
    if (utname !== null)
        return (
            <small className="badge badge-primary">Reply to: {utname}</small>
        )
    else
        return (
            null
        )
}

function Commenttag(props) {
    const usname = props.usname;

    return (
        <div>
        <small className="badge badge-secondary">Creator: {usname}</small>
        </div>
    )
}

class Commentrow extends React.Component {
    render() {
        const comment = this.props.comment;
        const us_content = comment.cs_content;
        const us_name = comment.us_name;
        const ut_name = comment.ut_name;
        const c_id = comment.cs_id;

        return (
            <a className="list-group-item list-group-item-action flex-column align-items-start" onClick={()=> this.props.handlereply(c_id, us_name)}>
                <Commenttag usname={us_name}/>
                <Replytag utname={ut_name}/>
                <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1 text-truncate">{us_content}</h6>
                </div>
            </a>


        )
    }
}

class Comment extends React.Component {
    constructor (props) {
        super(props);
        this.state = {c_id:"-1", replycontent:"", replyname:"None"};

        this.handlereply=this.handlereply.bind(this);
        this.handleChange=this.handleChange.bind(this)
        this.handlereplysubmit=this.handlereplysubmit.bind(this)
    }

    handlereply(c_id,replyname) {
        this.setState({c_id:c_id, replyname:replyname})
    }

    handleChange(event) {
        const target =  event.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value,
        });
    }
    handlereplysubmit(){
        const c_id = this.state.c_id;
        const replycontent = this.state.replycontent;

        let claim = window.sessionStorage.getItem("Credential");

        axios.post('/newcomment',{
            c_id: c_id,
            content: replycontent,
            q_id: this.props.currentqid,
            o_id: this.props.currentoid
        },{headers: {'Credential': claim, 'Content-Type': 'application/json'}
        })
            .then(function (response) {
                console.log(response);
                if (response.data.code === 1) {
                    this.setState({error: "Post success"});
                    this.props.refresh(this.props.currentquestionkey);
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
        const rows = [];
        const comments = this.props.comments;
        let i;
        for(i in comments) {
            rows.push(
                <Commentrow key = {i} comment = {comments[i]} mykey = {i} handlereply={this.handlereply}/>
            )
        }
        return (
            <div>
                {rows}
                <input type="text" className="form-control" placeholder={"Reply to:" + this.state.replyname} name={"replycontent"} value={this.state.replycontent} onChange={this.handleChange}/>
                <h2><span className="btn btn-outline-secondary" onClick={this.handlereplysubmit}>Reply</span></h2>
            </div>
        )
    }
}

function Errorno(props){
    if (props.err === true){
        return <div className="alert alert-danger" role="alert">
            {props.msg}
        </div>;
    }else {
        return null
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

const comment =
    {
        "code": 1,
        "comment": [
            {
                "cs_content": "Yep, you write the UNI of the student whose answer you'd like to substitute in place of your own.",
                "cs_id": 3,
                "ct_content": null,
                "ct_id": null,
                "us_name": "Ivy Chen",
                "ut_name": null
            },
            {
                "cs_content": "Cool, does this substitution apply to one/a few questions we designate or does it automatically apply to all questions? The latter would make less sense of course, just wanted to make sure.",
                "cs_id": 4,
                "ct_content": "Yep, you write the UNI of the student whose answer you'd like to substitute in place of your own.",
                "ct_id": 3,
                "us_name": "Anonymous",
                "ut_name": "Ivy Chen"
            },
            {
                "cs_content": "We will specify the one question where this is applicable on the exam.",
                "cs_id": 5,
                "ct_content": null,
                "ct_id": null,
                "us_name": "Ivy Chen",
                "ut_name": null
            },
            {
                "cs_content": "Got it, that makes sense. Thanks!",
                "cs_id": 6,
                "ct_content": "We will specify the one question where this is applicable on the exam.",
                "ct_id": 5,
                "us_name": "Anonymous",
                "ut_name": "Ivy Chen"
            },
            {
                "cs_content": "So if I write other student's UNI, will his/her answer replace mine or would I be given the credit of the higher one of the credits of  my answer and that student's?",
                "cs_id": 7,
                "ct_content": "Cool, does this substitution apply to one/a few questions we designate or does it automatically apply to all questions? The latter would make less sense of course, just wanted to make sure.",
                "ct_id": 4,
                "us_name": "danyang xiang",
                "ut_name": "Anonymous"
            },
            {
                "cs_content": " The higher one",
                "cs_id": 8,
                "ct_content": "So if I write other student's UNI, will his/her answer replace mine or would I be given the credit of the higher one of the credits of  my answer and that student's?",
                "ct_id": 7,
                "us_name": "Ivy Chen",
                "ut_name": "danyang xiang"
            },
            {
                "cs_content": " The higher one",
                "cs_id": 8,
                "ct_content": "Yep, you write the UNI of the student whose answer you'd like to substitute in place of your own.",
                "ct_id": 3,
                "us_name": "Ivy Chen",
                "ut_name": "Ivy Chen"
            }
        ]
    }

ReactDOM.render(<App/>, document.getElementById('container'));

