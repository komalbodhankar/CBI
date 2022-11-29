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
	TotalPaid        string `json:"subtotal_paid"`
	TotalUnPaid      string `json:"subtotal_unpaid"`
	TotalWaived      string `json:"subtotal_waived"`
}

type UnEmployment []struct {
	Area_code             string `json:"community_area"`
	Area_name             string `json:"community_area_name"`
	Below_poverty_percent string `json:"below_poverty_level"`
	Per_capita_income     string `json:"per_capita_income"`
	Unemployment_rate     string `json:"unemployment"`
}

type TaxiTrips []struct {
	TripID                   string `json:"trip_id"`
	TaxiID                   string `json:"taxi_id"`
	TripStartTimestamp       string `json:"trip_start_timestamp"`
	TripEndTimestamp         string `json:"trip_end_timestamp"`
	TripSeconds              string `json:"trip_seconds"`
	TripMiles                string `json:"trip_miles"`
	PickupCommunityArea      string `json:"pickup_community_area"`
	DropoffCommunityArea     string `json:"dropoff_community_area"`
	Fare                     string `json:"fare"`
	Tips                     string `json:"tips"`
	Tolls                    string `json:"tolls"`
	Extras                   string `json:"extras"`
	TripTotal                string `json:"trip_total"`
	PaymentType              string `json:"payment_type"`
	Company                  string `json:"company"`
	PickupCentroidLatitude   string `json:"pickup_centroid_latitude"`
	PickupCentroidLongitude  string `json:"pickup_centroid_longitude"`
	DropoffCentroidLatitude  string `json:"dropoff_centroid_latitude"`
	DropoffCentroidLongitude string `json:"dropoff_centroid_longitude"`
}

type covid []struct {
	ZIPCode                  string `json:"zip_code"`
	Tests                    string `json:"tests_cumulative"`
	PercentageTestedPositive string `json:"percent_tested_positive_cumulative"`
	Deaths                   string `json:"deaths_cumulative"`
	ZIPCodeLocation          string `json:"zip_code_location"`
}

type healthHuman []struct {
	CasesTotal            string `json:"cases_total"`
	DeathTotal            string `json:"deaths_total"`
	HospitalizationsTotal string `json:"hospitalizations_total"`
}

type EthnicityCovid19 []struct {
	LabReportDate                        string `json:"lab_report_date"`
	CasesTotal                           string `json:"cases_total"`
	DeathsTotal                          string `json:"deaths_total"`
	HospitalizationsTotal                string `json:"hospitalizations_total"`
	CasesLatinx                          string `json:"cases_latinx"`
	CasesAsianNonLatinx                  string `json:"cases_asian_non_latinx"`
	CasesBlackNonLatinx                  string `json:"cases_black_non_latinx"`
	CasesWhiteNonLatinx                  string `json:"cases_white_non_latinx"`
	CasesOtherNonLatinx                  string `json:"cases_other_non_latinx"`
	CasesUnknownRaceEth                  string `json:"cases_unknown_race_eth"`
	DeathsLatinx                         string `json:"deaths_latinx"`
	DeathsAsianNonLatinx                 string `json:"deaths_asian_non_latinx"`
	DeathsBlackNonLatinx                 string `json:"deaths_black_non_latinx"`
	DeathsWhiteNonLatinx                 string `json:"deaths_white_non_latinx"`
	DeathsOtherNonLatinx                 string `json:"deaths_other_non_latinx"`
	DeathsUnknownRaceEth                 string `json:"deaths_unknown_race_eth"`
	HospitalizationsLatinx               string `json:"hospitalizations_latinx"`
	HospitalizationsAsianNonLatinx       string `json:"hospitalizations_asian_non_latinx"`
	HospitalizationsBlackNonLatinx       string `json:"hospitalizations_black_non_latinx"`
	HospitalizationsWhiteNonLatinx       string `json:"hospitalizations_white_non_latinx"`
	HospitalizationsOtherRaceNonLatinx   string `json:"hospitalizations_other_race_non_latinx"`
	HospitalizationsUnknownRaceEthnicity string `json:"hospitalizations_unknown_race_ethnicity"`
}

