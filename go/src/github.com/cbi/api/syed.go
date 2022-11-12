package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	_ "github.com/lib/pq"
)

type TaxiTrips struct {
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

const (
	host     = "localhost"
	port     = 5432
	user     = "postgres"
	password = "root"
	dbname   = "chicago_business_intelligence"
)

func main() {
	response, err := http.Get("https://data.cityofchicago.org/resource/wrvz-psew.json?$where=trip_start_timestamp%20between%20'2022-01-10T12:00:00'%20and%20'2022-01-11T14:00:00'")

	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}

	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		log.Fatal(err)
	}
	var result []TaxiTrips
	json.Unmarshal(body, &result)
	fmt.Println(result[0])
	psqlconn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", host, port, user, password, dbname)

	// open database
	db, err := sql.Open("postgres", psqlconn)
	if err != nil {
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
		",DropoffCentroidLongitude VARCHAR ( 500 ));")
	if er != nil {
		fmt.Println(er)
		fmt.Println(res)
	}
	query := "INSERT INTO TaxiTrips(TripID ,TripStartTimestamp ,TripEndTimestamp ,TripSeconds ,TripMiles ,PickupCommunityArea,DropoffCommunityArea ,Fare ,Tips,Tolls,Extras ,TripTotal,PaymentType ,Company ,PickupCentroidLatitude ,PickupCentroidLongitude,DropoffCentroidLatitude,DropoffCentroidLongitude) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18);"
	for i := 0; i < len(result); i++ {
		_, err = db.Exec(query,
			result[i].TripID,
			result[i].TripStartTimestamp,
			result[i].TripEndTimestamp,
			result[i].TripSeconds,
			result[i].TripMiles,
			result[i].PickupCommunityArea,
			result[i].DropoffCommunityArea,
			result[i].Fare,
			result[i].Tips,
			result[i].Tolls,
			result[i].Extras,
			result[i].TripTotal,
			result[i].PaymentType,
			result[i].Company,
			result[i].PickupCentroidLatitude,
			result[i].PickupCentroidLongitude,
			result[i].DropoffCentroidLatitude,
			result[i].DropoffCentroidLongitude)
		fmt.Println(i)
		if err != nil {
			panic(err)
		}
	}
}
