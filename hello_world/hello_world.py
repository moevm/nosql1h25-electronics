from pymongo import MongoClient, InsertOne, UpdateOne
import json
import os
from dotenv import load_dotenv

load_dotenv()

try:
    uri = os.getenv("DB_URI")
    conn = MongoClient()
    print("Connected successfully!!!")
except Exception as e:
    print(f"Could not connect to MongoDB: {e}")
    exit()

db_name = os.getenv("DB_NAME")
collection_name = os.getenv("COLLECTION_NAME")

db = conn[db_name]
collection = db[collection_name]


def add(str_data):
    try:
        data = {
            "data": str_data
        }
        result = collection.insert_one(data)
        print(f"Document added with id: {result.inserted_id}")
    except Exception as e:
        print(f"Error adding data: {e}")


def read_all():
    try:
        cursor = collection.find()
        for record in cursor:
            print(record)
    except Exception as e:
        print(f"Error reading data: {e}")


def mass_import(file_path):
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)

        if not isinstance(data, list):
            raise ValueError("JSON file must contain a list of documents.")

        requests = []
        for document in data:
            if "_id" in document:
                requests.append(UpdateOne({"_id": document["_id"]}, {"$set": document}, upsert=True))
            else:
                requests.append(InsertOne(document))

        result = collection.bulk_write(requests)
        print(f"Inserted {result.inserted_count} documents.")
        print(f"Upserted {result.upserted_count} documents.")

    except FileNotFoundError:
        print(f"Error: File not found at {file_path}")
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON format in {file_path}")
    except Exception as e:
        print(f"An error occurred during import: {e}")


def mass_export(file_path):
    try:
        cursor = collection.find()
        data = list(cursor)
        print(f"Exporting {len(data)} documents.")

        with open(file_path, 'w') as f:
            json.dump(data, f, indent=4, default=str)

        print(f"Data exported successfully to {file_path}")

    except Exception as e:
        print(f"An error occurred during export: {e}")


def print_help_info():
    print("The program has the following options:")
    print("0 - Display a hint")
    print("1 - Add data to the database")
    print("2 - Read data from the database")
    print("3 - Mass import")
    print("4 - Mass export")
    print("5 - Exit")


if __name__ == '__main__':
    print_help_info()

    # main program loop
    while True:
        chosen_option = input("Enter the selected option: ")

        # display a help info
        if chosen_option == "0":
            print_help_info()

        # add data to the database
        elif chosen_option == "1":
            str_data = input("Please enter the data you wish to add: ")
            add(str_data)
            print("Data added successfully!")

        # print data from database
        elif chosen_option == "2":
            print("Database contents:")
            read_all()

        # mass import
        elif chosen_option == "3":
            file_path = input("Enter the path to the file from which you want to import the database: ")
            mass_import(file_path)

        # mass export
        elif chosen_option == "4":
            file_path = input("Enter the path to the file to which you want to export the database: ")
            mass_export(file_path)

        # main cycle end condition
        elif chosen_option == "5":
            break

        print()
