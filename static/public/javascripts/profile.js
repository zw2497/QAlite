var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
    /** @type {!HTMLInputElement} */document.getElementById('autocomplete'), { types: ['geocode'] });

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

var Profile = function (_React$Component) {
    _inherits(Profile, _React$Component);

    function Profile(props) {
        _classCallCheck(this, Profile);

        var _this = _possibleConstructorReturn(this, (Profile.__proto__ || Object.getPrototypeOf(Profile)).call(this, props));

        _this.state = {};
        _this.handleSubmit = _this.handleSubmit.bind(_this);
        return _this;
    }

    _createClass(Profile, [{
        key: 'handleSubmit',
        value: function handleSubmit(event) {
            // axios.post('/user/profile', {
            //     email: this.state.email,
            //     password: this.state.password
            // })
            //     .then(
            //
            //     ).bind(this)
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(Inputgroup, null);
        }
    }]);

    return Profile;
}(React.Component);

var Inputgroup = function (_React$Component2) {
    _inherits(Inputgroup, _React$Component2);

    function Inputgroup(props) {
        _classCallCheck(this, Inputgroup);

        var _this2 = _possibleConstructorReturn(this, (Inputgroup.__proto__ || Object.getPrototypeOf(Inputgroup)).call(this, props));

        _this2.state = {
            n: 3,
            data: {}
        };
        _this2.fetchprofile();

        _this2.fetchprofile = _this2.fetchprofile.bind(_this2);
        _this2.addrow = _this2.addrow.bind(_this2);
        _this2.handlechange = _this2.handlechange.bind(_this2);
        _this2.submit = _this2.submit.bind(_this2);
        return _this2;
    }

    _createClass(Inputgroup, [{
        key: 'addrow',
        value: function addrow() {
            var n = this.state.n;
            this.setState({ n: n + 1 });
        }
    }, {
        key: 'fetchprofile',
        value: function fetchprofile() {
            var data = this.state.data;

            axios.get("", {
                headers: { 'Credential': window.localStorage.getItem("Credential"), 'Content-Type': 'application/json' }
            }).then(function (res) {
                console.log(res);
                if (res.data.data.profile !== undefined) {
                    var addr = res.data.data.profile.Address;
                    for (var _i = 0; _i < addr.length; _i++) {
                        var addressType = addr[_i].types[0];
                        if (componentForm[addressType]) {
                            var val = addr[_i][componentForm[addressType]];
                            document.getElementById(addressType).value = val;
                        }
                    }
                    var comm = res.data.data.profile;
                    var idlist = ['inputGroup-phone', 'inputGroup-firstname', 'inputGroup-lastname'];
                    var keylist = ['Phone', 'firstname', 'lastname'];
                    console.log(comm);
                    for (var i = 0; i < 3; i++) {
                        var id = idlist[i];
                        var val1 = comm[keylist[i]];
                        console.log(id);
                        console.log(val1);
                        document.getElementById(id).value = val1;
                        data[keylist[i]] = val1;
                    }
                    this.setState({ data: data });
                }
            }.bind(this));
        }
    }, {
        key: 'submit',
        value: function submit() {
            var data = this.state.data;
            data["Address"] = place.address_components;
            console.log(data);
            axios.post("", {
                data: data
            }, {
                headers: { 'Credential': window.localStorage.getItem("Credential"), 'Content-Type': 'application/json' }
            }).then(function (res) {
                console.log(res);
                window.location.replace(env + "/profile.html");
            }.bind(this));
        }
    }, {
        key: 'handlechange',
        value: function handlechange(event) {
            var data = this.state.data;
            data[event.target.name] = event.target.value;
            this.setState({ data: data });
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


    }, {
        key: 'render',
        value: function render() {

            return React.createElement(
                'div',
                null,
                React.createElement(Loading, null),
                React.createElement(InputRow, { handlechange: this.handlechange }),
                React.createElement(GoogleAddress, { handlechange: this.handlechange }),
                React.createElement(
                    'button',
                    { className: 'btn btn-outline-success', onClick: this.submit },
                    'Submit'
                )
            );
        }
    }]);

    return Inputgroup;
}(React.Component);

var Loading = function (_React$Component3) {
    _inherits(Loading, _React$Component3);

    function Loading(props) {
        _classCallCheck(this, Loading);

        var _this3 = _possibleConstructorReturn(this, (Loading.__proto__ || Object.getPrototypeOf(Loading)).call(this, props));

        _this3.state = { n: 0 };

        _this3.tick = _this3.tick.bind(_this3);
        return _this3;
    }

    _createClass(Loading, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this4 = this;

            this.timerID = setInterval(function () {
                return _this4.tick();
            }, 100);
        }
    }, {
        key: 'tick',
        value: function tick() {
            console.log("in");
            var n = this.state.n;
            if (n < 200) {
                n = n + 50;
            } else {
                clearInterval(this.timerID);
            }
            this.setState({
                n: n
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var load = [];
            var n = this.state.n;
            if (n < 200) {
                load.push(React.createElement(
                    'div',
                    { className: "progress", key: "1" },
                    React.createElement(
                        'div',
                        { className: "progress-bar progress-bar-striped", role: 'progressbar', style: { "width": n + "%" },
                            'aria-valuenow': '10', 'aria-valuemin': '0', 'aria-valuemax': '100' },
                        'Loading...'
                    )
                ));
            }

            return React.createElement(
                'div',
                null,
                load
            );
        }
    }]);

    return Loading;
}(React.Component);

