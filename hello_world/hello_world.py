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
    pass


def mass_export(file_path):
    pass


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
