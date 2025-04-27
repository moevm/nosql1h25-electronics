# nosql_template


## Предварительная проверка заданий

<a href=" ./../../../actions/workflows/1_helloworld.yml" >![1. Согласована и сформулирована тема курсовой]( ./../../actions/workflows/1_helloworld.yml/badge.svg)</a>

<a href=" ./../../../actions/workflows/2_usecase.yml" >![2. Usecase]( ./../../actions/workflows/2_usecase.yml/badge.svg)</a>

<a href=" ./../../../actions/workflows/3_data_model.yml" >![3. Модель данных]( ./../../actions/workflows/3_data_model.yml/badge.svg)</a>

<a href=" ./../../../actions/workflows/4_prototype_store_and_view.yml" >![4. Прототип хранение и представление]( ./../../actions/workflows/4_prototype_store_and_view.yml/badge.svg)</a>

<a href=" ./../../../actions/workflows/5_prototype_analysis.yml" >![5. Прототип анализ]( ./../../actions/workflows/5_prototype_analysis.yml/badge.svg)</a> 

<a href=" ./../../../actions/workflows/6_report.yml" >![6. Пояснительная записка]( ./../../actions/workflows/6_report.yml/badge.svg)</a>

<a href=" ./../../../actions/workflows/7_app_is_ready.yml" >![7. App is ready]( ./../../actions/workflows/7_app_is_ready.yml/badge.svg)</a>

## Инструкция по запуску

В рамках задания был настроен Docker compose. Запуск проекта:

```sh
docker compose up --build
```

В проекте есть параметры БД, которые настраиваются через `.env` файл:
 - `MONGO_DB_NAME` - имя основной коллекции в БД
 - `MONGO_USER` - имя пользователя БД, от имени которого приложение работает с БД
 - `MONGO_PASSWORD` - пароль от основного пользователя БД
 - `MONGO_ROOT_USERNAME` - имя суперпользователя БД
 - `MONGO_ROOT_PASSWORD` - пароль от суперпользователя БД  
 - `SECRET_KEY` - строка-ключ, который используется для обеспечения безопасности различных механизмов фреймворка (хэширование паролей, подписание сессий и тд)

Пример настроек представлен в файле `.env` в корне репозитория.

## Отладочные данные

Для удобной проверки работноспособности разработанного приложения был создан тестовый бэкап данных. Бэкап загружается автоматически.

В приложении реализовано два типа пользователей.

Для тестирования функционала со стороны администратора необходимо воспользоваться следующими данными для авторизации:
```
login: buyer
password: password
```

Для тестирования функционала со стороны клиента необходимо воспользоваться следующими данными для авторизации:
```
login: lena
password: password
```
