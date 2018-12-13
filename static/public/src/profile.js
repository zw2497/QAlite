axios.defaults.baseURL = 'https://k3pw9p8ybg.execute-api.us-east-2.amazonaws.com/default/6156task2';
var env = window.location.protocol + "//" + window.location.host;


// axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.headers.post['Content-Type'] = 'application/json';

// This example displays an address form, using the autocomplete feature
// of the Google Places API to help users fill in the information.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

document.getElementById("home").href = env + "/class.html";

var placeSearch, autocompletem, place;
var componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
};

function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
        {types: ['geocode']});

    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
    // Get the place details from the autocomplete object.
    place = autocomplete.getPlace();

    console.log(place.address_components);

    for (var component in componentForm) {
        document.getElementById(component).value = '';
        document.getElementById(component).disabled = false;
    }

    // Get each component of the address from the place details
    // and fill the corresponding field on the form.
    for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (componentForm[addressType]) {
            var val = place.address_components[i][componentForm[addressType]];
            document.getElementById(addressType).value = val;
        }
    }
}

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        // axios.post('/user/profile', {
        //     email: this.state.email,
        //     password: this.state.password
        // })
        //     .then(
        //
        //     ).bind(this)
    }

    render() {
        return (
            <Inputgroup/>
        )
    }
}

class Inputgroup extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            n:3,
            data:{}
        }
        this.fetchprofile();



        this.fetchprofile=this.fetchprofile.bind(this);
        this.addrow=this.addrow.bind(this);
        this.handlechange=this.handlechange.bind(this);
        this.submit=this.submit.bind(this);
    }

    addrow() {
        const n = this.state.n;
        this.setState({n:n + 1})


    }

    fetchprofile() {
        let data = this.state.data;

        axios.get("",{
            headers: {'Credential': window.localStorage.getItem("Credential"), 'Content-Type': 'application/json'}
        }).then(function (res) {
            console.log(res)
            if (res.data.data.profile !== undefined){
                const addr = res.data.data.profile.Address
                for (let i = 0; i < addr.length; i++) {
                    var addressType = addr[i].types[0];
                    if (componentForm[addressType]) {
                        var val = addr[i][componentForm[addressType]];
                        document.getElementById(addressType).value = val;
                    }
                }
                const comm = res.data.data.profile;
                const idlist = ['inputGroup-phone', 'inputGroup-firstname','inputGroup-lastname']
                const keylist = ['Phone', 'firstname','lastname']
                console.log(comm);
                for (var i = 0; i < 3; i ++) {
                    var id = idlist[i];
                    var val1 = comm[keylist[i]];
                    console.log(id);
                    console.log(val1);
                    document.getElementById(id).value = val1;
                    data[keylist[i]] = val1
                }
                this.setState({data: data})
            }




        }.bind(this))
    }

    submit() {
        let data = this.state.data;
        data["Address"] = place.address_components;
        console.log(data)
        axios.post("",{
            data:data
        },{
            headers: {'Credential': window.localStorage.getItem("Credential"), 'Content-Type': 'application/json'}
        }).then(function (res) {
            console.log(res)
            window.location.replace(env + "/profile.html");
        }.bind(this))
    }

    handlechange(event){
        const data = this.state.data;
        data[event.target.name] = event.target.value
        this.setState({data: data})
    }

    // componentDidMount() {
    //     autocomplete = new google.maps.places.Autocomplete(
    //         /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
    //         {types: ['geocode']});
    //
    //     // When the user selects an address from the dropdown, populate the address
    //     // fields in the form.
    //     autocomplete.addListener('place_changed', fillInAddress);
    // }



    render() {

        return (
            <div>
                <Loading/>
                <InputRow handlechange={this.handlechange}/>
                <GoogleAddress handlechange={this.handlechange}/>
                <button className="btn btn-outline-success" onClick={this.submit} >Submit</button>
            </div>
            )

    }
}

class Loading extends React.Component {
    constructor(props){
        super(props);
        this.state={n:0}

        this.tick=this.tick.bind(this)
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            100
        );
    }

    tick() {
        console.log("in")
        let n = this.state.n
        if (n < 200) {
            n = n + 50
        } else {
            clearInterval(this.timerID);
        }
        this.setState({
            n: n
        });
    }

    render(){
        let load = []
        const n = this.state.n
        if (n < 200) {
            load.push(
                <div className={"progress"} key={"1"}>
                <div className={"progress-bar progress-bar-striped"} role="progressbar" style={{"width": n + "%"}}
                     aria-valuenow="10" aria-valuemin="0" aria-valuemax="100">Loading...</div>
                </div>
            )
        }


        return (
            <div>
            {load}
            </div>

        )
    }


}

function GoogleAddress(props) {
    return (
        <div>
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-default">Address</span>
                </div>
                <input type="text" id="autocomplete" name={"Address"} onChange={props.handlechange} placeholder="Enter your address" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
            </div>
            <table id="address">
                <tbody>
                <tr>
                    <td className="label">Street address</td>
                    <td className="slimField"><input className="field" id="street_number" disabled={true}/></td>
                    <td className="wideField" colSpan={2}><input className="field" id="route" disabled={true}/></td>
                </tr>
                <tr>
                    <td className="label">City</td>
                    <td className="wideField" colSpan={3}><input className="field" id="locality" disabled={true}/></td>
                </tr>
                <tr>
                    <td className="label">State</td>
                    <td className="slimField"><input className="field" id="administrative_area_level_1"
                                                     disabled={true}/></td>
                    <td className="label">Zip code</td>
                    <td className="wideField"><input className="field" id="postal_code" disabled={true}/></td>
                </tr>
                <tr>
                    <td className="label">Country</td>
                    <td className="wideField" colSpan={3}><input className="field" id="country" disabled={true}/></td>
                </tr>
                </tbody>
            </table>
        </div>
    )
}

function InputRow(props) {
    return (
        <div>
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-phone-span">Phone</span>
                </div>
                <input onChange={props.handlechange} id="inputGroup-phone" name={"Phone"} type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
            </div>
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-firstname-span">First Name</span>
                </div>
                <input onChange={props.handlechange} id="inputGroup-firstname" name={"firstname"} type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
            </div>
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-lastname-span">Last Name</span>
                </div>
                <input onChange={props.handlechange} id="inputGroup-lastname" name={"lastname"} type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
            </div>

        </div>

    )
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
    <Profile />,
    document.getElementById('profile')
);