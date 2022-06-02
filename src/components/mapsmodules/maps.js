import React,{useEffect} from 'react';
import { GoogleMap, useLoadScript, useJsApiLoader } from '@react-google-maps/api';
import { Marker } from '@react-google-maps/api';
import "./maps.css"

const containerStyle = {
  width: '400px',
  height: '250px'
};

var center = {
  lat: 13.1986348,
  lng: 77.7065928,
};
const Maps = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
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
  const [location, setLocation] = React.useState();
  const [restaurant, setResturents] = React.useState([])
  const predictionsRef = React.useRef();
  
  const onLoad = React.useCallback(function callback(map) {
    var pyrmont = new window.google.maps.LatLng(15.837732075398238, 78.02613648167242);

    infowindow = new window.google.maps.InfoWindow();

    map1 = new window.google.maps.Map(document.createElement('div'), {
      center: pyrmont,
      // zoom: 1,
    });
    const request1 = {
      query: location,
      fields: ["name", "geometry"],
    };
    var request;

    service = new window.google.maps.places.PlacesService(map1);
    request = {
      location: {
        lat: 13.1986348,
        lng: 77.7065928,
      },
      radius: 500,
      type: ['restaurant'],
    };
    
    service.nearbySearch(request, callback);
    


    function callback(results, status) {
      
      if (status == window.google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          setResturents(results)
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
    const bounds = new window.google.maps.LatLngBounds(center);
    // map.fitBounds(bounds);
    setMap(map)
    // console.log(map.getZoom())

  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  return (
    <div id="map">
      <div id="map1">
      {isLoaded ?
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={16}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            { /* Child components, such as markers, info windows, etc. */}
            <Marker position={{ lat: -3.746122699999999, lng: -38.5230346 }} />
            <></>
          </GoogleMap> : <p>loading..</p>}
          </div>
      <div className='list1'>
        {restaurant.map((res1) => (<><div className='list'>
          <div>
            <h4>{res1.name}</h4>
            <h4>{res1.opening_hours!=undefined?res1.opening_hours.open_now:"nothing"}</h4>
            <p>{"rating:" + res1.rating}</p>
            {/* <p>{res1["opening_hours"]?res1["opening_hours"]["open_now"]:"Data not available"}</p> */}
            <p>{"Address:"+res1["vicinity"]}</p>
          </div>
          <div style={{paddingTop:"15px",paddingLeft:"5px"}}>
            
          {res1.photos != undefined ? <img src={res1["photos"][0].getUrl()} height={150} width={150} style={{borderRadius:"5px"}}/> : <img src={"https://thumbs.dreamstime.com/b/no-image-available-icon-photo-camera-flat-vector-illustration-132483141.jpg"} height={150} width={150} />}
          </div>
          
        </div>
        <div style={{width:"90%",borderBottom:"0.5px solid grey",marginLeft:"20px"}}></div>
        </>))}</div>
    </div>
  );
}
export default Maps;

