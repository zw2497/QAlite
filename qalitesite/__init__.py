import os
import jwt
from flask import Flask,g,request,redirect, json, Response
from flask import jsonify
from flask_cors import CORS
from google.oauth2 import id_token
from google.auth.transport import requests as requestgoogle
import boto3

def snsemail(email, type="register", course="N/A"):
    sns = boto3.resource('sns', region_name='us-east-2')
    topic = sns.Topic('arn:aws:sns:us-east-2:064845973938:ElasticBeanstalkNotifications-Environment-6156-env')
    response = topic.publish(
        Message='SNS has been triggered',
        Subject='new trigger',
        MessageAttributes={
            "email": {
                'DataType': 'String',
                "StringValue": email
            },
            "type": {
                'DataType': 'String',
                "StringValue": type
            },
            "course": {
                'DataType': 'String',
                "StringValue": course
            }
        }
    )
    return response

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
            token = request.headers.get('Credential').encode()
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

        p = "SELECT * FROM test"
        result = db.execute(p).fetchall()
        res = [dict(r) for r in result]

        return jsonify(test=res, code=1)


    @app.route('/user/register', methods=['POST', 'GET'])
    def register():
        if request.method == 'POST':
            email = request.json['email']
            password = request.json['password']
            name = request.json['name']

            if (not email or not password):
                return jsonify(body="Email or password is incorrect", code=0)

            if (" " in email or " " in password or ' ' in name):
                return jsonify(body="Email or password contain invalid characters", code=0)

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
                try:
                    payload = {'password':password}
                    encodepassword = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256').decode()
                except Exception as e:
                    return jsonify(status=401, msg="invalid", code=0)

                p = "INSERT INTO users (email, password, name, status) VALUES (%s, %s, %s, FALSE)"

                try:
                    result = db.execute(p, (email, encodepassword, name))
                except:
                    return jsonify(status=401, msg="invalid", code=0)


            p = "SELECT * FROM users WHERE email = %s"
            result = db.execute(p, (email)).fetchone()

            snsemail(email)

            try:
                payload = {
                    'u_id': result['id'],
                    'email': result['email']
                }

                token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256').decode()
            except Exception as e:
                return jsonify(status=401, msg="invalid", code=0)

            """
            login success, return token
            """
            return jsonify(token=token, code=1)


    @app.route('/user/login', methods=['POST', 'GET'])
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

            try:
                payload = {'password': password}
                token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256').decode()
            except Exception as e:
                return jsonify(status=401, msg="invalid", code=0)

            """
            check no email
            """
            if not result:
                return jsonify(body="Email or password is incorrect", code=0)

            if token == result['password']:
                try:
                    payload = {
                        'u_id': result['id'],
                        'email': result['email']
                    }

                    token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256').decode()
                except Exception as e:
                    return jsonify(status=401, msg="invalid", code=0)

                """
                login success, return token
                """
                return jsonify(token=token, code=1)

            """
            return error
            """
            return jsonify(body="Email or password is incorrect", code=0)


    @app.route('/class')
    def course():
        u_id = g.u_id
        db = g.conn

        p = "SELECT c.id as o_id, c.name as o_name, c.create_time, u.name as creator  " \
            "FROM enroll e INNER JOIN courses c " \
            "ON e.c_id = c.id " \
            "INNER JOIN users u ON c.creator_id = u.id " \
            "where e.u_id = %s;"
        res= {}
        result = db.execute(p, (u_id)).fetchall()
        if not result:
            return jsonify(msg="no registered class",code=0)
        res = [dict(r) for r in result]

        return jsonify(classinfo=res, code = 1)

    @app.route('/allclass', methods=['POST', 'GET'])
    def allcourse():
        db = g.conn
        search = request.json['search']

        p = "SELECT c.id, c.name as o_name, c.create_time " \
            "FROM courses c " \
            "WHERE c.name LIKE %s "
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

        p = "insert into enroll (u_id, c_id, type) values (%s,%s,'student')"
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


        p = "SELECT * FROM questions WHERE c_id = %s ORDER BY create_time DESC;"
        res = {}
        result = db.execute(p, (o_id)).fetchall()
        res = [dict(r) for r in result]

        return jsonify(question=res,code = 1)

    @app.route('/comment', methods=['POST', 'GET'])
    def comment():
        db = g.conn
        """
        attr from request
        # """
        o_id = request.json['o_id']
        q_id = request.json['q_id']

        p = "select cs.id as cs_id, ct.id as ct_id, cs.content as cs_content, ct.content as ct_content, " \
            "us.name as us_name, ut.name as ut_name " \
            "from comments cs  " \
            "left outer join reply r " \
            "on cs.id = r.source " \
            "left outer join comments ct " \
            "on r.target = ct.id " \
            "left outer join users us " \
            "on cs.creator_id = us.id " \
            "left outer join users ut " \
            "on ct.creator_id = ut.id " \
            "left outer join questions q " \
            "on cs.q_id = q.id " \
            "where cs.q_id = %s and q.c_id = %s " \
            "order by cs.create_time "

        res = {}
        result = db.execute(p, (q_id, o_id)).fetchall()
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

            p = "select * from users as u inner join enroll as e on u.id = e.u_id where u.id = %s and e.c_id = %s;"
            result = db.execute(p, (u_id, o_id)).fetchall()
            if not result:
                return jsonify(msg="user dose not enroll in this class", code=0)

            p = "INSERT INTO questions (u_id, c_id, create_time,update_time , solved_type, public_type, title, content, type) VALUES (%s, %s, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, %s, %s, %s,%s,%s)"
            result = db.execute(p, (u_id, o_id, solve , p_type, title, content,q_type))

            return jsonify(classinfo=str(result), code = 1)

    @app.route('/newcomment', methods=['POST', 'GET'])
    def newcomment():
        if request.method == 'POST':
            db = g.conn
            u_id = g.u_id
            try:
                o_id = request.json['o_id']
                q_id = request.json['q_id']
                t_cid = request.json['t_cid']
                content = request.json['content']
                p = "select * from users as u inner join enroll as e on u.id = e.u_id where u.id = %s and e.c_id = %s;"
                result = db.execute(p, (u_id, o_id)).fetchall()
                if not result:
                    return jsonify(msg="user dose not enroll in this class", code=0)

                p = "INSERT INTO comments(create_time, creator_id, content, q_id) VALUES (CURRENT_TIMESTAMP, %s, %s, %s)"
                result = db.execute(p, (u_id, content, q_id))

                if (t_cid != '-1'):
                    p = "select creator_id from comments where id = %s"
                    result3 = db.execute(p, (t_cid)).fetchone()


                    p = "select email from users where id = %s"
                    result1 = db.execute(p, (result3['creator_id'])).fetchone()

                    p = "select name from courses where id = %s"
                    result2 = db.execute(p, (o_id)).fetchone()

                    print(result1['email'], "reply", result2['name']);
                    snsemail(result1['email'], "reply", result2['name'])

                    p = "select last_value from comments_id_seq"
                    result = db.execute(p).fetchone()
                    s_cid = result['last_value']

                    p = "INSERT INTO reply (source, source_qid, target, target_qid) VALUES (%s,%s,%s,%s)"
                    result = db.execute(p, (s_cid, q_id, t_cid, q_id))


                return jsonify(msg=str(result), code = 1)
            except:
                return jsonify(msg="Failed", code=0)

    @app.route('/createcourse', methods=['POST', 'GET'])
    def createcourse():
        if request.method == 'POST':
            db = g.conn
            u_id = g.u_id
            name = request.json['courseName']
            description = request.json['description']
            termyear = request.json['termyear']
            termsemester = request.json['termsemester']

            try:
                p = "insert into courses(name, create_time, creator_id, description) values (%s,CURRENT_TIMESTAMP,%s,%s) "
                result = db.execute(p, (name,u_id,description))

                p = "select last_value from courses_id_seq"
                result = db.execute(p).fetchone()
                o_id = result['last_value']

                p = "select id from terms as t where t.semester = %s and t.year = %s"
                result = db.execute(p,(termsemester, termyear)).fetchone()
                t_id = result['id']

                p = "insert into offer (c_id, t_id) values (%s,%s)"
                result = db.execute(p, (o_id, t_id))

                p = "insert into enroll (u_id, c_id, type) values (%s,%s,'instructor')"
                result = db.execute(p, (u_id, o_id))
            except:
                return jsonify(msg="Failed, unknown reason", code=0)
            else:
                return jsonify(msg="Create success", code=1)

    @app.route('/user', methods=['GET'])
    def user():
        db = g.conn
        u_id = g.u_id

        try:
            p = "select * from users where id = %s"
            result = db.execute(p, (u_id)).fetchone()
            return jsonify(name=str(result['name']), status=str(result['status']), code=1)
        except:
            return jsonify(status=401, msg="invalid", code=0)



    @app.route('/user/google', methods=('GET', 'POST'))
    def google():
        db = g.conn
        CLIENT_ID = "1076764154881-jq0lgjdbeje9b5tsucimo3l8p48uen0v.apps.googleusercontent.com"
        token = request.json['idtoken']

        idinfo = id_token.verify_oauth2_token(token, requestgoogle.Request(), CLIENT_ID)

        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            return jsonify(status=401, msg="invalid", code=0)

        email = idinfo['email']
        password = "googlezw2497"

        '''
        check if it exist this email
        '''
        p = "SELECT * FROM users WHERE email = %s"
        result = db.execute(p,(email)).fetchone()

        if not result:
            try:
                payload = {'password':password}
                encodepassword = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256').decode()
            except Exception as e:
                return jsonify(status=401, msg="invalid", code=0)

            p = "INSERT INTO users (email, password, name, status) VALUES (%s, %s, %s, TRUE)"

            try:
                result = db.execute(p, (email, encodepassword, email))
            except:
                return jsonify(status=401, msg="invalid", code=0)


        p = "SELECT * FROM users WHERE email = %s"
        result = db.execute(p, (email)).fetchone()

        try:
            payload = {
                'u_id': result['id'],
                'email': result['email']
            }

            token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256').decode()
        except Exception as e:
            return jsonify(status=401, msg="invalid", code=0)

        """
        login success, return token
        """
        return jsonify(token=token, code=1)

    @app.route('/user/confirm')
    def confirm_email():
        db = g.conn
        token = request.args.get("context")
        try:
            payload = jwt.decode(token, 'dev', algorithms='HS256')
            email = payload['email']
        except:
            return jsonify(status=401, msg="invalid", code=0)

        id = db.execute(
            'SELECT id FROM users WHERE email = %s', (email,)
        ).fetchone()

        if id is not None:
            db.execute(
                'UPDATE users SET status = TRUE WHERE email = %s', (email,)
            )
        else:
            return jsonify(status=401, msg="invalid", code=0)

        return redirect("http://localhost:3000/class.html")



    @app.route('/hello')
    def hello():
        c = 5
        if (c == 2):
            c = 3
        return "hello world"

    return app