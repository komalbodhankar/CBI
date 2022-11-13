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

	_ "github.com/lib/pq"
)

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
		go CoviddB(db)
		go healthHumandB(db)
		time.Sleep(10 * time.Minute)
	}

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop

	log.Println("Shutting Down")
}

func CoviddB(db *sql.DB) {
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
}

func healthHumandB(db *sql.DB) {
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

}
