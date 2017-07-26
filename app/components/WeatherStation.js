import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Container, Grid, Button, Divider, Segment, Checkbox, Label } from 'semantic-ui-react';
// import Compare from './Compare';
// import SavedLocations from './SavedLocations'
// import SensorActual from './SensorActual'
// import CurrentLocation from './CurrentLocation'
// import WeeklyForecast from './WeeklyForecast'
// import { setCurrentLocation } from '../actions/locations'
// import TodaysWeather from './TodaysWeather'
// import ToggleFavoriteLocation  from './ToggleFavoriteLocation'
// import ForecastChart from './ForecastChart'
// import { weatherForecastWeekly, setCityView, updateCurrentLoctions } from '../actions/weatherForecasts'



class WeatherStation extends Component {
  state = {cityView: '', view: true, citySeries: [], series: [], byTemp: 'high' }

  componentDidMount() {
    this.checkIfLocation()
    // clearForecast(this.props.dispatch, this.checkIfLocation)
  }

  //ensure you have your current location
  checkIfLocation = () => {
    let { currentLocation, cityView } = this.props
    if(!currentLocation.latitude){
      this.getLocation()
    }
    this.setState({cityView: cityView })
  }

  //Gets user lat long and calls setPosition
  getLocation = () => {
    if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition( (position) => {
       let latitude = position.coords.latitude;
       let longitude = position.coords.longitude;
       this.setPosition(latitude, longitude)
       })
    }else{
      console.log('Your browser doesnt support this')
    }
  }

  //calls you currently don't have weather for current location it call setCurrentLocation action
  setPosition = (latitude, longitude) => {
    let { dispatch } = this.props
    dispatch(setCurrentLocation(latitude, longitude, () => this.checkWeather(latitude, longitude)))
  }

  checkWeather = (latitude, longitude) => {
    let { dispatch, weather, addresses } = this.props
    if(!weather){
      dispatch(weatherForecastWeekly([latitude, longitude], addresses[0].city, () => this.updateCityView(addresses)))
    }
  }

  updateCityView = (addresses) => {
    let { dispatch } = this.props
    setCityView(addresses[0].city, dispatch)
    this.updateForecastCity()
  }



  updateForecastCity = () => {
    let { addresses, dispatch, weatherForecasts} = this.props
    let updatedForecasts = weatherForecasts

    updatedForecasts.weekly.forEach( location => {
      if(location.city === 'Current Location'){
        location.city = addresses[0].city
      }
    })
    updateCurrentLoctions(dispatch, updatedForecasts)
  }

  setViewToTrue = () => {
    this.setState({view: true})
  }

  setViewToFalse = () => {
    this.setState({view: false})
  }

  showForecast = () => {
    return (
      <Grid.Row >
        <Grid.Column width={12} >
           <WeeklyForecast cityView={this.state.cityView}/>
        </Grid.Column>
        <Grid.Column width={4} className='ws_area'>
             <SavedLocations />
        </Grid.Column>
      </Grid.Row>
    )
  }

  catchToggle = (e) => {
    let { weatherForecasts } = this.props
    let { citySeries } = this.state
    let exists = false
    let changedCity = e.target.innerText


    citySeries.forEach( (city) => {
      if(city === changedCity ){
        exists = true
      }
    })

    if(exists){

      let index = citySeries.indexOf(changedCity)
      if (index !== -1) {
        citySeries.splice(index, 1)
      }

      this.setState({citySeries: [...citySeries]}, this.setSeriesState)
    }else{
      this.setState({citySeries: [...this.state.citySeries, changedCity]}, this.setSeriesState)
    }
  }

  displayToggles = () => {
    let { weatherForecasts } = this.props
    return weatherForecasts.weekly.map( (fav, i) => {
      return <ToggleFavoriteLocation key={i} fav={fav} catchToggle={this.catchToggle}/>
    })
  }

  setSeriesState = () => {
    let { weatherForecasts } = this.props
    let { citySeries, byTemp } = this.state

    const tempData = [];
    citySeries.forEach( (city) => {

        let forecastData = weatherForecasts.weekly.filter( (forecast) => {
          return city === forecast.city
        })

        let dayInfo = []
        forecastData.forEach( (object) => {
          object.days.forEach( (obj) => {
            if(byTemp === 'high'){
              if(obj.isDaytime){
                dayInfo.push(obj.temperature)
              }
            }else if(byTemp === 'low' ){
              if(!obj.isDaytime){
                dayInfo.push(obj.temperature)
              }
            }
          })
        })

        let time = forecastData[0].days[0].startTime
        let year = time.substring(0,4)
        let month = time.substring(5,7)
        let day = time.substring(8, 10)
        let formattedTime = Date.UTC(year, month, day)
        let type = ''
        if(byTemp){
          type = 'high'
        }else{
          type = 'low'
        }
        tempData.push(
          {
            name: forecastData[0].city,
            startTime: formattedTime,
            data: [...dayInfo],
          }
        )
    })
    this.setState({series: tempData})
  }

  changeByTemp = () => {
    let { byTemp } = this.state
    if(byTemp === 'high'){
      this.setState({byTemp: 'low' }, this.setSeriesState)
    }else if(byTemp === 'low'){
      this.setState({byTemp: 'high'}, this.setSeriesState)
    }

  }

  showCompare = () => {
    let { weekly } = this.props.weatherForecasts
    let { byTemp, series } = this.state
    return(
      <Grid.Row >
        <ForecastChart series={series} byTemp={byTemp} />
        <Grid.Column width={4}>
          <Segment textAlign='center'>
            <Label horizontal color='teal' >High</Label><Checkbox slider onChange={this.changeByTemp} /><Label horizontal color='blue' >Low</Label>
          </Segment>
          <Divider />
          {this.displayToggles()}
        </Grid.Column>
      </Grid.Row>
    )
  }

  render(){
    let { view } = this.state
    return (
      <Container>
        <Grid>
          <Grid.Row >
            <Grid.Column width={16}>
               <CurrentLocation />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16}>
              <TodaysWeather/>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row >
            <Grid.Column width={10}>
            </Grid.Column>
            <Grid.Column width={6}>
              <Button.Group>
                <Button primary onClick={this.setViewToTrue}>Forecast</Button>
                <Button.Or />
                <Button secondary onClick={this.setViewToFalse}>Compare</Button>
              </Button.Group>
            </Grid.Column>
          </Grid.Row>
           { view ? this.showForecast() : this.showCompare()}
        </Grid>
      </Container>
    )

  }
}

const mapStateToProps = (state) => {
  return {
            weather: state.weatherForecasts.weekly[0],
            currentLocation: state.currentLocation,
            addresses: state.addresses,
            cityView: state.weatherForecasts.cityView,
            weatherForecasts: state.weatherForecasts,
          };

}

export default connect(mapStateToProps)(WeatherStation);
