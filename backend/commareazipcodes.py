import psycopg2
from psycopg2 import Error
from datetime import date
import pandas as pd


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

zipCodeCommunityArea = pd.read_excel('./datasets/ZipCodeCommunityArea.xlsx')
communityAreaNumberName = pd.read_excel('./datasets/CommunityAreaName.xlsx')
data = []
for i in range(len(zipCodeCommunityArea)):
    zipCode = zipCodeCommunityArea.loc[i, 'Zip Code']
    communityAreas = zipCodeCommunityArea.loc[i, 'Community Area'].split(",")
    for j in range(len(communityAreaNumberName)):
        areaNumber = communityAreaNumberName.loc[j, 'AREA_NUMBE']
        community = communityAreaNumberName.loc[j, 'COMMUNITY']
        for communityArea in communityAreas:
            if communityArea.lower().replace(" ", "") == community.lower().replace(" ", ""):
                data.append([areaNumber, community, zipCode])

data = sorted(data)

try:
    drop_sql_query = '''drop table if exists community_area_zipcode;'''
    cursor.execute(drop_sql_query)
    
    create_table_query = '''CREATE TABLE IF NOT EXISTS "community_area_zipcode" ("id"   SERIAL , 
    "communityAreaNumber" BIGINT, "communityAreaName" VARCHAR(255), 
    "communityAreaZipCode" VARCHAR(255), 
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, 
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, 
    PRIMARY KEY ("id")
    );'''
    # Execute a command: this creates a new table
    cursor.execute(create_table_query)
    
    for i in range(len(data)):
        createdAt = date.today()
        updatedAt = date.today()

        insert_query = '''INSERT INTO community_area_zipcode ("communityAreaNumber", 
        "communityAreaName", "communityAreaZipCode", "createdAt", "updatedAt") VALUES (%s, %s, %s, %s, %s);'''
        areaNumber, community, zipCode = data[i]
        item_tuple = (int(areaNumber), community, str(zipCode), createdAt, updatedAt)
        cursor.execute(insert_query, item_tuple)
    
    
    conn.commit()
    print("Table created successfully in PostgreSQL ")
except (Exception, Error) as error:
    print("Error while connecting to PostgreSQL", error)