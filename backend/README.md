## Запуск backend проекта

Перед запуском программы в первую очередь необходимо установить `MongoDB`. Установка осуществляется с официального сайта: 

https://www.mongodb.com/try/download/community

Для установки необходимых библиотек в папке `nosql1h25-electronics/backend/` необходимо выполнить команду:

`pip install -r requirements.txt`

Перед запуском необходимо заполнить файл .env, имеющий структуру:

```
MONGO_DB_NAME=...
MONGO_HOST=...
MONGO_PORT=...
MONGO_USER=...
MONGO_PASSWORD=...
SECRET_KEY=...
```

В поле `SECRET_KEY` должна храниться строка, которая используется для обеспечения безопасности различных механизмов фреймворка (подписание сессий, хэшировнаие паролей и тд)

Пользователь, указанный в .env должен быть добавлен вручную в базу данных и обладать правами на чтение и запись:

```
use db_name
db.createUser({
  user: "username",
  pwd: "password",
  roles: [{ role: "readWrite", db: "db_name" }]
})
```

Конкретные данные скрыты, поскольку являются чувствительными данными.

Запуск осуществляется в той же папке командой:

`python manage.py runserver`

Документация разработанного API доступна после запуска по адресу:

`http://localhost:8000/api/swagger/`


## Запуск через докер

Для запуска проекта необходимо выполнить команду

```bash
docker compose build --no-cache && docker compose up
```

Для корректного запуска необходим файл `.env` с таким содержанием

```
MONGO_DB_NAME=db_name
MONGO_HOST=db
MONGO_PORT=27017
MONGO_PASSWORD=user_password
MONGO_USER=username
SECRET_KEY=django-insecure-#vzf3%=9q%34)r68^f&ui(t&%**s=(!#vl(0@j^w7o$-ka^9a@

MONGO_ROOT_USERNAME=root_username
MONGO_ROOT_PASSWORD=root_password
```
