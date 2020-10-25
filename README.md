# PARKING-MANAGEMENT-SYSTEM

This is a car parking management application, where all the parking spaces are defined with-in the system and been allocated to cars for certain period of time.

# FUNCTIONALITIES:
1) Initialize: Initialize the data with a button click: 
Parking Zone Data: Add 3 parking zones by naming them as A, B, and C
Parking Space Data: Add 30 parking space by naming them as A01...A10, B01...B10, and C01...C10.
Allocation: Remove all transactional data
2) Dashboard
Parking Space Listing (sort by parking_space_title ascending, with fliter by parking_zone_title)
Shows Parking Space Title, Availability (Vacant: Green and Occupied: Red), Vehicle Registration Number (if occupied)
Visible to everyone
Book Parking Space 
Require Vehicle Registration Number
Release Parking Space 
Require Vehicle Registration Number
3) Reports: Show on the browser
Parking Zone Report

# ENTITIES/ATTRIBUTES

1)parking_zone

->parking_zone_id

->parking_zone_title

->parking_space

->parking_space_id

->parking_space_title

->parking_zone_id

->name

2)vehicle_parking

->vehicle_parking_id

->parking_zone_id

->parking_space_id

->booking_date_time

->release_date_time

->name

# Dependencies included in Project

1)Node

2)Express

3)MongoDB

4)react

5)react-dom

6)react-router

7)react-router-dom

8)Moment

9)bootstrap

# Available Scripts

In the project directory, you can run:

npm install

cd src/server

node server.js

npm start

Runs the app in the development mode.

Open http://localhost:3000 to view it in the browser.
