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

### PENDING TASKS
1. Add Covid-19, CCVI, TripData, Neighbourhood API changes 
2. Automate this, by deploying on docker-compose
