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

const (
	host     = "localhost"
	port     = 5432
	user     = "postgres"
	password = "root"
	dbname   = "chicago_business_intelligence"
)

type EthnicityCovid19 struct {
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

func main_test() {
	response, err := http.Get("https://data.cityofchicago.org/resource/naz8-j4nc.json")
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}

	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		log.Fatal(err)
	}
	var result []EthnicityCovid19
	json.Unmarshal(body, &result)
	fmt.Println(result[0])
	psqlconn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", host, port, user, password, dbname)

	// open database
	db, err := sql.Open("postgres", psqlconn)
	CheckError(err)
	if err != nil {
		panic(err)
	}
	// Run Once To Create Table
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
		"HospitalizationsOtherNonLatinx VARCHAR ( 50 ),HospitalizationsUnknownRaceEth VARCHAR ( 50 ));")
	if er != nil {
		fmt.Println(er)
		fmt.Println(res)
	}
	// close database
	query := "INSERT INTO EthnicityCovid19(LabReportDate,CasesTotal,DeathsTotal,HospitalizationsTotal,CasesLatinx,CasesAsianNonLatinx,CasesBlackNonLatinx,CasesWhiteNonLatinx,CasesOtherNonLatinx,CasesUnknownRaceEth,DeathsLatinx,DeathsAsianNonLatinx,DeathsBlackNonLatinx,DeathsWhiteNonLatinx,DeathsOtherNonLatinx,DeathsUnknownRaceEth,HospitalizationsLatinx,HospitalizationsAsianNonLatinx,HospitalizationsBlackNonLatinx,HospitalizationsWhiteNonLatinx) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20);"
	for i := 0; i < len(result); i++ {
		_, err = db.Exec(query, result[i].LabReportDate,
			result[i].CasesTotal,
			result[i].DeathsTotal,
			result[i].HospitalizationsTotal,
			result[i].CasesLatinx,
			result[i].CasesAsianNonLatinx,
			result[i].CasesBlackNonLatinx,
			result[i].CasesWhiteNonLatinx,
			result[i].CasesOtherNonLatinx,
			result[i].CasesUnknownRaceEth,
			result[i].DeathsLatinx,
			result[i].DeathsAsianNonLatinx,
			result[i].DeathsBlackNonLatinx,
			result[i].DeathsWhiteNonLatinx,
			result[i].DeathsOtherNonLatinx,
			result[i].DeathsUnknownRaceEth,
			result[i].HospitalizationsLatinx,
			result[i].HospitalizationsAsianNonLatinx,
			result[i].HospitalizationsBlackNonLatinx,
			result[i].HospitalizationsWhiteNonLatinx)
		fmt.Println(i)
		if err != nil {
			panic(err)
		}
	}

	defer db.Close()

	// check db
	err = db.Ping()
	CheckError(err)

	fmt.Println("Connected!")

}
func CheckError(err error) {
	if err != nil {
		panic(err)
	}
}
