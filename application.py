import qalitesite

env = {'SECRET_KEY':'dev', 'ENV': True, 'DEBUG': True}

application = qalitesite.create_app(env)


if __name__ == '__main__':
    application.run()
