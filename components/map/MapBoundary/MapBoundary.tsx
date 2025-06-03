import type { NextPage } from "next";
import type { GeoLayerCoordinates } from "../../../store/listingMap/listingMapTypes";
import { useState, useEffect } from "react";
import { useGoogleMaps } from "../../../providers/GoogleMapsProvider";

export interface MapBoundaryProps {
  coordinates: GeoLayerCoordinates;
  visible: boolean;
  options: google.maps.PolygonOptions;
}

const MapBoundary: NextPage<MapBoundaryProps> = ({
  coordinates = [],
  visible = true,
  options = {}
}) => {
  const { googleLoaded, googleMap } = useGoogleMaps();
  const [polygon, setPolygon] = useState<google.maps.Polygon>();

  useEffect(() => {
    if (!polygon && googleLoaded) {
      setPolygon(new google.maps.Polygon());
    }
    return () => polygon?.setMap(null);
  }, [polygon, googleLoaded]);

  useEffect(() => {
    if (polygon && googleMap) {
      polygon.setMap(googleMap);
    }
  }, [polygon, googleMap]);

  useEffect(() => {
    // if paths is empty then the polygon will not show on the map, so we can easily create it without showing it and
    // adds the paths later to make it visible
    polygon?.setPaths(coordinates);
  }, [polygon, coordinates]);

  useEffect(() => {
    polygon?.setOptions({ ...options, visible });
  }, [polygon, options, visible]);

  return null;
};

export default MapBoundary;
