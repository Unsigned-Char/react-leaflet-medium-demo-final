import React, { useState } from 'react'
//import { useEffect } from 'react';
import { 
  useMapEvents, 
  TileLayer, 
  LayersControl,
  FeatureGroup,
  GeoJSON,
  Tooltip
} from 'react-leaflet'
//import { Typography, Divider } from '@material-ui/core'
import STM from '../data/STMLines.json'

const LineStyle = (route_name) => {

  if (/Bleue/i.test(route_name))
    return { 'color': '#0000CC', 'opacity': 0.5 }
  if (/Orange/i.test(route_name)) 
    return { 'color': '#CC5200', 'opacity': 0.5 }
  if (/Jaune/i.test(route_name)) 
    return { 'color': '#CCCC00', 'opacity': 0.5 }
  if (/Verte/i.test(route_name)) 
    return { 'color': '#00CC00', 'opacity': 0.5 }

  return { 'color': '#6699CC', 'opacity': 0.5 }

}

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
        {borderData.map((data, index) => {

          let itemList=[]
          let idx = 0
          data.features.forEach( (feature) => {
                  ++idx
                  const geojson = feature.geometry
                  const overlay_name = feature.properties.headsign + " - " + feature.properties.route_name
                  const route_name = feature.properties.route_name
                  let myStyle  = LineStyle(route_name)       
                  
                  itemList.push(
                    <>
                      <LayersControl.Overlay checked name={overlay_name}>
                        <FeatureGroup>
                          <GeoJSON 
                            key={overlay_name + '.' + idx} 
                            data={geojson}
                            style={myStyle} 
                          />  
                          <Tooltip sticky={true}>
                            {route_name}
                          </Tooltip> 
                      </FeatureGroup>
                    </LayersControl.Overlay>
                    
                    </>
                    )
          })
          
          return (
            <>
              {itemList}
            </>
          )
        })}
      </LayersControl>
    </>
  )
}

export default Layers


