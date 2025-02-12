def add_data(str_data):
    pass
def read_all():
    pass
def mass_import(file_path):
    pass
def mass_export(file_path):
    pass

# print all program options
def print_help_info():
    print("The program has the following options:")
    print("0 - Display a hint")
    print("1 - Add data to the database")
    print("2 - Read data from the database")
    print("3 - Mass import")
    print("4 - Mass export")
    print("5 - Exit")

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
        add_data(str_data)
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
