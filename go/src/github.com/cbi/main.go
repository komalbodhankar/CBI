package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/codingsince1985/geo-golang/google"
	_ "github.com/lib/pq"
)

type BuildingPermit []struct {
	Id               string `json:"id"`
	Permit           string `json:"permit_"`
	Permit_type      string `json:"permit_type"`
	Street_number    string `json:"street_number"`
	Street_direction string `json:"street_direction"`
	Street_name      string `json:"street_name"`
	Suffix           string `json:"suffix"`
	Latitude         string `json:"latitude"`
	Longitude        string `json:"longitude"`
}

type UnEmployment []struct {
	Area_code             string `json:"community_area"`
	Area_name             string `json:"community_area_name"`
	Below_poverty_percent string `json:"below_poverty_level"`
	Per_capita_income     string `json:"per_capita_income"`
	Unemployment_rate     string `json:"unemployment"`
}

func main() {

	connStr := "user=postgres dbname=chicago_business_intelligence password=root host=localhost sslmode=disable"

	db, err := sql.Open("postgres", connStr)

	fmt.Println("Successfully connected to chicago_business_intelligence")

	if err != nil {
		panic(err)
	}

	err = db.Ping()
	if err != nil {
		panic(err)
	}

	for {
		go buildingPermit(db)
		go unEmployment(db)
		time.Sleep(10 * time.Minute)
	}

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop

	log.Println("Shutting Down")
}

func buildingPermit(db *sql.DB) {
	googleGeoCoder := google.Geocoder("AIzaSyDr2sLloniItSejbFLVMShC9Kw0euajErY")
	dropTable := `drop table if exists buildingpermits`
	_, err := db.Exec(dropTable)
	if err != nil {
		panic(err)
	}

	createTable := `create table if not exists "buildingpermits"
	(
		"id" SERIAL,
		"buildPermitId" BIGINT,
		"permitId" BIGINT,
		"permitType" VARCHAR(255), 
		"address" VARCHAR(255),
		"zipcode" VARCHAR(255),
		"latitude" DOUBLE PRECISION,
		"longitude" DOUBLE PRECISION,
		"createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
		"updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
		PRIMARY KEY ("id")
	);`

	_, createTableErr := db.Exec(createTable)
	if createTableErr != nil {
		panic(err)
	}

	res, err := http.Get("https://data.cityofchicago.org/resource/building-permits.json")
	if err != nil {
		log.Fatal(err)
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		log.Fatal(err)
	}

	var buildPermitResponse BuildingPermit
	json.Unmarshal(body, &buildPermitResponse)

	for i := range buildPermitResponse {

		id := buildPermitResponse[i].Id
		permit := buildPermitResponse[i].Permit
		permitType := buildPermitResponse[i].Permit_type
		streetNumber := buildPermitResponse[i].Street_number
		streetDirection := buildPermitResponse[i].Street_direction
		streetName := buildPermitResponse[i].Street_name
		suffix := buildPermitResponse[i].Suffix
		address := streetNumber + " " + streetDirection + " " + streetName + " " + suffix
		createdAt := time.Now()
		updatedAt := time.Now()

		location, _ := googleGeoCoder.Geocode(address)
		fmt.Println("\nAddress to be converted to Latitute and Longitude: ", address)

		if location != nil {
			fmt.Println("\nLatitude and Longitude are: ", location.Lat, location.Lng)
		} else {
			fmt.Println("\nDid not find Latitude and Longitude for below address: ", address)
			continue
		}

		geodecodedAddress, _ := googleGeoCoder.ReverseGeocode(location.Lat, location.Lng)
		if geodecodedAddress != nil {
			fmt.Println("\nReverse Decoded Address using geocoder API is: ", geodecodedAddress.FormattedAddress)
		} else {
			fmt.Println("\nDid not find an address for the provided latitude and Longitude: ", location.Lat, location.Lng)
			continue
		}
		zipcode := geodecodedAddress.Postcode

		insertQuerySQL := `insert into buildingpermits ("buildPermitId", "permitId", "permitType", "address", "zipcode", "latitude", "longitude", "createdAt", "updatedAt") values ($1, $2, $3, $4, $5, $6, $7, $8, $9);`

		_, err := db.Exec(insertQuerySQL, id, permit, permitType, address, zipcode, location.Lat, location.Lng, createdAt, updatedAt)

		if err != nil {
			panic(err)
		}

	}
}

func unEmployment(db *sql.DB) {
	dropTable := `drop table if exists unemployment_data`
	_, err := db.Exec(dropTable)
	if err != nil {
		panic(err)
	}

	createTable := `create table if not exists "unemployment_data"
	(
		"id" SERIAL,
		"areaCode" VARCHAR(255) UNIQUE,
		"areaName" VARCHAR(255),
		"belowPoverty" DOUBLE PRECISION,
		"perCapita" DOUBLE PRECISION,
		"unempRate" DOUBLE PRECISION,
		"createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
		"updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
		PRIMARY KEY ("id")
	);`

	_, createTableErr := db.Exec(createTable)
	if createTableErr != nil {
		panic(err)
	}

	res, err := http.Get("https://data.cityofchicago.org/resource/iqnk-2tcu.json")
	if err != nil {
		log.Fatal(err)
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		log.Fatal(err)
	}

	var unEmploymentresponse UnEmployment
	json.Unmarshal(body, &unEmploymentresponse)

	for i := range unEmploymentresponse {
		areaCode := unEmploymentresponse[i].Area_code
		areaName := unEmploymentresponse[i].Area_name
		belowPoverty := unEmploymentresponse[i].Below_poverty_percent
		perCapita := unEmploymentresponse[i].Per_capita_income
		unempRate := unEmploymentresponse[i].Unemployment_rate
		createdAt := time.Now()
		updatedAt := time.Now()

		if areaCode == "" {
			areaCode = "0"
		}
		if areaName == "" {
			areaName = "Unknown"
		}
		if belowPoverty == "" {
			belowPoverty = "0"
		}
		if perCapita == "" {
			perCapita = "0"
		}
		if unempRate == "" {
			unempRate = "0"
		}
		fmt.Println("\nEntire data for Area code: %s is as below: \n", areaCode)
		fmt.Println(areaName, belowPoverty, perCapita, unempRate)

		insertQuerySQL := `insert into unemployment_data ("areaCode", "areaName", "belowPoverty", "perCapita", "unempRate", "createdAt", "updatedAt") values ($1, $2, $3, $4, $5, $6, $7)`

		_, err := db.Exec(insertQuerySQL, areaCode, areaName, belowPoverty, perCapita, unempRate, createdAt, updatedAt)

		if err != nil {
			panic(err)
		}
	}

}
