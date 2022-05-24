import * as React from 'react';
import { GoogleMap, useLoadScript, useJsApiLoader } from '@react-google-maps/api';
import { Marker } from '@react-google-maps/api';
import "./maps.css"

const containerStyle = {
  width: '400px',
  height: '250px'
};

var center = {
  lat: 15.837732075398238, 
  lng: 78.02613648167242,
};
const Maps = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey:process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  })
  var map1;
  var service;
  var infowindow;
  var request = {
    location: 'pyrmont',
    radius: '500',
    type: ['restaurant']
  };



  const [map, setMap] = React.useState()
  const [location,setLocation]=React.useState();
  const [restaurant,setResturents]=React.useState([])
  const predictionsRef = React.useRef();

  async function newcheck() {

    var pyrmont = new window.google.maps.LatLng(15.837732075398238, 78.02613648167242);

    infowindow = new window.google.maps.InfoWindow();

    map1 = new window.google.maps.Map(document.createElement('div'), {
      center: pyrmont,
      zoom: 1,
    });
    const request1 = {
      query: location,
      fields: ["name", "geometry"],
    };
    var request;

    service = new window.google.maps.places.PlacesService(map1);

    service.findPlaceFromQuery(
      request1,
      (
        results,
        status
      ) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          for (let i = 0; i < results.length; i++) {
            createMarker(results[i]);
          }
          request= {
            location:{lat: results[0]["geometry"]["location"]["lat"](), 
              lng: results[0]["geometry"]["location"]["lng"](),},
            radius: 500,
            type: ['restaurant'],
          };
          center={lat: results[0]["geometry"]["location"]["lat"](), 
          lng: results[0]["geometry"]["location"]["lng"](),}
          service.nearbySearch(request, callback);
          
        }
      }
    );
    

    function callback(results, status) {
      if (status == window.google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          setResturents(results)
          if(results[i]["photos"]!=undefined){

            console.log(results[i]["photos"][0].getUrl())
            if(results[i]["plus_code"]){

              console.log(results[i]["plus_code"]["compound_code"])
            }
          }
          createMarker(results[i]);
        }
      }
    }
    function createMarker(place) {
      if (!place.geometry || !place.geometry.location) return;

      const marker = new window.google.maps.Marker({
        map,
        position: place.geometry.location,
      });

      window.google.maps.event.addListener(marker, 'click', () => {
        infowindow.setContent(place.name || '');
        infowindow.open(map);
      });
    }
  }

  

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map)

  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  return (
    <div id="map">

      
      {isLoaded ?
      <div id="map1">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={1}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          { /* Child components, such as markers, info windows, etc. */}
          <Marker position={{ lat: -3.746122699999999, lng: -38.5230346 }} />
          <></>
        </GoogleMap></div>: <p>loading..</p>}
       
        <div className='list1'>
        <div className='input1' style={{maxwidth:"350px",marginTop:"300px"}}>
      <input type="text" placeholder="Search.." name="search" onChange={(e)=>{setLocation(e.target.value)}}/>
      <button type="submit" onClick={()=>{newcheck()}}><i className="fa fa-search"></i></button></div>
        {restaurant.map((res1)=>(<div className='list'>
          <div style={{display:'flex',flexDirection:'column'}}>
          <p>{res1.name}</p>
          <p>{"rating:"+res1.rating}</p>
            {/* <p>{res1["opening_hours"]?res1["opening_hours"]["open_now"]:"Data not available"}</p> */}
            <p>{res1["vicinity"]}</p>
            </div>
        {res1.photos!=undefined?<img src={res1["photos"][0].getUrl()} height={100} width={100}/>:null}
          </div>

        ))}</div>
    </div>
  );
}
export default Maps;

