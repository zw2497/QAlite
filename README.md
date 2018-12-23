# QALite
This project combines w4111 Database with e6156 Microservices in Columbia University.

## 1. Project Description 
![](./doc/intro.gif)

I would like to implement a Piazza on our own. Student can interact with instructors with Posts. One of the functions we want to add is *Votes*. Further, we will reorder the *post list*  and *answer list* by this score like Reddit. This project will include entities such as *Post, Comment, User, Course, Vote, Instructor, Student* and so on. *User* can be *instructor and Student*.  *Post* have attributes such as *Content, Views, Thank_Number, Status*. Course will have some attributes such as *Number, Term, Name*. We will make up our own data by conversing content from piazza and inserting some random users. User can also enrolled in many courses. They can reply to comments and posts, add questions to their favorite and vote for the questions they think is valuable. Specific user can pin questions or comments and choose whether questions are resolved.

## 2. SQL schema
```
CREATE TABLE users(
id        SERIAL PRIMARY KEY,
email       text NOT NULL,
password    text NOT NULL,
name        text NOT NULL
);

CREATE TABLE courses(
id        SERIAL PRIMARY KEY,
name        text NOT NULL,
create_time timestamp NOT NULL,
creator_id  int NOT NULL REFERENCES users (id),
description text
);

CREATE TYPE enroll_type AS ENUM ('instructor', 'student');
CREATE TABLE enroll(
u_id     int REFERENCES users(id),
c_id      int REFERENCES courses(id),
type        enroll_type NOT NULL,
PRIMARY KEY (u_id, c_id)
);

CREATE TABLE terms(
id        SERIAL PRIMARY KEY,
semester    text NOT NULL,
year        int NOT NULL
);

CREATE TABLE offer(
id        SERIAL PRIMARY KEY,
c_id   int NOT NULL REFERENCES courses(id),
t_id     int NOT NULL REFERENCES terms(id),
UNIQUE (c_id, t_id)
);

CREATE TYPE resolve_type    AS ENUM ('resolved', 'unresolved');
CREATE TYPE public_type     AS ENUM ('public', 'private');
CREATE TYPE pin_type        AS ENUM ('pinned', 'unpinned');
CREATE TYPE post_type   AS ENUM ('question', 'note');
CREATE TABLE questions(
id        SERIAL PRIMARY KEY,
u_id  int NOT NULL REFERENCES users(id),
c_id      int NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
create_time timestamp NOT NULL,
solved_type resolve_type,
public_type public_type NOT NULL,
views       int DEFAULT 1,
title       text NOT NULL,
content     text,
update_time timestamp NOT NULL,
pin         pin_type NOT NULL DEFAULT 'unpinned',
type      post_type NOT NULL
);

CREATE TABLE comments(
id        SERIAL,
create_time timestamp NOT NULL,
creator_id  int NOT NULL REFERENCES users (id),
content     text NOT NULL,
q_id        int,
FOREIGN KEY (q_id) REFERENCES questions(id) ON DELETE CASCADE,
PRIMARY KEY (id, q_id)
);

CREATE TABLE reply( 
source int,
source_qid int,
target int,
target_qid int,
FOREIGN KEY (source, source_qid) REFERENCES comments (id, q_id),
FOREIGN KEY (target, target_qid) REFERENCES comments (id, q_id),
PRIMARY KEY (source, source_qid, target, target_qid),
CHECK (source_qid=target_qid)
);

CREATE TYPE vote_type        AS ENUM ('up', 'down');
CREATE TABLE vote_question(
q_id int NOT NULL,
c_id int NOT NULL,
FOREIGN KEY (q_id) REFERENCES questions (id),
u_id int NOT NULL REFERENCES users (id),
vote vote_type NOT NULL,
PRIMARY KEY (q_id, u_id)
);
```

## 3. Run some queries
#### Display the number of comments for every question which have more than one comment
```
SELECT q.q_id AS questionid, q.title AS title, Count(*) AS comment_num
FROM comments AS c, question_belong_ask AS q
WHERE c.q_id = q.q_id
GROUP BY q.q_id, q.org_id
Having Count(*) > 0
ORDER BY q.q_id
```

#### Display all replies in piazza
```
SELECT us.name AS sourcename, cs.content AS sourcecontent, ut.name AS targetname, ct.content AS targetcontent, q.title AS question
FROM users AS us, comments AS cs, reply AS r, comments AS ct, users AS ut, question_belong_ask AS q
WHERE us.u_id = cs.creator_id AND ut.u_id = ct.creator_id AND cs.c_id = r.source AND cs.q_id = r.source_qid AND ct.c_id = target AND ct.q_id = target_qid AND r.source_qid = q.q_id
```

#### Display number of questions which has comments but still is unresolved
```
select count(distinct q.q_id)
from question_belong_ask AS q
where q.q_id in(SELECT q.q_id AS questionid
FROM comments AS c, question_belong_ask AS q
WHERE c.q_id = q.q_id and q.solved_type = 'unresolved')
```

## 4. Updates
* Modified the comment table so that it has a partial key, primary key (c_id, p_id), because it is a weak entity of questions.
* Modified the reply table to make sure comment reply to comment and both of them belongs to the same question
* Separated multiple relations between user and organization
* User can enroll in any organization as an instructor or a student.
* Deleted up number and down number, because it can be calculated from vote table
* Modified Tag table, add primary key t_id
