To run backend, frontend and postgresqlDB make sure that you have docker installed. After this turn on Docker Desktop. Than make sure you are in main directory.
To run containers use command:

    docker-compose up --build -d

After this you will be able to check services on localhost.

###

To run DB schemas migrations use command:

    docker compose exec backend python manage.py migrate

###

To go inside DB use command:

    docker compose exec db psql -U postgres_user -d config


So now you can to discover our database. To leave DB use command iside of DB:

    \q

Rest of postgresql commands you can learn by yourself.