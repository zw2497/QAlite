import os
import jwt
from flask import Flask,g,request
from flask import jsonify



def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    from . import db
    @app.before_request
    def before_request():
        try:
            g.conn = db.conn(db.create())
        except:
            g.conn = None

    @app.teardown_request
    def teardown_request(exception):
        try:
            db.disconn(g.conn)
        except Exception as e:
            pass


    @app.route('/', methods=['POST', 'GET'])
    def classinfo():
        db = g.conn

        # result = g.conn.execute("select * from users").fetchall()
        # p = {}
        # for i, j in enumerate(result):
        #     p[i] = j['name']

        # p = "INSERT INTO users (email, password, name) VALUES (%s, %s, %s)"
        # result = db.execute(p, ("zw2497@columbia.edu", "123456", "wzc"))

        p = "SELECT name FROM users WHERE email = %s"
        result = db.execute(p, ("zw2497@columbia.edu")).fetchone()
        return jsonify(body=result['name'])


    @app.route('/register', methods=['POST', 'GET'])
    def register():
        if request.method == 'POST':
            email = request.json['email']
            password = request.json['password']
            name = request.json['name']

            if (not email or not password):
                return jsonify(body="Email or password is incorrect", code=0)

            db = g.conn

            error = None

            """
            check if the user is exist
            """
            p = "SELECT name FROM users WHERE email = %s"
            result = db.execute(p,(email)).fetchone()

            if result is not None:
                error = 'User: {} is already registered.'.format(email)
                return jsonify(body=error, code=0)

            """
            insert user
            """
            if error is None:
                p = "INSERT INTO users (email, password, name) VALUES (%s, %s, %s)"
                result = db.execute(p, (email, password, name))

            return jsonify(body="success login", code=1)

    @app.route('/login', methods=['POST', 'GET'])
    def login():
        if request.method == 'POST':
            email = request.json['email']
            password = request.json['password']

            """
            check null
            """
            if (not email or not password):
                return jsonify(body="Email or password is incorrect", code=0)

            """
            check password
            """
            db = g.conn

            p = "SELECT * FROM users WHERE email = %s"
            result = db.execute(p, (email)).fetchone()

            if password == result['password']:
                try:
                    payload = {
                        'user_id': result['u_id'],
                        'email': result['email']
                    }

                    token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
                except Exception as e:
                    return jsonify(status=401, msg="invalid", code=0)

                """
                login success, return token
                """
                return jsonify(token=str(token), code=1)

            """
            return error
            """
            return jsonify(body="Email or password is incorrect", code=0)







    @app.route('/course')
    def course():
        result = g.conn.execute("select * from users").fetchall()
        p = {}
        for i, j in enumerate(result):
            p[i] = j['email']
        return jsonify(body=p)

    @app.route('/user')
    def user():
        return jsonify(body='user!')

    return app
