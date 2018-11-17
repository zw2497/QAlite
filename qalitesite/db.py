import os
from sqlalchemy import *
from sqlalchemy.pool import NullPool

def create():
    DB_USER = "zw2497"
    DB_PASSWORD = "r0749i8k"
    DB_SERVER = "w4111.cisxo09blonu.us-east-1.rds.amazonaws.com"
    DATABASEURI = "postgresql://"+DB_USER+":"+DB_PASSWORD+"@"+DB_SERVER+"/w4111"
    engine = create_engine(DATABASEURI)
    return engine

def conn(connection):
    return connection.connect()

def disconn(connection):
    connection.close()

if __name__ == '__main__':
    connection = engine.connect()
    result = connection.execute("select * from test")
    for row in result:
        print("username:", row['name'])
    connection.close()
