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
```

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
