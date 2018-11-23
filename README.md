# QALite
The project1 of W4111. Columbia University

## 1. Project Description 
We would like to implement a /Piazza/ on our own and add a few more functions to improve it.  Student can interact with instructors with Posts. One of the functions we want to add is *Votes*. Further, we will reorder the *post list*  and *answer list* by this score like /Reddit/. The other additional function is that we will expand the domain of this tool to *Event Organizer.* This project will include entities such as *Post, Comment, User, Tag, Course, Vote, Instructor, Student* and so on. *User* can be *instructor and Student*.  *Post* have attributes such as *Content, Views, Thank_Number, Status*. Course will have some attributes such as *Number, Term, Name*. We will make up our own data by conversing  content from piazza and inserting some random users. User can also enrolled in many courses. They can reply to comments and posts, add questions to their favorite and vote for the questions they think is valuable. Specific user can pin questions or comments and choose whether questions are resolved.

## 2. Contingency Plan
I will not implement the entities such as *Vote, Organizer, Event*. only implement the basic function of piazza with 4 entities: *User, Course, Post and Comment*.

## 3. SQL schema
```
CREATE TABLE users(
u_id        SERIAL PRIMARY KEY,
email       text NOT NULL,
password    text NOT NULL,
name        text NOT NULL
);

CREATE TYPE o_type AS ENUM ('course', 'event');
CREATE TABLE organizations_create(
o_id        SERIAL PRIMARY KEY,
name        text NOT NULL,
create_time date NOT NULL,
creator_id  int NOT NULL REFERENCES users (u_id),
type        o_type NOT NULL,
description text
);

CREATE TYPE enroll_type AS ENUM ('instructor', 'student');
CREATE TABLE enroll(
user_id     int REFERENCES users (u_id),
org_id      int REFERENCES organizations_create(o_id),
type        enroll_type NOT NULL,
PRIMARY KEY (user_id, org_id)
);

CREATE TABLE terms(
t_id        SERIAL PRIMARY KEY,
semester    text NOT NULL,
year        int NOT NULL
);

CREATE TABLE courses(
course_id   int PRIMARY KEY REFERENCES organizations_create (o_id)
);

CREATE TABLE offer(
o_id        SERIAL PRIMARY KEY,
course_id   int NOT NULL REFERENCES courses (course_id),
term_id     int NOT NULL REFERENCES terms (t_id),
UNIQUE (course_id, term_id)
);

CREATE TABLE events(
event_id    int PRIMARY KEY REFERENCES organizations_create (o_id)
);

CREATE TABLE tags(
t_id        SERIAL PRIMARY KEY,
content     text NOT NULL
);

CREATE TYPE resolve_type    AS ENUM ('resolved', 'unresolved');
CREATE TYPE public_type     AS ENUM ('public', 'private');
CREATE TYPE pin_type        AS ENUM ('pinned', 'unpinned');
CREATE TYPE question_type   AS ENUM ('question', 'note');
CREATE TABLE question_belong_ask(
q_id        serial,
creator_id  int NOT NULL REFERENCES users(u_id),
org_id      int NOT NULL REFERENCES organizations_create(o_id) ON DELETE CASCADE,
create_time timestamp NOT NULL,
solved_type resolve_type,
public_type public_type NOT NULL,
views       int DEFAULT 1,
title       text NOT NULL,
content     text,
update_time timestamp NOT NULL,
pin         pin_type NOT NULL DEFAULT 'unpinned',
tag_id      int NOT NULL REFERENCES tags(t_id),
q_type      question_type NOT NULL,
PRIMARY KEY (q_id, org_id)
);

CREATE TABLE comments(
c_id        serial,
create_time date NOT NULL,
creator_id  int NOT NULL REFERENCES users (u_id),
content     text NOT NULL,
org_id      int,
q_id        int,
FOREIGN KEY (org_id, q_id) REFERENCES question_belong_ask (org_id, q_id) ON DELETE CASCADE,
PRIMARY KEY (c_id, q_id)
);

CREATE TABLE reply( 
source int,
source_qid int,
target int,
target_qid int,
FOREIGN KEY (source, source_qid) REFERENCES comments (c_id, q_id),
FOREIGN KEY (target, target_qid) REFERENCES comments (c_id, q_id),
PRIMARY KEY (source, source_qid, target, target_qid),
CHECK (source_qid=target_qid)
);

CREATE TYPE vote_type        AS ENUM ('up', 'down');
CREATE TABLE vote_question(
question_id int NOT NULL,
org_id int NOT NULL,
FOREIGN KEY (question_id, org_id) REFERENCES question_belong_ask (q_id, org_id),
user_id int NOT NULL REFERENCES users (u_id),
vote vote_type NOT NULL,
PRIMARY KEY (question_id, user_id)
);

CREATE TABLE vote_comment(
comment_id int NOT NULL,
comment_qid int NOT NULL,
user_id int NOT NULL REFERENCES users(u_id) ,
Vote vote_type NOT NULL,
PRIMARY KEY (comment_id, user_id)
);
```

