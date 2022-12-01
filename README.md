# CHICAGO BUSINESS INTELLIGENCE APPLICATION

### TECH STACK USED:
1. **Golang** : To fetch Chicago Data Portal API's and store in postgres every 10 minutes....
2. **Postgres@14** : Used to store data of various API's and use them for time-series-analysis.
3. **Flask** : Backend response modules are coded using flask web framework.
4. **React** : Exploratory Data Analysis on UI using RNN, LSTM, and Google Maps APIs.



# GOLANG
### STEPS TO USE GO FOR TESTING:
1. Install go - go1.19.2
2. Install postgres - v14
3. Create user and database in postgres:
```
    $ psql postgres
    postgres=# create user postgres with password 'root';
    postgres=# alter role postgres createdb;
    postgres=# alter role postgres superuser;
    postgres=# create database chicago_business_intelligence;
    postgres=# grant all privileges on database chicago_business_intelligence to postgres;
```
4. Check if the user and database are created using below commands:
> Note: \du lists all users, \l lists all databases, \q exists from the connection 
```
    $ psql postgres -U postgres
    postgres=# \du
    postgres=# \l
    postgres=# \q
```
5. Now, go to the main.go file:
```
    $ cd go/src/github.com/cbi/api
    $ go run main.go
```
6. Check in postgres if the data is populated using below commands:
```
    $ psql postgres -U postgres
    postgres=# \l
    postgres=# \c chicago_business_intelligence;
    postgres=# \dt
    postgres=# select * from <relation_name>;
```
# React Js
1. Go to the front end folder, make sure that node package manager is installed.
2. run npm install.
3. All the libraries required will be installed using this command.
4. To run the Application's front-end run: npm start.

# Python (Flask)
 1. Install Python version >= 3.7
2. Install virtualenv package
3. Execute below commands in terminal

   ```
   $ cd backend/
   $ virtualenv .venv -p python3.8
   $ source .venv/bin/activate
   $ pip install -r requirements.txt
   ```
4. Execute below commands in terminal for non-debug mode

   ```
    $ flask --app app run
   ```
5. Execute below commands in terminal for debug mode

   ```
    $ flask --app app --debug run
   ```

# Docker 
1. Add Covid-19, CCVI, TripData, Neighbourhood API changes 
2. Automate this, by deploying on docker-compose