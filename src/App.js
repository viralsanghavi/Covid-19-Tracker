import React, { useState, useEffect } from 'react'
import './App.css'
import { FormControl, Select, MenuItem, Card, CardContent } from '@material-ui/core'
import InfoBox from './InfoBox'
import Map from './Map'
import Table from './Table'
import { sortData, prettyPrintStat } from './util'
import LineGraph from './LineGraph'
import "leaflet/dist/leaflet.css"


// https://disease.sh/v3/covid-19/countries
// Will give JSON Javasccript objvet notation
function App() {
  const [countries, setCountries] = useState([
  ])
  const [country, setCountry] = useState('Worldwide')
  const [countryInfo, setCountryInfo] = useState('')
  const [tableData, setTableData] = useState([])
  const [mapZoom, setMapZoom] = useState(3)
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 })
  const [mapCountries, setMapCountries] = useState([])
  const [casesType, setCasesType] = useState('cases')


  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {

        setCountryInfo(data)
      })
  }, [])

  useEffect(() => {
    // code runs when once component loads and not again  after 
    // async =? send a req wait for it  do something with the info
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then(data => {
          const countries = data.map((country) => (
            {
              name: country.country,
              value: country.countryInfo.iso2
            }
          ))
          const sortedData = sortData(data)

          setTableData(sortedData)
          setMapCountries(data)
          setCountries(countries)
        })
    }
    getCountriesData()
  }, [])

  const onCountryChange = async (e) => {
    const countryCode = e.target.value
    setCountry(countryCode)
    const url = countryCode === 'Worldwide' ? 'https://disease.sh/v3/covid-19/countries/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(countryCode)
        setCountryInfo(data)
        console.log(data.countryInfo);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long])
        setMapZoom(4)
      })
  }
  return (
    <div className="app">

      <div className="app__left">
        <div className="app__header">

          <h1>COVID-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value='Worldwide' >{country}</MenuItem>
              {
                countries.map(
                  (country) => (
                    <MenuItem value={country.value}>
                      {country.name}
                    </MenuItem>
                  )
                )
              }
              {/* loop through all contriess */}


              {/* <MenuItem value="worldwide">Worldwide</MenuItem>
            <MenuItem value="worldwide">op2</MenuItem>
            <MenuItem value="worldwide">op3</MenuItem>
            <MenuItem value="worldwide">op6</MenuItem> */}
            </Select>
          </FormControl>
        </div>

        {/* Header */}

        {/* Title + Select input field */}






        <div className="app__stats">
          {/* Info Boxes cases */}
          {/* Info Boxes recover */}
          {/* Info Boxes decease */}
          <InfoBox
            title="Coronavirus Cases"
            active={casesType === "cases"}
            isRed
            total={prettyPrintStat(countryInfo.cases)}
            cases={prettyPrintStat(countryInfo.todayCases)}
            onClick={e => setCasesType('cases')} />
          <InfoBox
            title="Recovered"
            total={prettyPrintStat(countryInfo.recovered)}
            active={casesType === "recovered"}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            onClick={e => setCasesType('recovered')}
          />
          <InfoBox
            active={casesType === "deaths"}
            isRed
            title="Deaths"
            total={prettyPrintStat(countryInfo.deaths)}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            onClick={e => setCasesType('deaths')}
          />
        </div>



        {/* Map */}
        <Map countries={mapCountries} casesType={casesType} center={mapCenter} zoom={mapZoom} />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live</h3>
          <Table countries={tableData} />
          <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>
      </Card>

    </div>

  )
}

export default App
