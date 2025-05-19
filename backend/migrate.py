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

def parse_iso_datetime(dt_str):
    try:
        return datetime.fromisoformat(dt_str)
    except Exception:
        return dt_str

def convert_document(doc, collection_name=None):
    """
    Recursively convert document fields:
    - _id and *_id fields to ObjectId
    - ISO date strings to datetime objects
    - 'data' field from base64 string to bytes
    - recursively handle nested lists and dicts, including 'statuses' and 'photos'
    """
    if isinstance(doc, dict):
        new_doc = {}
        for k, v in doc.items():
            if (k == '_id' or k.endswith('_id')) and isinstance(v, str):
                try:
                    new_doc[k] = ObjectId(v)
                except Exception:
                    new_doc[k] = v
            elif k in ('creation_date', 'edit_date', 'timestamp', 'date') and isinstance(v, str):
                new_doc[k] = parse_iso_datetime(v)
            elif k == 'data' and isinstance(v, str):
                try:
                    new_doc[k] = base64.b64decode(v)
                except Exception:
                    new_doc[k] = v
            elif k == 'photos' and isinstance(v, list):
                new_doc[k] = []
                for item in v:
                    if isinstance(item, str):
                        try:
                            new_doc[k].append(ObjectId(item))
                        except Exception:
                            new_doc[k].append(item)
                    else:
                        new_doc[k].append(item)
            elif k == 'statuses' and isinstance(v, list):
                new_doc[k] = [convert_document(item) for item in v]
            else:
                new_doc[k] = convert_document(v)
        return new_doc
    elif isinstance(doc, list):
        return [convert_document(item) for item in doc]
    else:
        return doc

try:
    # Connect as root user
    client = MongoClient(MONGO_ROOT_URI)
    db = client[MONGO_DB_NAME]

    # Check if user exists, create if not
    users_info = db.command("usersInfo", {"user": MONGO_USER, "db": MONGO_DB_NAME})
    if not users_info.get("users"):
        print(f"User '{MONGO_USER}' does not exist. Creating...")
        db.command("createUser", MONGO_USER,
                   pwd=MONGO_PASSWORD,
                   roles=[{"role": "readWrite", "db": MONGO_DB_NAME}])
        print(f"User '{MONGO_USER}' created with readWrite access to '{MONGO_DB_NAME}'.")
    else:
        print(f"User '{MONGO_USER}' already exists. Skipping user creation.")

    # Load backup data
    with open("migrations/backup.json", "r") as f:
        backup_data = json.load(f)

    # Check if all collections are empty
    all_empty = True
    for coll_name in backup_data.keys():
        if coll_name not in db.list_collection_names():
            db.create_collection(coll_name)
        coll = db[coll_name]
        if coll.count_documents({}) > 0:
            all_empty = False
            print(f"Collection '{coll_name}' is not empty. Skipping import.")
            break

    if all_empty:
        print("All collections are empty. Starting data import...")

        # Import data per collection
        for coll_name, documents in backup_data.items():
            coll = db[coll_name]

            if isinstance(documents, dict):
                documents = [documents]

            # Convert documents recursively
            converted_docs = [convert_document(doc, coll_name) for doc in documents]

            if converted_docs:
                coll.insert_many(converted_docs)
                print(f"Imported {len(converted_docs)} documents into collection '{coll_name}'.")
            else:
                print(f"No documents to import into collection '{coll_name}'.")

    else:
        print("Some collections are not empty. Import skipped.")

except KeyError as e:
    print(f"Missing environment variable: {e}")
except Exception as e:
    print(f"Migration error: {e}")
finally:
    if 'client' in locals():
        client.close()
    print("Migration completed.")
