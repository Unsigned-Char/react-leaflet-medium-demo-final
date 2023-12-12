import React from 'react'
import { MapContainer, ZoomControl } from 'react-leaflet'
import Layers from './Layers'

const Map = () => {

  return (
    <>
      <MapContainer 
        center={[45.508888, -73.561668]} 
        zoom={11} 
        zoomControl={false} 
        style={{ height: '100vh', width: '100%' }}
      >
        <Layers />
        <ZoomControl position='topright'/>
      </MapContainer>
    </>
  )
}

export default Map
