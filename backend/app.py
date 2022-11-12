from flask import Flask
import psycopg2

# Common connection for all functions
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

@app.route('/buildingPermit', methods=['GET'])
def get_permits_data():
    cursor.execute("SELECT * from buildingpermits")
    data = cursor.fetchall()
    return data
