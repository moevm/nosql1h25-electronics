import os
from dotenv import load_dotenv
import json
from pymongo import MongoClient
from bson import ObjectId
import base64
from datetime import datetime

load_dotenv()

MONGO_DB_NAME = os.getenv('MONGO_DB_NAME')
MONGO_HOST = os.getenv('MONGO_HOST')
MONGO_PORT = int(os.getenv('MONGO_PORT') or 27017)
MONGO_USER = os.getenv('MONGO_USER')
MONGO_PASSWORD = os.getenv('MONGO_PASSWORD')
MONGO_ROOT_USERNAME = os.getenv('MONGO_ROOT_USERNAME')
MONGO_ROOT_PASSWORD = os.getenv('MONGO_ROOT_PASSWORD')

MONGO_ROOT_URI = f"mongodb://{MONGO_ROOT_USERNAME}:{MONGO_ROOT_PASSWORD}@{MONGO_HOST}:{MONGO_PORT}/?authSource=admin"


def convert_objectids(obj):
    if isinstance(obj, dict):
        new_obj = {}
        for k, v in obj.items():
            if (k == '_id' or k.endswith('_id')) and isinstance(v, str):
                try:
                    new_obj[k] = ObjectId(v)
                except Exception:
                    new_obj[k] = v
            elif k == 'timestamp' and isinstance(v, str):
                try:
                    new_obj[k] = datetime.fromisoformat(v.replace('Z', '+00:00'))
                except Exception:
                    new_obj[k] = v
            elif k == 'data' and isinstance(v, str):
                try:
                    new_obj[k] = base64.b64decode(v)
                except Exception:
                    new_obj[k] = v
            elif k == 'photos' and isinstance(v, list):
                new_obj[k] = [convert_objectids(item) for item in v]
            elif k == 'statuses' and isinstance(v, list):
                new_obj[k] = [convert_objectids(item) for item in v]
            else:
                new_obj[k] = convert_objectids(v)
        return new_obj
    elif isinstance(obj, list):
        new_list = []
        for item in obj:
            if isinstance(item, str) and len(item) == 24:
                try:
                    new_list.append(ObjectId(item))
                except Exception:
                    new_list.append(item)
            else:
                new_list.append(convert_objectids(item))  # Рекурсивный вызов
        return new_list
    else:
        return obj


try:
    # подключаемся рутом чтобы все заполнить и создать
    client = MongoClient(MONGO_ROOT_URI)

    db_admin = client.admin

    # создание рабочей бд
    if MONGO_DB_NAME not in client.list_database_names():
        print(f"Database '{MONGO_DB_NAME}' does not exist. Creating...")
        db = client[MONGO_DB_NAME]
    else:
        db = client[MONGO_DB_NAME]

    db = client[MONGO_DB_NAME]

    try:
        users_info = db.command("usersInfo", {"user": MONGO_USER, "db": MONGO_DB_NAME})
        users = users_info.get("users", [])

        if not users:
            print(f"User '{MONGO_USER}' does not exist. Creating...")
            db.command("createUser", MONGO_USER,
                       pwd=MONGO_PASSWORD,
                       roles=[{"role": "readWrite", "db": MONGO_DB_NAME}])
            print(f"User '{MONGO_USER}' created with readWrite access to '{MONGO_DB_NAME}'.")
        else:
            print(f"User '{MONGO_USER}' already exists. Skipping user creation.")
    except Exception as e:
        print(f"Error creating or checking user: {e}")
        raise

    # загрузка данных
    with open("migrations/backup.json", "r") as f:
        backup_data = json.load(f)

    all_empty = True
    for collection_name in backup_data.keys():
        if collection_name not in db.list_collection_names():
            db.create_collection(collection_name)
        collection = db[collection_name]
        if collection.count_documents({}) > 0:
            all_empty = False
            print(f"Collection {collection_name} is not empty")
            break

    if all_empty:
        print("All collections are empty. Importing data...")
        for collection_name, data in backup_data.items():
            collection = db[collection_name]
            # Рекурсивно преобразуем ObjectId
            data = convert_objectids(data)
            if isinstance(data, list):
                if data:
                    collection.insert_many(data)
            elif isinstance(data, dict):
                collection.insert_one(data)
            print(f"Data imported into collection '{collection_name}'.")
    else:
        print("Some collections are not empty. Skipping import.")

except KeyError as e:
    print(f"Missing environment variable: {e}")
except Exception as e:
    print(f"An error occurred: {e}")
finally:
    if 'client' in locals():
        client.close()
    print("Migration completed.")
