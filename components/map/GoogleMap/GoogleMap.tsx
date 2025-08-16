import { type ReactNode, useRef, useEffect, useCallback } from "react";
import { useGoogleMaps } from "../../../providers/GoogleMapsProvider";
import styles from "./GoogleMap.module.css";
import {
  useGoogleMapsEventListener,
  useDomEventListener
} from "../../../providers/GoogleMapsProvider";

export type GoogleMapState = {
  bounds: google.maps.LatLngBoundsLiteral | undefined;
  center: google.maps.LatLngLiteral | undefined;
  zoom: number | undefined;
};

export type GoogleMapProps = {
  options: google.maps.MapOptions;
  onDragEnd?: (currentMapState: GoogleMapState) => void;
  onWheel?: (currentMapState: GoogleMapState) => void;
  onIdle?: (currentMapState: GoogleMapState) => void;
  children: ReactNode;
};

const GoogleMap: React.FC<GoogleMapProps> = ({
  options,
  children,
  onDragEnd,
  onWheel,
  onIdle
}) => {
  const mapEl = useRef<HTMLDivElement>(null);
  const { googleMap, setGoogleMap } = useGoogleMaps();

  const getCurrentMapState = useCallback((): GoogleMapState => {
    return {
      bounds: googleMap?.getBounds()?.toJSON(),
      center: googleMap?.getCenter()?.toJSON(),
      zoom: googleMap?.getZoom()
    };
  }, [googleMap]);

  useEffect(() => {
    if (!mapEl.current) return;

    if (!googleMap) {
      setGoogleMap(new google.maps.Map(mapEl.current, options));
    } else {
      googleMap.setOptions(options);
    }
  }, [googleMap, options, setGoogleMap]);

  useGoogleMapsEventListener(googleMap, "dragend", () =>
    onDragEnd?.(getCurrentMapState())
  );
  useGoogleMapsEventListener(googleMap, "idle", () =>
    onIdle?.(getCurrentMapState())
  );
  useDomEventListener(googleMap?.getDiv(), "wheel", () =>
    onWheel?.(getCurrentMapState())
  );

  return (
    <div ref={mapEl} id={styles.googleMap}>
      {googleMap && children}
    </div>
  );
};

export default GoogleMap;
