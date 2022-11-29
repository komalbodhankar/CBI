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
CORS(app, resources = {r"/*": {"origins": "*"}})
# logging.getLogger('flask_cors').level = logging.DEBUG
CORS_ALLOW_ORIGINS = ["http://127.0.0.1:5000"] 



@app.route('/buildingPermit', methods=['GET'])
def get_permits_data():
    cursor.execute("select \"buildPermitId\", \"permitId\", \"permitType\", \"address\", \"zipcode\", \"areaName\", \"perCapita\", \"createdAt\", \"updatedAt\" from (select * from buildingpermits where \"permitType\" like 'PERMIT - NEW CONSTRUCTION%') permit left join (select \"areaCode\", \"areaName\", \"perCapita\" from unemployment_data) unemployment on (permit.\"communityarea\" = unemployment.\"areaCode\");")
    data = cursor.fetchall()
    return jsonify(data)

@app.route('/buildingPermitChart', methods=['GET'])
def get_permit_charts_data():
    cursor.execute("select \"permitType\", \"zipcode\", \"perCapita\" from (select * from buildingpermits where \"permitType\" like 'PERMIT - NEW CONSTRUCTION%') permit left join (select \"areaCode\", \"areaName\", \"perCapita\" from unemployment_data) unemployment on (permit.\"communityarea\" = unemployment.\"areaCode\");")
    data = cursor.fetchall()
    return jsonify(data)

@app.route('/unEmployment', methods=['GET'])
def get_unemp_data():
    cursor.execute('select "areaCode", "areaName", "belowPoverty" from unemployment_data order by "belowPoverty" desc limit 5;')
    top5_poverty = cursor.fetchall()
    cursor.execute('select "areaCode", "areaName", "unempRate" from unemployment_data order by "unempRate" desc limit 5;')
    top5_unemp = cursor.fetchall()
    return jsonify(top5_poverty,top5_unemp)

@app.route('/getPoverty', methods = ['GET'])
def get_address_Poverty():
    cursor.execute('select * from (select "areaCode", "areaName", "belowPoverty" from unemployment_data order by "belowPoverty" desc limit 5) poverty left join (select "communityAreaNumber", "communityAreaZipCode" from community_area_zipcode) zipcode on (poverty."areaCode" = zipcode."communityAreaNumber");')
    poverty = cursor.fetchall()
    poverty_address = ""
    latlng_poverty = {}
    poverty_array = []
    gmaps_key = googlemaps.Client(key='AIzaSyDr2sLloniItSejbFLVMShC9Kw0euajErY')
    for i in range(len(poverty)):
        poverty_address = poverty[i][1] + ", " + "Chicago, " + "Illinois, " + poverty[i][4]
        geodecode_poverty = gmaps_key.geocode(poverty_address)
        latlng_poverty = geodecode_poverty[0]["geometry"]["location"]
        poverty_array.append(latlng_poverty)
    return jsonify(poverty_array)

@app.route('/getUnemp', methods = ['GET'])
def get_address_Unemp():
    cursor.execute('select * from (select "areaCode", "areaName", "unempRate" from unemployment_data order by "unempRate" desc limit 5) poverty left join (select "communityAreaNumber", "communityAreaZipCode" from community_area_zipcode) zipcode on (poverty."areaCode" = zipcode."communityAreaNumber");')
    unemp = cursor.fetchall()
    unemp_address = ""
    latlng_unemp = {}
    unemp_array = []
    gmaps_key = googlemaps.Client(key='AIzaSyDr2sLloniItSejbFLVMShC9Kw0euajErY')
    for i in range(len(unemp)):
        unemp_address = unemp[i][1] + ", " + "Chicago, " + "Illinois, " + unemp[i][4]
        geodecode_unemp = gmaps_key.geocode(unemp_address)
        latlng_unemp = geodecode_unemp[0]["geometry"]["location"]
        unemp_array.append(latlng_unemp)
    return jsonify(unemp_array)
    
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