from flask import Flask, jsonify
import psycopg2
from psycopg2 import Error
from datetime import date
from flask_cors import CORS
import matplotlib
import geopy
import googlemaps


# Common connection for all functions
def get_zipcode(df, geolocator, lat_field, lon_field):
    location = geolocator.reverse((df[lat_field], df[lon_field]))
    return location.raw['address']['postcode']
conn = None
try:
    print('Connecting to PostgreSQL database...')
    conn = psycopg2.connect(
    host="localhost",
    database="chicago_business_intelligence",
    user="postgres",
    password="root")
    cursor = conn.cursor()
    print('Cursor set...')
except:
    print('Unable to connect to PostgreSQL connection URL...')

app = Flask(__name__)
CORS(app)



@app.route('/buildingPermit', methods=['GET'])
def get_permits_data():
    cursor.execute("SELECT * from buildingpermits")
    data = cursor.fetchall()
    return jsonify(data)


@app.route('/unEmployment', methods=['GET'])
def get_unemp_data():
    cursor.execute('select "areaCode", "areaName", "belowPoverty" from unemployment_data order by "belowPoverty" desc limit 5;')
    top5_poverty = cursor.fetchall()
    cursor.execute('select "areaCode", "areaName", "unempRate" from unemployment_data order by "unempRate" desc limit 5;')
    top5_unemp = cursor.fetchall()
    return jsonify(top5_poverty,top5_unemp)

@app.route('/getZip', methods = ['GET'])
def get_Zipcode():
    cursor.execute('select * from (select "areaCode", "areaName", "belowPoverty" from unemployment_data order by "belowPoverty" desc limit 5) poverty left join (select "communityAreaNumber", "communityAreaZipCode" from community_area_zipcode) zipcode on (poverty."areaCode" = zipcode."communityAreaNumber");')
    data = cursor.fetchall()
    address = ""
    latlng = {}
    address_array = []
    gmaps_key = googlemaps.Client(key='AIzaSyDr2sLloniItSejbFLVMShC9Kw0euajErY')
    for i in range(len(data)):
        address = data[i][1] + ", " + "Chicago, " + "Illinois, " + data[i][4]
        geodecode = gmaps_key.geocode(address)
        latlng = geodecode[0]["geometry"]["location"]
        address_array.append(latlng)
    return address_array
    
@app.route('/ccvi', methods=['GET'])
def get_ccvi_data():
    cursor.execute("SELECT * from ethnicitycovid19")
    data = cursor.fetchall()
    return jsonify(data)

@app.route('/taxiTrips', methods=['GET'])
def get_trips_data():
    cursor.execute("SELECT * from taxitrips")
    data = cursor.fetchall()
    return jsonify(data)

@app.route('/covid19', methods=['GET'])
def get_covid19_daily_data():
    cursor.execute("SELECT * from healthhumanservices")
    data = cursor.fetchall()
    return jsonify(data)

@app.route('/covid19Zip', methods=['GET'])
def get_covid19_weekly_data():
    cursor.execute("SELECT * from covid19")
    data = cursor.fetchall()
    return jsonify(data)