## 4. Populate the tables
### **Below content is from** 
* https://piazza.com/class/jgwnwiy186d6pu?cid=148
* https://piazza.com/class/jgwnwiy186d6pu?cid=210
* https://piazza.com/class/jgwnwiy186d6pu?cid=233
```
INSERT INTO users(email, password, name) VALUES
('ewu@cs.columbia.edu ','123456','Eugene Wu');

INSERT INTO organizations_create (name, create_time, creator_id, type, description) VALUES
('DATABASES W4111: Introduction to Databases', '2018-9-2', 1, 'course', null);

INSERT INTO courses (course_id) VALUES
(1);

INSERT INTO tags (content) VALUES ('exam');

INSERT INTO question_belong_ask (creator_id, org_id, create_time, solved_type, public_type, title, content, update_time, pin, tag_id, q_type) VALUES
(1, 1, '2018-10-12', null, 'public', 'Moved OH to 10/17 3:30', 'I have moved my office hours to Wednesday 10/17 at 3:30-4:30PM for last minute midterm questions.  I will not have thursday office hours after class.', '2018-10-12', 'pinned', 1, 'note');

INSERT INTO tags (content) VALUES ('other');

INSERT INTO question_belong_ask (creator_id, org_id, create_time, solved_type, public_type, title, content, update_time, pin, tag_id, q_type) VALUES
(1, 1, '2018-10-12', null, 'public', 'midterm study guide', $$I'd like to point to the study guide compiled by students from the students from last year's class.  I have not fully checked it for correctness, but it seemed to help previous students.  I encourage the class to edit and improve the wiki! https://github.com/w4111/scribenotes/wiki/Midterm-Study-Guide$$, '2018-10-7', 'pinned', 1, 'note');

INSERT INTO question_belong_ask (creator_id, org_id, create_time, solved_type, public_type, title, content, update_time, pin, tag_id, q_type) VALUES
(1, 1, '2018-10-7', 'resolved', 'public', 'The Web as a Database', $$Here is a great article about thinking about web scraping as a database, which is related to the last demo from the lecture discussing user defined functions. https://www.mixnode.com/blog/posts/turn-the-web-into-a-database-an-alternative-to-web-crawling-scraping$$, '2018-10-7', 'unpinned', 2, 'question');

UPDATE question_belong_ask SET q_type = 'note' WHERE q_id = 3;

INSERT INTO users(email, password, name) VALUES
('Anonymous@piazza.edu ','123456','Anonymous');

INSERT INTO comments(create_time, creator_id, content, org_id, q_id) VALUES
('2018-10-7', 2, $$There's no article here :)$$, 1, 3);

INSERT INTO comments(create_time, creator_id, content, org_id, q_id) VALUES
('2018-10-7', 1, $$argh. fixed!$$, 1, 3);


INSERT INTO users(email, password, name) VALUES
('IvyChen@columbia.edu ','123456','Ivy Chen');
INSERT INTO users(email, password, name) VALUES
('danyangxiang@columbia.edu ','123456','danyang xiang');

INSERT INTO question_belong_ask (creator_id, org_id, create_time, solved_type, public_type, title, content, update_time, pin, tag_id, q_type) VALUES
(2, 1, '2018-10-17', 'unresolved', 'public', $$Clarification on "Writing Another Person's UNI"$$,$$Hi,Just wanted to ask for a clarification on how the "writing another person's UNI" works on the exam? I think I gapped out a little when I heard this initially being brought up in class, but according to my understanding, basically another person would consent to having any problem that I did wrong/didn't do be substituted by his/hers if they did it correctly? Thanks a lot!$$, '2018-10-17', 'unpinned', 1, 'question');

INSERT INTO comments(create_time, creator_id, content, org_id, q_id) VALUES
('2018-10-17', 3, $$Yep, you write the UNI of the student whose answer you'd like to substitute in place of your own.$$, 1, 4);

INSERT INTO comments(create_time, creator_id, content, org_id, q_id) VALUES
('2018-10-17', 2, $$Cool, does this substitution apply to one/a few questions we designate or does it automatically apply to all questions? The latter would make less sense of course, just wanted to make sure.$$, 1, 4);

INSERT INTO comments(create_time, creator_id, content, org_id, q_id) VALUES
('2018-10-17', 3, $$We will specify the one question where this is applicable on the exam.$$, 1, 4);


INSERT INTO comments(create_time, creator_id, content, org_id, q_id) VALUES
('2018-10-17', 2, $$Got it, that makes sense. Thanks!$$, 1, 4);


INSERT INTO comments(create_time, creator_id, content, org_id, q_id) VALUES
('2018-10-18', 4, $$So if I write other student's UNI, will his/her answer replace mine or would I be given the credit of the higher one of the credits of  my answer and that student's?$$, 1, 4);

INSERT INTO comments(create_time, creator_id, content, org_id, q_id) VALUES
('2018-10-18', 3, $$ The higher one$$, 1, 4);


insert into users(email, password, name) values
('JohnPaisley@ee.columbia.edu','123456','John Paisley'),
('CYLin@ee.columbia.edu','123456','Chingyung Lin'),
('AshishMaheshwari@columbia.edu','123456','AshishMaheshwari'),
('my2398@columbia','123456','ming yao'),
('hx6494@columbia','123456','he xiao'),
('py3981@columbia','123456','peng ying');

insert into organizations_create(name, create_time, creator_id, type, description) values
('EECSE6720 BAYESIAN MOD MACHINE LEARNING','2018-9-2',5,'course',null),
('EECSE6893 TOPICS-INFORMATION PROCESSING','2018-9-2',6,'course',null),
('EECSE6895 Advanced Big Data Analytics','2018-2-2',9,'course',null),
('ECBMB4040 NEURAL NETWRKS & DEEP LEARNING','2018-2-2',7,'course',null),
('ELENE4702 DIGITAL COMMUNICATIONS','2018-2-2',8,'course',null),
('ELENE4810 DIGITAL SIGNAL PROCESSING','2018-2-2',9,'course',null),
('ELENE4944 PRINCIPALS OF DEVICE MICROFAB','2018-2-2',10,'course',null),
('ELENE4998 INTERMEDIATE PROJECTS','2018-2-2',7,'course',null),
('ELENE6333 SEMICONDUCTOR DEVICE PHYSICS','2018-2-2',5,'course',null);

INSERT INTO courses (course_id) VALUES
(2),
(3),
(4),
(5),
(6),
(7),
(8),
(9),
(10);

INSERT INTO tags (content) VALUES 
('HW1'),
('HW2'),
('HW3'),
('HW4'),
('HW5'),
('PROJ1'),
('PROJ2'),
('PROJ3'),
('PROJ4');

INSERT INTO question_belong_ask (creator_id, org_id, create_time, solved_type, public_type, title, content, update_time, pin, tag_id, q_type) VALUES
(6, 3, '2018-10-12', null, 'public', 'Clarifications about HW3 Q1', 'For the wiki data, you are not required to download the whole 15GB dataset. You can download smaller datasets (such as enwikivoyage, enwikinews, etc.) and merge them to create you target dataset for clustering. This will also provide you with ground truth labels to compare your clustering results with.', '2018-10-12', 'pinned', 1, 'note'),
(6, 3, '2018-9-12', null, 'public', 'Some LIBSVM format datasets', 'Here is a link where you could find some LIBSVM format datasets, which may be useful for the regression problem.', '2018-10-12', 'pinned', 1, 'note'),
(6, 3, '2018-9-22', null, 'public', 'Mode of communication for queries and doubts', 'Reiterating over earlier announcements: please use Piazza for queries, so all TAs / students can pitch in', '2018-10-14', 'pinned', 3, 'note'),
(5, 2, '2018-10-3', null, 'public', 'Sidharth’s OH this week shifted to Friday', 'I am traveling today and hence will be shifting my OH for this week to Friday (10/26): 10 am - 12 noon. Outside of this change, my usual schedule remains the same.', '2018-10-12', 'pinned', 7, 'note'),
(5, 2, '2018-10-14', 'unresolved','public', 'Request for extension of deadline for Homework 2', 'Would it be possible to please extend the deadline by a 2-3 days?', '2018-10-14', 'unpinned', 3, 'question'),
(5, 2, '2018-9-28', 'resolved', 'public', 'The value of M and N?', 'In problem2, we have to initialize each ui and vj, but whats the value of M and N? N can be known from movies.txt, but what about N?', '2018-10-12', 'unpinned', 7, 'question');

insert into comments(create_time, creator_id, content, org_id, q_id) values
('2018-10-1', 7, 'This assignment has a lot of complexity when it comes to coding the work - and I went to 3 TA sessions but they were always full. Please extend the deadline and have more office hours so they can help us out', 2, 8),
('2018-10-3', 8, 'See the max() and unique() items in ratings.txt to find M, N', 3, 6);

insert into organizations_create(name, create_time, creator_id, type, description) values
('Genes, Race, and Ancestry: The Meanderings of Two Sociologists in the Weeds of Genetic Methods','2018-10-22',7,'event',null),
('Getting Started with Statistical Software (SAS)','2018-10-15',6,'event',null),
('Monday Seminar: Peter DeScioli','2018-8-22',9,'event',null),
('Orchestration of embryonic brain development by choroid plexus','2018-9-13',7,'event',null),
('The Unseen Paradox of Agricultural Workers: How Our Food Systems Create Hunger','2018-9-11',8,'event',null),
('Women in Energy Lunch: Ruth Dreessen','2018-9-17',3,'event',null),
('Book Talk: The Politics of Police Reform: Society Against the State in Post-Soviet Countries','2018-10-8',2,'event',null),
('Guided Historical Tour','2018-10-9',6,'event',null),
('Elena Abarinovs Thesis Seminar Genetics and Development Department','2018-10-1',7,'event',null),
('M.A. in Climate and Society Online Information Session','2018-9-15',10,'event',null);

insert into enroll values
(3,1,'instructor'),
(4,1,'instructor'),
(2,3,'instructor'),
(4,3,'instructor'),
(5,3,'instructor'),
(6,3,'instructor'),
(7,2,'student'),
(8,2,'student'),
(9,2,'student'),
(8,3,'student'),
(9,3,'student'),
(6,11,'student'),
(2,19,'instructor'),
(3,18,'instructor'),
(4,17,'instructor'),
(5,16,'instructor'),
(6,15,'instructor'),
(7,14,'student'),
(8,13,'student'),
(9,12,'student');

insert into events values
(11),
(12),
(13),
(14),
(15),
(16),
(17),
(18),
(19),
(20);

insert into terms(semester, year) values
('fall',2018),
('spring',2018),
('fall',2017),
('spring',2017),
('fall',2016),
('spring',2016),
('fall',2015),
('spring',2015),
('fall',2014),
('spring',2014);

insert into offer(course_id, term_id) values
(1,1),
(2,2),
(3,3),
(4,4),
(5,2),
(6,3),
(7,1),
(8,2),
(9,6),
(10,3);

INSERT INTO comments(create_time, creator_id, content, org_id, q_id) VALUES
('2018-10-9', 4, $$This assignment has a lot of complexity when it comes to coding the work - and I went to 3 TA sessions but they were always full. Please extend the deadline and have more office hours so they can help us out.$$, 2, 8),
('2018-9-29', 4, $$I'm getting 68-69% for test accuracy using MATLAB, haven't checked training accuracy$$, 2, 9),
('2018-10-4', 4, $$Notice rij do not exist for some specific i and j, so in calculation, avoiding using or removing some data in those positions might help.$$, 2, 9),
('2018-10-5', 4, $$Make sure you encode$$, 3, 6),
('2018-10-6', 4, $$The example on tutorial slide should have given you some hints but we would not limit how you do that as long as the results make sense!$$, 3, 7),
('2018-10-7', 4, $$For your reference, you can always find response code here, https://developer.twitter.com/en/docs/basics/response-codes.html$$, 3, 7);

INSERT INTO reply (source, source_qid, target, target_qid) VALUES
(1,3,2,3),
(3,4,4,4),
(5,4,6,4),
(7,4,8,4),
(9,8,11,8),
(10,6,14,6),
(12,9,13,9),
(15,7,16,7),
(3,4,8,4),
(4,4,7,4);
```

## 5. Run some queries
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

## 6. Descriptions of any changes
* Modified the comment table so that it has a partial key, primary key (c_id, p_id), because it is a weak entity of questions.
* Modified the reply table to make sure comment reply to comment and both of them belongs to the same question
* Separated multiple relations between user and organization
* User can enroll in any organization as an instructor or a student.
* Deleted up number and down number, because it can be calculated from vote table
* Modified Tag table, add primary key t_id
