import * as React from 'react';
import './weathers.css'
export interface WeatherProps {
}

export default function Weatherapi(props: WeatherProps) {

    const spitOutCelcius = (kelvin: any) => {
        const celcius = Math.round(kelvin - 273.15);
        return celcius;
    }

    const getWeatherIcon = (iconParameter: any) => {
        const icon = `https://openweathermap.org/img/wn/${iconParameter}@2x.png`
        return <img src={icon} alt="" />
    }

    const [weatherResult, setWeatherResult] = React.useState<any>({})
    const [daily,setDaily]=React.useState<any>([])
    const [loading, setLoading] = React.useState<any>(true)
    const onSearchSubmit = async (searchInputValue: any) => {
        var requestOptions: any = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch("https://api.openweathermap.org/data/2.5/weather?q=london&appid=ca261c971d5638db9d4d6cbccc1f093d", requestOptions)
            .then(response => response.json())
            .then((result: any) => (setWeatherResult(result),console.log(result)))
            .catch(error => console.log('error', error));
    }
    const weeklyforecast=()=>{


        var requestOptions:any = {
            method: 'GET',
            redirect: 'follow'
          };
          
          fetch("http://api.openweathermap.org/geo/1.0/direct?q=london&appid=8614d94ffd764381ae6a84755b454a7c", requestOptions)
            .then(response => response.json())
            .then(result=> fetch("https://api.openweathermap.org/data/2.5/onecall?exclude=minutely&appid=ca261c971d5638db9d4d6cbccc1f093d&lat="+result[0].lat+"&lon="+result[0].lon, requestOptions1)
            .then(response => response.json())
            .then((result: any) => (console.log(result.daily),setDaily(result.daily),setLoading(false)))
            .catch(error => console.log('error', error)))
        var requestOptions1: any = {
            method: 'GET',
            redirect: 'follow'
        };

        
    }
    React.useEffect(() => {
        onSearchSubmit("london");
        weeklyforecast()
    }, [])
    return (
        <div>
            {loading ? <p>loading..</p> :<>
                <div className="card rounded my-3 shadow-lg back-card">
                    <div className="card-top text-center my-3">
                        <div className="city-name my-3">
                            <p>london</p>
                            {/* <span>...</span> */}
                        </div>
                    </div>

                    <div className="card-body my-5">
                        <div className="card-mid row">
                            <div className="col-8 text-center temp">
                                <span>{spitOutCelcius(weatherResult.main.temp)}&deg;C</span>
                            </div>
                            <div className="icon-container card shadow mx-auto">
                                {getWeatherIcon(weatherResult.weather[0].icon)}
                            </div>
                            <div className="col-4 condition-temp">
                                <p className="condition">{weatherResult.weather[0].description}</p>
                                <p className="high">Max: {spitOutCelcius(weatherResult.main.temp_min)}&deg;C</p>
                                <p className="low">Min: {spitOutCelcius(weatherResult.main.temp_max)}&deg;C</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="smallcards">
                    {daily.map((day:any,index:number)=>(
                <div className={'weather-card'}>
                <div className='weather-card__day'>{new Date(day.dt * 1000).toLocaleString('en-US', { weekday: 'short' })}</div>
                <div className='weather-card__icon'>
                {getWeatherIcon(day.weather[0].icon)}
                </div>
                <div className='weather-card__temp'>
                  {spitOutCelcius(day.temp.day)}<span>°C</span>
                </div>
                <div>{day.weather[0].main}</div>
              </div>
                    ))}
              </div>
              </>
                }
                
        </div>
    );
}
