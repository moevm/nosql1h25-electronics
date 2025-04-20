## Запуск backend проекта

Перед запуском программы в первую очередь необходимо установить `MongoDB`. Установка осуществляется с официального сайта: 

https://www.mongodb.com/try/download/community

Для установки необходимых библиотек в папке `nosql1h25-electronics/backend/` необходимо выполнить команду:

`pip install -r requirements.txt`

Запуск осуществляется в той же папке командой:

`python manage.py runserver`

Документация разработанного API доступна после запуска по адресу:

`http://localhost:8000/api/swagger/`