function GoogleAddress(props) {
    return React.createElement(
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
                    { className: 'input-group-text', id: 'inputGroup-sizing-default' },
                    'Address'
                )
            ),
            React.createElement('input', { type: 'text', id: 'autocomplete', name: "Address", onChange: props.handlechange, placeholder: 'Enter your address', className: 'form-control', 'aria-label': 'Sizing example input', 'aria-describedby': 'inputGroup-sizing-default' })
        ),
        React.createElement(
            'table',
            { id: 'address' },
            React.createElement(
                'tbody',
                null,
                React.createElement(
                    'tr',
                    null,
                    React.createElement(
                        'td',
                        { className: 'label' },
                        'Street address'
                    ),
                    React.createElement(
                        'td',
                        { className: 'slimField' },
                        React.createElement('input', { className: 'field', id: 'street_number', disabled: true })
                    ),
                    React.createElement(
                        'td',
                        { className: 'wideField', colSpan: 2 },
                        React.createElement('input', { className: 'field', id: 'route', disabled: true })
                    )
                ),
                React.createElement(
                    'tr',
                    null,
                    React.createElement(
                        'td',
                        { className: 'label' },
                        'City'
                    ),
                    React.createElement(
                        'td',
                        { className: 'wideField', colSpan: 3 },
                        React.createElement('input', { className: 'field', id: 'locality', disabled: true })
                    )
                ),
                React.createElement(
                    'tr',
                    null,
                    React.createElement(
                        'td',
                        { className: 'label' },
                        'State'
                    ),
                    React.createElement(
                        'td',
                        { className: 'slimField' },
                        React.createElement('input', { className: 'field', id: 'administrative_area_level_1',
                            disabled: true })
                    ),
                    React.createElement(
                        'td',
                        { className: 'label' },
                        'Zip code'
                    ),
                    React.createElement(
                        'td',
                        { className: 'wideField' },
                        React.createElement('input', { className: 'field', id: 'postal_code', disabled: true })
                    )
                ),
                React.createElement(
                    'tr',
                    null,
                    React.createElement(
                        'td',
                        { className: 'label' },
                        'Country'
                    ),
                    React.createElement(
                        'td',
                        { className: 'wideField', colSpan: 3 },
                        React.createElement('input', { className: 'field', id: 'country', disabled: true })
                    )
                )
            )
        )
    );
}

function InputRow(props) {
    return React.createElement(
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
                    { className: 'input-group-text', id: 'inputGroup-phone-span' },
                    'Phone'
                )
            ),
            React.createElement('input', { onChange: props.handlechange, id: 'inputGroup-phone', name: "Phone", type: 'text', className: 'form-control', 'aria-label': 'Sizing example input', 'aria-describedby': 'inputGroup-sizing-default' })
        ),
        React.createElement(
            'div',
            { className: 'input-group mb-3' },
            React.createElement(
                'div',
                { className: 'input-group-prepend' },
                React.createElement(
                    'span',
                    { className: 'input-group-text', id: 'inputGroup-firstname-span' },
                    'First Name'
                )
            ),
            React.createElement('input', { onChange: props.handlechange, id: 'inputGroup-firstname', name: "firstname", type: 'text', className: 'form-control', 'aria-label': 'Sizing example input', 'aria-describedby': 'inputGroup-sizing-default' })
        ),
        React.createElement(
            'div',
            { className: 'input-group mb-3' },
            React.createElement(
                'div',
                { className: 'input-group-prepend' },
                React.createElement(
                    'span',
                    { className: 'input-group-text', id: 'inputGroup-lastname-span' },
                    'Last Name'
                )
            ),
            React.createElement('input', { onChange: props.handlechange, id: 'inputGroup-lastname', name: "lastname", type: 'text', className: 'form-control', 'aria-label': 'Sizing example input', 'aria-describedby': 'inputGroup-sizing-default' })
        )
    );
}

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

ReactDOM.render(React.createElement(Profile, null), document.getElementById('profile'));