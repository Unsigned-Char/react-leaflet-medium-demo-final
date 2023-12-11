import React, { useState } from 'react'
import { 
  useMapEvents, 
  TileLayer, 
  LayersControl,
  LayerGroup,
  GeoJSON, 
  Marker, 
  Popup 
} from 'react-leaflet'
import L from 'leaflet'
import { Typography, Divider } from '@material-ui/core'
import STM from '../STMLines.json'
//import MT from '../data/Montana.json'
//import ND from '../data/NorthDakota.json'
//import SD from '../data/SouthDakota.json'

const Layers = () => {
  const [borderData, setBorderData] = useState([STM])

  const map = useMapEvents({
    zoomend: () => {
      console.log(map.getZoom())
    },
    moveend: () => {
      console.log(map.getBounds())
    }
  })

  const onMouseEvent = (event, type) => {
    switch (type) {
      case 'over':
        event.target.setStyle({ fillOpacity: 0.5 })
        break
      case 'out':
        event.target.setStyle({ fillOpacity: 0.0 })
        break
      default:
        break
    }
  }

  return (
    <>
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Basic Map">
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Topo Map">
          <TileLayer
            attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        {borderData.map((data) => {
          //const geojson = data.features[0].geometry
          //const route_name = data.features[0].properties.headsign + " - " + data.features[0].properties.route_name

          let itemList=[];
          data.features.forEach( (feature) => {
                  const geojson = feature.geometry
                  const route_name = feature.properties.headsign + " - " + feature.properties.route_name
                  itemList.push(
                      <>
                      <LayersControl.Overlay checked name={route_name}>
                        <LayerGroup>
                          <GeoJSON 
                            key={route_name} 
                            data={geojson} 
                            pathOptions={{ color: 'blue' }}
                            eventHandlers={{
                              mouseover: (event, type) => onMouseEvent(event, 'over'),
                              mouseout: (event, type) => onMouseEvent(event, 'out'),
                            }}
                          >
                          </GeoJSON>
                      </LayerGroup>
                    </LayersControl.Overlay>)
                    </>          
          }
          return (
              {itemList}     
          )
        })}
      </LayersControl>
    </>
  )
}

export default Layers
