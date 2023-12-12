import React, { useState } from 'react'
import { Popup } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import { 
  useMapEvents, 
  TileLayer, 
  LayersControl,
  LayerGroup,
  GeoJSON, 
  Marker
} from 'react-leaflet'
import L from 'leaflet'
import { Typography, Divider } from '@material-ui/core'
import STM from '../data/STMLines.json'
//import MT from '../data/Montana.json'
//import ND from '../data/NorthDakota.json'
//import SD from '../data/SouthDakota.json'

const Layers = () => {
  const [borderData, setBorderData] = useState([STM])
  const [popupContent, setPopupContent] = useState('')
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [popupOpen, setPopupOpen] = useState(false)

  const map = useMapEvents({
    zoomend: () => {
      console.log(map.getZoom())
    },
    moveend: () => {
      console.log(map.getBounds())
    }
  })



  const onMouseEvent = (event, arg) => {
    switch (args.type) {
      case 'over':
        event.target.setStyle({ fillOpacity: 0.5 })
        setPopupContent(args.routeName)
  
        // Set the position of the popup to the cursor
        setPosition({ x: event.clientX, y: event.clientY })
    
        // Open the popup
        setPopupOpen(true)
        break
      case 'out':
        event.target.setStyle({ fillOpacity: 0.0 })
        setPopupOpen(false)
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

          let itemList=[]
          data.features.forEach( (feature) => {
                  const geojson = feature.geometry
                  const overlay_name = feature.properties.headsign + " - " + feature.properties.route_name
                  const route_name = feature.properties.route_name
                  const color = (route_name) => { 
                    switch (true)
                    {
                       case /blue/i.test(feature.properties.route_name): return 'blue'
                       case /blue/i.test(feature.properties.route_name): return 'orange'
                       case /blue/i.test(feature.properties.route_name): return 'yellow'
                       case /blue/i.test(feature.properties.route_name): return 'green'
                       default:
                        return '#6699CC' // blue-gray
                    }
                  }
                  
                  itemList.push(
                    <Popup
                    content={popupContent}
                    position="top center"
                    open={popupOpen}
                    style={{ position: 'absolute', top: position.y, left: position.x }}
                    >
             
                      <LayersControl.Overlay checked name={overlay_name}>
                        <LayerGroup>
                          <GeoJSON 
                            key={overlay_name} 
                            data={geojson} 
                            pathOptions={{ color: {color} }}
                            eventHandlers={{
                              mouseover: (event, type, route_name) => onMouseEvent(event, 'over', route_name),
                              mouseout: (event, type, route_name) => onMouseEvent(event, 'out', route_name),
                            }}
                          >
                          </GeoJSON>
                      </LayerGroup>
                    </LayersControl.Overlay>
                    </Popup>
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


