def get_title(classid):
    alltitle = connection.execute("select title from question_belong_ask as q inner join courses as c on c.course_id = q.org_id where c.course_id = ?",classid)
    return alltitle

def get_username(email):
    username = connection.execute("select name from users where email = ?", email)
    return username

def get_question_detail(q_id):
    question_detail = connection.execute("select * from question_belong_ask where q_id = ?", q_id)
    return question_detail

def get_comment(q_id):
    comments = connection.execute("select * from comments where q_id = ?", q_id)
    return comments
