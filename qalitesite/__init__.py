import os
import jwt
from flask import Flask,g,request
from flask import jsonify
from flask_cors import CORS
import datetime



def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    CORS(app)

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
        """
        connect db and retreive uid from token
        :return: g.conn
        """
        try:
            g.conn = db.conn(db.create())
        except:
            g.conn = None
            return jsonify(status=401, msg="db connection failed", code=0)

        if not request.headers.get('Credential'):
            g.u_id = None
        else:
            token = request.headers.get('Credential')[2:-1].encode()
            try:
                payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms='HS256')
            except:
                return jsonify(status=401, msg="invalid access", code=0)

            g.u_id = payload["u_id"]




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
            p = "SELECT * FROM users WHERE email = %s"
            result = db.execute(p,(email)).fetchone()

            if result is not None:
                error = 'User: {} has already been registered.'.format(email)
                return jsonify(body=error, code=0)

            """
            insert user
            """
            if error is None:
                p = "INSERT INTO users (email, password, name) VALUES (%s, %s, %s)"
                result = db.execute(p, (email, password, name))

            return jsonify(body="Register success", code=1)

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

            """
            check no email
            """
            if not result:
                return jsonify(body="Email or password is incorrect", code=0)

            if password == result['password']:
                try:
                    payload = {
                        'u_id': result['u_id'],
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


    @app.route('/class')
    def course():
        u_id = g.u_id
        db = g.conn

        p = "SELECT o.o_id, o.name as o_name, o.create_time, u.name as creator  " \
            "FROM enroll e INNER JOIN organizations_create o " \
            "ON e.org_id = o.o_id " \
            "INNER JOIN users u ON o.creator_id = u.u_id " \
            "where e.user_id = %s;"
        res= {}
        result = db.execute(p, (u_id)).fetchall()
        if not result:
            return jsonify(msg=str(request),code=0)
        res = [dict(r) for r in result]

        return jsonify(classinfo=res, code = 1)

    @app.route('/allclass', methods=['POST', 'GET'])
    def allcourse():
        db = g.conn
        search = request.json['search']

        p = "SELECT o.o_id, o.name as o_name, o.create_time " \
            "FROM organizations_create o " \
            "WHERE o.name LIKE %s "
        res= {}
        result = db.execute(p,('%' + search + '%')).fetchall()
        if not result:
            return jsonify(msg=str(request),code=0)
        res = [dict(r) for r in result]

        return jsonify(classinfo=res, code = 1)

    @app.route('/addclass', methods=['POST', 'GET'])
    def addcourse():
        db = g.conn
        u_id = g.u_id
        o_id = request.json['o_id']

        p = "insert into enroll (user_id, org_id, type) values (%s,%s,'student')"
        try:
            result = db.execute(p,(u_id,o_id))
        except:
            return jsonify(msg="add failed",code=0)
        else:
            return jsonify(msg="add success", code = 1)

    @app.route('/question', methods=['POST', 'GET'])
    def question():
        db = g.conn
        o_id = request.json['o_id']
        """
        attr from request
        """


        p = "SELECT * FROM question_belong_ask WHERE org_id = %s ORDER BY create_time DESC;"
        res = {}
        result = db.execute(p, (o_id)).fetchall()
        for i, j in enumerate(result):
            res[i] = {}
            res[i]['q_id'] = j['q_id']
            res[i]['creator_id'] = j['creator_id']
            res[i]['create_time'] = j['create_time']
            res[i]['solved_type'] = j['solved_type']
            res[i]['public_type'] = j['public_type']
            res[i]['views'] = j['views']
            res[i]['title'] = j['title']
            res[i]['content'] = j['content']
            res[i]['update_time'] = j['update_time']
            res[i]['pin'] = j['pin']
            res[i]['tag_id'] = j['tag_id']
            res[i]['q_type'] = j['q_type']
        return jsonify(question=res,code = 1)

    @app.route('/comment', methods=['POST', 'GET'])
    def comment():
        db = g.conn
        """
        attr from request
        # """
        o_id = request.json['o_id']
        q_id = request.json['q_id']

        p = "select cs.c_id as cs_id, ct.c_id as ct_id, cs.content as cs_content, ct.content as ct_content, " \
            "us.name as us_name, ut.name as ut_name " \
            "from comments cs  " \
            "left outer join reply r " \
            "on cs.c_id = r.target " \
            "left outer join comments ct " \
            "on r.source = ct.c_id " \
            "left outer join users us " \
            "on cs.creator_id = us.u_id " \
            "left outer join users ut " \
            "on ct.creator_id = ut.u_id " \
            "where cs.org_id = %s and cs.q_id = %s"

        res = {}
        result = db.execute(p, (o_id, q_id)).fetchall()
        res = [dict(r) for r in result]

        return jsonify(comments=res,code = 1)

    @app.route('/newpost', methods=['POST', 'GET'])
    def newpost():
        if request.method == 'POST':
            db = g.conn
            u_id = g.u_id

            o_id = request.json['o_id']
            title = request.json['title']
            content = request.json['content']
            solve = 'resolved' if request.json['q_type'] == '0' else 'unresolved'
            p_type = 'public' if request.json['p_type'] == '0' else 'private'
            q_type = 'note' if request.json['q_type'] == '0' else 'question'

            p = "select * from users as u inner join enroll as e on u.u_id = e.user_id where u.u_id = %s and e.org_id = %s;"
            result = db.execute(p, (u_id, o_id)).fetchall()
            if not result:
                return jsonify(msg="user dose not enroll in this class", code=0)

            p = "INSERT INTO question_belong_ask (creator_id, org_id, create_time,update_time , solved_type, public_type, title, content, tag_id, q_type) VALUES (%s, %s, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, %s, %s, %s,%s, %s, %s)"
            result = db.execute(p, (u_id, o_id, solve , p_type, title, content,1,q_type))

            return jsonify(classinfo=str(result), code = 1)

    @app.route('/newcomment', methods=['POST', 'GET'])
    def newcomment():
        if request.method == 'POST':
            db = g.conn
            u_id = g.u_id

            o_id = request.json['o_id']
            title = request.json['title']
            content = request.json['content']
            solve = 'resolved' if request.json['q_type'] == '0' else 'unresolved'
            p_type = 'public' if request.json['p_type'] == '0' else 'private'
            q_type = 'note' if request.json['q_type'] == '0' else 'question'

            p = "select * from users as u inner join enroll as e on u.u_id = e.user_id where u.u_id = %s and e.org_id = %s;"
            result = db.execute(p, (u_id, o_id)).fetchall()
            if not result:
                return jsonify(msg="user dose not enroll in this class", code=0)

            p = "INSERT INTO question_belong_ask (creator_id, org_id, create_time,update_time , solved_type, public_type, title, content, tag_id, q_type) VALUES (%s, %s, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, %s, %s, %s,%s, %s, %s)"
            result = db.execute(p, (u_id, o_id, solve , p_type, title, content,1,q_type))

            return jsonify(classinfo=str(result), code = 1)


    @app.route('/hello')
    def hello():
        c = 5
        if (c == 2):
            c = 3
        return "hello world"

    return app



