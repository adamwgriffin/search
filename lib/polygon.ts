import type {
  GeoLayerCoordinates,
  GeoJSONCoordinates
} from '../store/listingMap/listingMapTypes'

/*
we need to transform the geojson we get from the service into a shape that works for the Polygon class we need to use
it for. we get the data as:
[
  [
    [
      [
        -122.510645,
        47.228309
      ],
      [
        -122.506443,
        47.226519
      ]
    ]
  ]
]
but instead we need:
[
  [
    {
      lat: 47.228309,
      lng: -122.510645
    },
    {
      lat: 47.226519,
      lng: -122.506443
    },
  ]
]
*/
export const convertGeojsonCoordinatesToPolygonPaths = (
  geoJsonCoordinates: GeoJSONCoordinates
): GeoLayerCoordinates => {
  return geoJsonCoordinates.map((arr) => {
    return arr[0].map((arr) => {
      return { lat: arr[1], lng: arr[0] }
    })
  })
}

// most examples use polygon.getPaths() to extend the bounds, but that data is the same as the geojson coordinates we
// used to create the polygon paths, so we might as well just use that data since we already have it
export const getGeoLayerBounds = (geoLayerCoordinates: GeoLayerCoordinates) => {
  const bounds = new google.maps.LatLngBounds()
  geoLayerCoordinates.forEach((latLngArr) =>
    latLngArr.forEach((latLng) => bounds.extend(latLng))
  )
  return bounds.toJSON()
}
