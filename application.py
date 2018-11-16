import qalitesite

env = {'SECRET_KEY':'dev'}

application = qalitesite.create_app(env)


if __name__ == '__main__':
    application.run()
