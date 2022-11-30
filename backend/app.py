from flask import Flask, jsonify
import psycopg2
from flask_cors import CORS
import googlemaps
import pandas as pd
from prophet import Prophet
from flask import Flask
from flask import make_response, request

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
CORS(app, resources={r"/*": {"origins": "*"}})
# logging.getLogger('flask_cors').level = logging.DEBUG
CORS_ALLOW_ORIGINS = ["http://127.0.0.1:5000"]


@app.route('/buildingPermit', methods=['GET'])
def get_permits_data():
    cursor.execute(
        "select \"buildPermitId\", \"permitId\", \"permitType\", \"address\", \"zipcode\", \"areaName\", "
        "\"perCapita\", \"createdAt\", \"updatedAt\" from (select * from buildingpermits where \"permitType\" like "
        "'PERMIT - NEW CONSTRUCTION%') permit left join (select \"areaCode\", \"areaName\", \"perCapita\" from "
        "unemployment_data) unemployment on (permit.\"communityarea\" = unemployment.\"areaCode\");")
    data = cursor.fetchall()
    return jsonify(data)


@app.route('/permitCountChart', methods=['GET'])
def get_permit_charts_data():
    cursor.execute(
        "select \"permitType\", \"zipcode\", \"latitude\", \"longitude\",\"perCapita\" from (select * from "
        "buildingpermits where \"permitType\" like 'PERMIT - NEW CONSTRUCTION%') permit left join (select "
        "\"areaCode\", \"areaName\", \"perCapita\" from unemployment_data) unemployment on (permit.\"communityarea\" "
        "= unemployment.\"areaCode\");")
    data = cursor.fetchall()
    df = pd.DataFrame(data)
    df.columns = ['PermitType', 'ZipCode', 'Latitude', 'Longitude', 'PerCapita']
    count = 0
    result = []
    i = 0
    j = 0
    j = i + 1
    for i in df.index:
        for j in df.index:
            if df['ZipCode'][i] == df['ZipCode'][j]:
                count += 1
        result.append(count)
        count = 0
    df['Count'] = result
    df = df.drop_duplicates()
    final = df.nlargest(30, ['Count'])
    final_final = final.to_dict('records')
    return jsonify(final_final)

@app.route('/forecastCovid19', methods=['GET'])
def get_Covid19_Forecast():
    cursor.execute(
        "SELECT \"labreportdate\", \"casestotal\" FROM public.ethnicitycovid19;")
    data = cursor.fetchall()
    df = pd.DataFrame(data)
    df[0]= pd.to_datetime(df[0])
    df.columns = ['ds', 'y']
    m = Prophet()        
    m.fit(df)
    future = m.make_future_dataframe(periods=10, freq='D')
    forecast = m.predict(future)
    forecast['ds'] = forecast['ds'].dt.strftime('%Y-%m-%d')
    data = forecast[['ds','yhat']]
    data = data.rename(columns={"ds":"date","yhat":"forecast_value"})
    data['forecast_value'] = data['forecast_value'].round(decimals=0)  
    data = data.to_json(orient='records') 
    return make_response(data, 200)
@app.route('/emergencyLoan', methods=['GET'])
def get_emergency_loan_latlng():
    cursor.execute(
        "select \"permitType\", \"zipcode\", \"latitude\", \"longitude\", \"perCapita\" from (select * from "
        "buildingpermits where \"permitType\" like 'PERMIT - NEW CONSTRUCTION%') permit left join (select "
        "\"areaCode\", \"areaName\", \"perCapita\" from unemployment_data) unemployment on (permit.\"communityarea\" "
        "= unemployment.\"areaCode\");")
    data = cursor.fetchall()


@app.route('/unEmployment', methods=['GET'])
def get_unemp_data():
    cursor.execute('select "areaCode", "areaName", "belowPoverty" from unemployment_data order by "belowPoverty" desc '
                   'limit 5;')
    top5_poverty = cursor.fetchall()
    cursor.execute('select "areaCode", "areaName", "unempRate" from unemployment_data order by "unempRate" desc limit '
                   '5;')
    top5_unemp = cursor.fetchall()
    return jsonify(top5_poverty, top5_unemp)


@app.route('/getPoverty', methods=['GET'])
def get_address_Poverty():
    cursor.execute('select poverty."areaCode", poverty."areaName", poverty."belowPoverty", '
                   'zipcode."communityAreaZipCode", sum(bp."totalwaived") as totalWaived from (select "areaCode", '
                   '"areaName", '
                   '"belowPoverty" from unemployment_data order by "belowPoverty" desc limit 5) poverty  left join '
                   'community_area_zipcode zipcode on poverty."areaCode" = zipcode."communityAreaNumber" inner join '
                   'buildingpermits bp on zipcode."communityAreaZipCode" = bp."zipcode" group by '
                   'poverty."areaCode", poverty."areaName", poverty."belowPoverty", zipcode."communityAreaZipCode";')
    poverty = cursor.fetchall()
    poverty_array = []
    gmaps_key = googlemaps.Client(key='AIzaSyDr2sLloniItSejbFLVMShC9Kw0euajErY')
    for i in range(len(poverty)):
        poverty_address = poverty[i][1] + ", " + "Chicago, " + "Illinois, " + poverty[i][3]
        geodecode_poverty = gmaps_key.geocode(poverty_address)
        latlng_poverty = geodecode_poverty[0]["geometry"]["location"]
        latlng_poverty['areaCode'] = poverty[i][0]
        latlng_poverty['areaName'] = poverty[i][1]
        latlng_poverty['belowPoverty'] = poverty[i][2]
        latlng_poverty['zipcode'] = poverty[i][3]
        latlng_poverty['totalWaived'] = poverty[i][4]
        poverty_array.append(latlng_poverty)
    return jsonify(poverty_array)


@app.route('/getUnemp', methods=['GET'])
def get_address_Unemp():
    cursor.execute('select poverty."areaCode", poverty."areaName", poverty."unempRate", '
                   'zipcode."communityAreaZipCode", sum(bp."totalwaived") as totalWaived from  (select "areaCode", '
                   '"areaName", "unempRate" from unemployment_data order by "unempRate" desc limit 5) poverty  left '
                   'join community_area_zipcode zipcode on (poverty."areaCode" = zipcode."communityAreaNumber") inner '
                   'join buildingpermits bp on (zipcode."communityAreaZipCode" = bp."zipcode") group by '
                   'poverty."areaCode", poverty."areaName", poverty."unempRate", zipcode."communityAreaZipCode";')
    unemp = cursor.fetchall()
    unemp_address = ""
    latlng_unemp = {}
    unemp_array = []
    gmaps_key = googlemaps.Client(key='AIzaSyDr2sLloniItSejbFLVMShC9Kw0euajErY')
    for i in range(len(unemp)):
        print(unemp)
        unemp_address = unemp[i][1] + ", " + "Chicago, " + "Illinois, " + unemp[i][3]
        geodecode_unemp = gmaps_key.geocode(unemp_address)
        latlng_unemp = geodecode_unemp[0]["geometry"]["location"]
        latlng_unemp['areaCode'] = unemp[i][0]
        latlng_unemp['areaName'] = unemp[i][1]
        latlng_unemp['unempRate'] = unemp[i][2]
        latlng_unemp['zipcode'] = unemp[i][3]
        latlng_unemp['totalWaived'] = unemp[i][4]
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
