import os
from dotenv import load_dotenv
import json
import pymongo
from pymongo import MongoClient

load_dotenv()

MONGO_DB_NAME = os.getenv('MONGO_DB_NAME')
MONGO_HOST = os.getenv('MONGO_HOST')
MONGO_PORT = int(os.getenv('MONGO_PORT') or 27017)
MONGO_USER = os.getenv('MONGO_USER')
MONGO_PASSWORD = os.getenv('MONGO_PASSWORD')
MONGO_ROOT_USERNAME = os.getenv('MONGO_ROOT_USERNAME')
MONGO_ROOT_PASSWORD = os.getenv('MONGO_ROOT_PASSWORD')

# Construct the MongoDB connection string for root user
MONGO_ROOT_URI = f"mongodb://{MONGO_ROOT_USERNAME}:{MONGO_ROOT_PASSWORD}@{MONGO_HOST}:{MONGO_PORT}/?authSource=admin"

try:
    # Connect to MongoDB as root to perform administrative tasks
    client = MongoClient(MONGO_ROOT_URI)

    # Get the admin database
    db_admin = client.admin

    # Check if the database exists, create if it doesn't
    if MONGO_DB_NAME not in client.list_database_names():
        print(f"Database '{MONGO_DB_NAME}' does not exist. Creating...")
        db = client[MONGO_DB_NAME]
    else:
        db = client[MONGO_DB_NAME]

    # Get the database
    db = client[MONGO_DB_NAME]

    try:
        if MONGO_USER not in [user['user'] for user in db.system.users.find()]:
            print(f"User '{MONGO_USER}' does not exist. Creating...")
            db.command("createUser", MONGO_USER,
                             pwd=MONGO_PASSWORD,
                             roles=[{"role": "readWrite", "db": MONGO_DB_NAME}])
            print(f"User '{MONGO_USER}' created with readWrite access to '{MONGO_DB_NAME}'.")
        else:
            print(f"User '{MONGO_USER}' already exists.")
    except Exception as e:
        print(f"Error creating or checking user: {e}")
        raise

    # Load the backup data from the JSON file
    with open("migrations/backup.json", "r") as f:
        backup_data = json.load(f)

    # Check if all collections are empty
    all_empty = True
    for collection_name in backup_data.keys():
        # Ensure the collection exists before checking its contents
        if collection_name not in db.list_collection_names():
            db.create_collection(collection_name)
        collection = db[collection_name]
        if collection.count_documents({}) > 0:
            all_empty = False
            print(f"Collection {collection_name} is not empty")
            break

    # If all collections are empty, import the data
    if all_empty:
        print("All collections are empty. Importing data...")
        for collection_name, data in backup_data.items():
            collection = db[collection_name]
            if isinstance(data, list):
                collection.insert_many(data)
            else:
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
