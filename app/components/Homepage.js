import React from 'react';
import {
  Text,
  View,
  Button,
} from 'react-native';
import axios from 'axios'
import { Container, Header, Content, Card, CardItem, Body, Image } from 'native-base';


class Homepage extends React.Component {
    state = {latitude: '', longitude: '', error: '', weather: []}

    componentDidMount() {
        navigator.geolocation.getCurrentPosition(
        (position) => {
            this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
            }, () => this.getWeather());
        },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
        );

       
    }

    getWeather = () => {
        api = `https://api.weather.gov/points/${this.state.latitude},${this.state.longitude}/forecast`
        axios.post('http://localhost:3001/open_weather_api', {api: api})
        .then( res => {
            this.setState({weather: res.data.properties.periods})
            console.log(this.state.weather)
        })
        .catch(
            console.log('api error')
        )
    }

    displayWeather = () => {
        let weather = this.state.weather[0]
        return(
            <Container>
                <Header >
                    <Text>{weather.name}</Text>
                </Header>
                <Content>
                <Card>
                    <CardItem>
                    
                    <Body>
                        <Text>
                           {weather.shortForecast}  
                        </Text>
                    </Body>
                    </CardItem>
                </Card>
                </Content>
            </Container>
        )
    }

    displayText = () => {
        return(
            <Text>Nothing to display</Text> 
        )

    }


    render(){
        let { weather } = this.state
        return(
            <View>
                { weather.length > 0 ? this.displayWeather() : this.displayText()}
            </View>
        )
    }
}

export default Homepage;