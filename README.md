# CHICAGO BUSINESS INTELLIGENCE APPLICATION

### TECH STACK USED:

1. **Golang** : To fetch Chicago Data Portal API's and store in postgres every 10 minutes....
2. **Postgres@14** : Used to store data of various API's and use them for time-series-analysis.
3. **Flask** : Backend response modules are coded using flask web framework.
4. **React** : Exploratory Data Analysis on UI using RNN, LSTM, and Google Maps APIs.

# GOLANG

# STEPS TO USE GO FOR TESTING:

- Install go - go1.19.2
- Install postgres - v14
- Create user and database in postgres:

```
    $ psql postgres
    postgres=# create user postgres with password 'root';
    postgres=# alter role postgres createdb;
    postgres=# alter role postgres superuser;
    postgres=# create database chicago_business_intelligence;
    postgres=# grant all privileges on database chicago_business_intelligence to postgres;
```

- Check if the user and database are created using below commands:

> Note: \du lists all users, \l lists all databases, \q exists from the connection

```
    $ psql postgres -U postgres
    postgres=# \du
    postgres=# \l
    postgres=# \q
```

- Now, go to the main.go file:

```
    $ cd go/src/github.com/cbi/api
    $ go run main.go
```

- Check in postgres if the data is populated using below commands:

```
    $ psql postgres -U postgres
    postgres=# \l
    postgres=# \c chicago_business_intelligence;
    postgres=# \dt
    postgres=# select * from <relation_name>;
```

# React Js

- Go to the front end folder, make sure that node package manager is installed.
- run npm install.
- All the libraries required will be installed using this command.
- To run the Application's front-end run: npm start.

# Python (Flask)

- Install Python version >= 3.7
- Install virtualenv package
- Execute below commands in terminal

```
$ cd backend/
$ virtualenv .venv -p python3.8
$ source .venv/bin/activate
$ pip install -r requirements.txt
```

- Execute below commands in terminal for non-debug mode

```
 $ flask --app app run
```

- Execute below commands in terminal for debug mode

```
 $ flask --app app --debug run
```

# Docker

- Go is installed on Docker
- In current folder execute:

```
$ docker compose up -d
$ docker container ls 
$ docker logs --follow <container-id>
```

# Time Series Forecasting

- We have used fbprophet for time series forcasting of Taxi-Trip data and Covid-19 data.



***Line of Code estimate:*** 100,000 lines of code

***Features Implemented:***

1. User Login
2. Covid Reports: The business intelligence reports are geared towardtracking and forecasting events that have direct or indirect impacts onbusinesses and neighborhoods in different zip codes within the city ofChicago. The business intelligence reports will be used to send alerts to taxidrivers about the state of COVID-19 in the different zip codes in order toavoid taxi drivers to be the super spreaders in the different zip codes andneighborhoods. For this report, we will use taxi trips and daily COVID-19datasets for the city of Chicago.
3. Taxi Trips Information: There are two major airports within the city of Chicago:O’Hare and Midway. And we are interested to track trips from these airportsto the different zip codes and the reported COVID-19 positive test cases.The city of Chicago is interested to monitor the traffic of the taxi trips fromthese airports to the different neighborhoods and zip codes.
4. Traffic Patterns Forecast: For streetscaping investment and planning, the city ofChicago is interested to forecast daily, weekly, and monthly traffic patternsutilizing the taxi trips for the different zip codes.
5. Building Permit Information: For industrial and neighborhood infrastructure investment,the city of Chicago is interested to invest in top 5 neighborhoods withhighest unemployment rate and poverty rate and waive the fees forbuilding permits in those neighborhoods in order to encourage businessesto develop and invest in those neighborhoods. Both, building permits andunemployment, datasets will be used in this report.
6. Emergency Business Loans: According to a report published by Crain’s ChicagoBusiness ([https://www.chicagobusiness.com/private-intelligence/industrialmarket-crazy-right-now](https://www.chicagobusiness.com/private-intelligence/industrialmarket-crazy-right-now)), The “little guys”, small businesses, have troublecompeting with the big players like Amazon and Walmart for warehousespaces. To help small business, a new program has been piloted with thename Illinois Small Business Emergency Loan Fund Delta to offer smallbusinesses low interest loans of up to $250,000 for those applicants withPERMIT_TYPE of PERMIT - NEW CONSTRUCTION in the zip code that has thelowest number of PERMIT - NEW CONSTRUCTION applications and PERCAPITA INCOME is less than 30,000 for the planned construction site. Both,building permits and unemployment, datasets will be used in this report.
7. Prophet Predictions