func main() {

	connStr := "user=postgres dbname=chicago_business_intelligence password=root host=localhost sslmode=disable"

	db, err := sql.Open("postgres", connStr)

	fmt.Println("Successfully connected to go run --work main.go")

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
		go taxiTrips(db)
		go CoviddB(db)
		go healthHumandB(db)
		time.Sleep(12 * time.Hour)
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
		"totalpaid" DOUBLE PRECISION,
		"totalunpaid" DOUBLE PRECISION,
		"totalwaived" DOUBLE PRECISION,
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
		totalpaid := buildPermitResponse[i].TotalPaid
		totalunpaid := buildPermitResponse[i].TotalUnPaid
		totalwaived := buildPermitResponse[i].TotalWaived
		createdAt := time.Now()
		updatedAt := time.Now()

		location, _ := googleGeoCoder.Geocode(address)
		// fmt.Println("\nAddress to be converted to Latitute and Longitude: ", address)

		if location != nil {
			//fmt.Println("\nLatitude and Longitude are: ", location.Lat, location.Lng)
		} else {
			fmt.Println("\nDid not find Latitude and Longitude for below address: ", address)
			continue
		}

		geodecodedAddress, _ := googleGeoCoder.ReverseGeocode(location.Lat, location.Lng)
		if geodecodedAddress != nil {
			//fmt.Println("\nReverse Decoded Address using geocoder API is: ", geodecodedAddress.FormattedAddress)
		} else {
			fmt.Println("\nDid not find an address for the provided latitude and Longitude: ", location.Lat, location.Lng)
			continue
		}
		zipcode := geodecodedAddress.Postcode

		insertQuerySQL := `insert into buildingpermits ("buildPermitId", "permitId", "permitType", "address", "zipcode", "latitude", "longitude", "totalpaid", "totalunpaid", "totalwaived", "createdAt", "updatedAt") values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);`

		_, err := db.Exec(insertQuerySQL, id, permit, permitType, address, zipcode, location.Lat, location.Lng, totalpaid, totalunpaid, totalwaived, createdAt, updatedAt)

		if err != nil {
			panic(err)
		}

	}

}
func unEmployment(db *sql.DB) {
	fmt.Println("Employement Data")
	dropTable := `drop table if exists unemployment_data`
	_, err := db.Exec(dropTable)
	if err != nil {
		panic(err)
	}

	createTable := `create table if not exists "unemployment_data"
	(
		"id" SERIAL,
		"areaCode" BIGINT,
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
		fmt.Println("\nEntire data for Area code is as below: \n", areaCode)
		fmt.Println(areaName, belowPoverty, perCapita, unempRate)

		insertQuerySQL := `insert into unemployment_data ("areaCode", "areaName", "belowPoverty", "perCapita", "unempRate", "createdAt", "updatedAt") values ($1, $2, $3, $4, $5, $6, $7)`

		_, err := db.Exec(insertQuerySQL, areaCode, areaName, belowPoverty, perCapita, unempRate, createdAt, updatedAt)

		if err != nil {
			panic(err)
		}
	}
	fmt.Println("Employement Data Complete")
}

func taxiTripsInitial(db *sql.DB) {
	fmt.Println("Taxi Trips")
	response, err := http.Get("https://data.cityofchicago.org/resource/wrvz-psew.json'")
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}

	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		log.Fatal(err)
	}
	var TaxiTripsResponse TaxiTrips
	json.Unmarshal(body, &TaxiTripsResponse)
	fmt.Println(TaxiTripsResponse[0])

	dropTable := `drop table if exists TaxiTrips`

	_, dropErr := db.Exec(dropTable)

	if dropErr != nil {
		panic(err)
	}

	fmt.Println("Connected!")
	res, er := db.Exec("CREATE TABLE if not exists TaxiTrips " +
		"(TripID VARCHAR ( 500 )," +
		"TaxiID VARCHAR ( 500 )," +
		"TripStartTimestamp VARCHAR ( 500 )," +
		"TripEndTimestamp VARCHAR ( 500 )," +
		"TripSeconds VARCHAR ( 500 )" +
		",TripMiles VARCHAR ( 500 )" +
		",PickupCommunityArea VARCHAR ( 500 )" +
		",DropoffCommunityArea VARCHAR ( 500 )" +
		",Fare VARCHAR ( 500 )" +
		",Tips VARCHAR ( 500 )" +
		",Tolls VARCHAR ( 500 )" +
		",Extras VARCHAR ( 500 )" +
		",TripTotal VARCHAR ( 500 )" +
		",PaymentType VARCHAR ( 500 )" +
		",Company VARCHAR ( 500 )" +
		",PickupCentroidLatitude VARCHAR ( 500 )" +
		",PickupCentroidLongitude VARCHAR ( 500 )" +
		",DropoffCentroidLatitude  VARCHAR ( 500 )" +
		",DropoffCentroidLongitude VARCHAR ( 500 )" +
		",createdAt TIMESTAMP WITH TIME ZONE NOT NULL" +
		",updatedAt TIMESTAMP WITH TIME ZONE NOT NULL);")
	if er != nil {
		fmt.Println(er)
		fmt.Println(res)
	}
	query := `INSERT INTO TaxiTrips(TripID ,
		TripStartTimestamp ,
		TripEndTimestamp ,
		TripSeconds ,
		TripMiles ,
		PickupCommunityArea,
		DropoffCommunityArea ,
		Fare ,
		Tips,
		Tolls,
		Extras ,
		TripTotal,
		PaymentType ,
		Company ,
		PickupCentroidLatitude ,
		PickupCentroidLongitude,
		DropoffCentroidLatitude,
		DropoffCentroidLongitude,
		createdAt,
		updatedAt) 
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20);`
	for i := 0; i < len(TaxiTripsResponse); i++ {
		_, err = db.Exec(query,
			TaxiTripsResponse[i].TripID,
			TaxiTripsResponse[i].TripStartTimestamp,
			TaxiTripsResponse[i].TripEndTimestamp,
			TaxiTripsResponse[i].TripSeconds,
			TaxiTripsResponse[i].TripMiles,
			TaxiTripsResponse[i].PickupCommunityArea,
			TaxiTripsResponse[i].DropoffCommunityArea,
			TaxiTripsResponse[i].Fare,
			TaxiTripsResponse[i].Tips,
			TaxiTripsResponse[i].Tolls,
			TaxiTripsResponse[i].Extras,
			TaxiTripsResponse[i].TripTotal,
			TaxiTripsResponse[i].PaymentType,
			TaxiTripsResponse[i].Company,
			TaxiTripsResponse[i].PickupCentroidLatitude,
			TaxiTripsResponse[i].PickupCentroidLongitude,
			TaxiTripsResponse[i].DropoffCentroidLatitude,
			TaxiTripsResponse[i].DropoffCentroidLongitude,
			time.Now(),
			time.Now())
		fmt.Println(i)
		if err != nil {
			panic(err)
		}
	}
	fmt.Println("Taxi Trips Complete")
}
func taxiTrips(db *sql.DB) {
	fmt.Println("Taxi Trips")
	currentTime := time.Now().Format("2006-01-02") + "T" + time.Now().Format("15:04:05")
	LastCallTime := time.Now().AddDate(0, 0, -31).Format("2006-01-02") + "T" + time.Now().AddDate(0, 0, -31).Format("15:04:05")
	response, err := http.Get("https://data.cityofchicago.org/resource/wrvz-psew.json?$where=trip_start_timestamp%20between%20'" + LastCallTime + "'%20and%20'" + currentTime + "'")
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}

	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		log.Fatal(err)
	}
	dropTable := `drop table if exists TaxiTrips`

	_, dropErr := db.Exec(dropTable)

	if dropErr != nil {
		panic(err)
	}

	fmt.Println("Connected!")
	res, er := db.Exec("CREATE TABLE if not exists TaxiTrips " +
		"(TripID VARCHAR ( 500 )," +
		"TaxiID VARCHAR ( 500 )," +
		"TripStartTimestamp VARCHAR ( 500 )," +
		"TripEndTimestamp VARCHAR ( 500 )," +
		"TripSeconds VARCHAR ( 500 )" +
		",TripMiles VARCHAR ( 500 )" +
		",PickupCommunityArea VARCHAR ( 500 )" +
		",DropoffCommunityArea VARCHAR ( 500 )" +
		",Fare VARCHAR ( 500 )" +
		",Tips VARCHAR ( 500 )" +
		",Tolls VARCHAR ( 500 )" +
		",Extras VARCHAR ( 500 )" +
		",TripTotal VARCHAR ( 500 )" +
		",PaymentType VARCHAR ( 500 )" +
		",Company VARCHAR ( 500 )" +
		",PickupCentroidLatitude VARCHAR ( 500 )" +
		",PickupCentroidLongitude VARCHAR ( 500 )" +
		",DropoffCentroidLatitude  VARCHAR ( 500 )" +
		",DropoffCentroidLongitude VARCHAR ( 500 )" +
		",createdAt TIMESTAMP WITH TIME ZONE NOT NULL" +
		",updatedAt TIMESTAMP WITH TIME ZONE NOT NULL);")
	if er != nil {
		fmt.Println(er)
		fmt.Println(res)
	}
	var TaxiTripsResponse TaxiTrips
	json.Unmarshal(body, &TaxiTripsResponse)
	fmt.Println("Connected!")
	query := `INSERT INTO TaxiTrips(TripID ,
		TripStartTimestamp ,
		TripEndTimestamp ,
		TripSeconds ,
		TripMiles ,
		PickupCommunityArea,
		DropoffCommunityArea ,
		Fare ,
		Tips,
		Tolls,
		Extras ,
		TripTotal,
		PaymentType ,
		Company ,
		PickupCentroidLatitude ,
		PickupCentroidLongitude,
		DropoffCentroidLatitude,
		DropoffCentroidLongitude,
		createdAt,
		updatedAt) 
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20);`
	for i := 0; i < len(TaxiTripsResponse); i++ {
		_, err = db.Exec(query,
			TaxiTripsResponse[i].TripID,
			TaxiTripsResponse[i].TripStartTimestamp,
			TaxiTripsResponse[i].TripEndTimestamp,
			TaxiTripsResponse[i].TripSeconds,
			TaxiTripsResponse[i].TripMiles,
			TaxiTripsResponse[i].PickupCommunityArea,
			TaxiTripsResponse[i].DropoffCommunityArea,
			TaxiTripsResponse[i].Fare,
			TaxiTripsResponse[i].Tips,
			TaxiTripsResponse[i].Tolls,
			TaxiTripsResponse[i].Extras,
			TaxiTripsResponse[i].TripTotal,
			TaxiTripsResponse[i].PaymentType,
			TaxiTripsResponse[i].Company,
			TaxiTripsResponse[i].PickupCentroidLatitude,
			TaxiTripsResponse[i].PickupCentroidLongitude,
			TaxiTripsResponse[i].DropoffCentroidLatitude,
			TaxiTripsResponse[i].DropoffCentroidLongitude,
			time.Now(),
			time.Now())
		fmt.Println(i)
		if err != nil {
			panic(err)
		}
	}
	fmt.Println("Taxi Trips Complete")
}

func CoviddB(db *sql.DB) {
	fmt.Println("Covid 19")
	dropTable := `drop table if exists covid19`
	_, err := db.Exec(dropTable)
	if err != nil {
		panic(err)
	}

	createTable := `create table if not exists "covid19"
	(
		"ID" BIGINT,
		"ZIPCode" CHAR(5),
		"Tests" VARCHAR(255),
		"PercentageTestedPositive" VARCHAR(255),
		"Deaths" VARCHAR(255),
		"createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
		"updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
		PRIMARY KEY("ID")
		
	);`

	_, createTableErr := db.Exec(createTable)
	if createTableErr != nil {
		panic(err)
	}

	res, err := http.Get("https://data.cityofchicago.org/resource/yhhz-zm2v.json")
	if err != nil {
		log.Fatal(err)
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		log.Fatal(err)
	}

	var covid19Response covid
	json.Unmarshal(body, &covid19Response)
	fmt.Println(covid19Response[0])

	for i := range covid19Response {
		ID := i
		ZIPCode := covid19Response[i].ZIPCode
		Tests := covid19Response[i].Tests
		PercentageTestedPositive := covid19Response[i].PercentageTestedPositive
		Deaths := covid19Response[i].Deaths
		createdAt := time.Now()
		updatedAt := time.Now()

		insertQuerySQL := `insert into covid19 ("ID", "ZIPCode", "Tests", "PercentageTestedPositive", "Deaths", "createdAt", "updatedAt") values ($1, $2, $3, $4, $5, $6, $7);`

		_, err := db.Exec(insertQuerySQL, ID, ZIPCode, Tests, PercentageTestedPositive, Deaths, createdAt, updatedAt)

		if err != nil {
			panic(err)
		}

	}
	fmt.Println("Covid Complete")
}

func healthHumandB(db *sql.DB) {
	fmt.Println("Human Services")
	dropTable := `drop table if exists healthhumanservices`
	_, err := db.Exec(dropTable)
	if err != nil {
		panic(err)
	}

	createTable := `create table if not exists "healthhumanservices"
	(
		"CasesTotal" INT,
		"DeathTotal" VARCHAR(255),
		"HospitalizationsTotal" VARCHAR(255),
		"createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
		"updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
	);`

	_, createTableErr := db.Exec(createTable)
	if createTableErr != nil {
		panic(err)
	}

	res, err := http.Get("https://data.cityofchicago.org/resource/naz8-j4nc.json")
	if err != nil {
		log.Fatal(err)
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		log.Fatal(err)
	}

	var healthHumanServiceResponse healthHuman
	json.Unmarshal(body, &healthHumanServiceResponse)
	fmt.Println(healthHumanServiceResponse[0])

	for i := range healthHumanServiceResponse {
		CasesTotal := healthHumanServiceResponse[i].CasesTotal
		DeathTotal := healthHumanServiceResponse[i].DeathTotal
		HospitalizationsTotal := healthHumanServiceResponse[i].HospitalizationsTotal
		createdAt := time.Now()
		updatedAt := time.Now()

		if CasesTotal == "" {
			CasesTotal = "0"
		}
		if DeathTotal == "" {
			DeathTotal = "0"
		}
		if HospitalizationsTotal == "" {
			HospitalizationsTotal = "0"
		}

		insertQuerySQL := `insert into healthhumanservices ("CasesTotal", "DeathTotal", "HospitalizationsTotal", "createdAt", "updatedAt") values ($1, $2, $3, $4, $5)`

		_, err := db.Exec(insertQuerySQL, CasesTotal, DeathTotal, HospitalizationsTotal, createdAt, updatedAt)

		if err != nil {
			panic(err)
		}
	}
	fmt.Println("Human complete")
}

func covidCCVI(db *sql.DB) {
	fmt.Println("CCVI")
	response, err := http.Get("https://data.cityofchicago.org/resource/naz8-j4nc.json")
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}

	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		log.Fatal(err)
	}
	var CovidCCVIResponse EthnicityCovid19
	json.Unmarshal(body, &CovidCCVIResponse)
	fmt.Println(CovidCCVIResponse[0])

	dropTable := `drop table if exists EthnicityCovid19`

	_, dropErr := db.Exec(dropTable)

	if dropErr != nil {
		panic(err)
	}

	res, er := db.Exec("CREATE TABLE EthnicityCovid19 (LabReportDate VARCHAR ( 50 ),CasesTotal VARCHAR ( 50 )," +
		"DeathsTotal VARCHAR ( 50 ),HospitalizationsTotal VARCHAR ( 50 )," +
		"CasesLatinx VARCHAR ( 50 ),CasesAsianNonLatinx VARCHAR ( 50 )," +
		"CasesBlackNonLatinx VARCHAR ( 50 ),CasesWhiteNonLatinx VARCHAR ( 50 )," +
		"CasesOtherNonLatinx VARCHAR ( 50 ),CasesUnknownRaceEth VARCHAR ( 50 )," +
		"DeathsLatinx VARCHAR ( 50 ),DeathsAsianNonLatinx VARCHAR ( 50 )," +
		"DeathsBlackNonLatinx VARCHAR ( 50 ),DeathsWhiteNonLatinx VARCHAR ( 50 )," +
		"DeathsOtherNonLatinx VARCHAR ( 50 ),DeathsUnknownRaceEth VARCHAR ( 50 )," +
		"HospitalizationsLatinx VARCHAR ( 50 ),HospitalizationsAsianNonLatinx VARCHAR ( 50 )," +
		"HospitalizationsBlackNonLatinx VARCHAR ( 50 ),HospitalizationsWhiteNonLatinx VARCHAR ( 50 )," +
		"HospitalizationsOtherNonLatinx VARCHAR ( 50 ),HospitalizationsUnknownRaceEth VARCHAR ( 50 )," +
		"createdAt TIMESTAMP WITH TIME ZONE NOT NULL," +
		"updatedAt TIMESTAMP WITH TIME ZONE NOT NULL);")
	if er != nil {
		fmt.Println(er)
		fmt.Println(res)
	}

	query := `INSERT INTO EthnicityCovid19(LabReportDate,
		CasesTotal,
		DeathsTotal,
		HospitalizationsTotal,
		CasesLatinx,
		CasesAsianNonLatinx,
		CasesBlackNonLatinx,
		CasesWhiteNonLatinx,
		CasesOtherNonLatinx,
		CasesUnknownRaceEth,
		DeathsLatinx,
		DeathsAsianNonLatinx,
		DeathsBlackNonLatinx,
		DeathsWhiteNonLatinx,
		DeathsOtherNonLatinx,
		DeathsUnknownRaceEth,
		HospitalizationsLatinx,
		HospitalizationsAsianNonLatinx,
		HospitalizationsBlackNonLatinx,
		HospitalizationsWhiteNonLatinx,
		createdAt,
		updatedAt) 
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22);`
	for i := 0; i < len(CovidCCVIResponse); i++ {
		_, err = db.Exec(query, CovidCCVIResponse[i].LabReportDate,
			CovidCCVIResponse[i].CasesTotal,
			CovidCCVIResponse[i].DeathsTotal,
			CovidCCVIResponse[i].HospitalizationsTotal,
			CovidCCVIResponse[i].CasesLatinx,
			CovidCCVIResponse[i].CasesAsianNonLatinx,
			CovidCCVIResponse[i].CasesBlackNonLatinx,
			CovidCCVIResponse[i].CasesWhiteNonLatinx,
			CovidCCVIResponse[i].CasesOtherNonLatinx,
			CovidCCVIResponse[i].CasesUnknownRaceEth,
			CovidCCVIResponse[i].DeathsLatinx,
			CovidCCVIResponse[i].DeathsAsianNonLatinx,
			CovidCCVIResponse[i].DeathsBlackNonLatinx,
			CovidCCVIResponse[i].DeathsWhiteNonLatinx,
			CovidCCVIResponse[i].DeathsOtherNonLatinx,
			CovidCCVIResponse[i].DeathsUnknownRaceEth,
			CovidCCVIResponse[i].HospitalizationsLatinx,
			CovidCCVIResponse[i].HospitalizationsAsianNonLatinx,
			CovidCCVIResponse[i].HospitalizationsBlackNonLatinx,
			CovidCCVIResponse[i].HospitalizationsWhiteNonLatinx)
		fmt.Println(i)
		if err != nil {
			panic(err)
		}
	}
	fmt.Println("CCVI Complete")
}
