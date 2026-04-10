import { useState, useEffect } from "react";
import getClientMapboxAccessToken from "@/lib/config/client";

/**
 * Mapbox Directions API を使用して、道路に沿ったルートのジオメトリを取得するカスタムフック
 * @param route ルートオブジェクト
 * @param profile Mapbox のルートプロファイル (driving, walking, cycling, etc.)
 * @returns GeoJSON のジオメトリオブジェクト、または null
 */
export function useRouteGeometry(route: any, profile: string = 'driving') {
  const [routeGeometry, setRouteGeometry] = useState<any>(null);
  const mapboxAccessToken = getClientMapboxAccessToken();

  useEffect(() => {
    if (!route || !route.routeNodes || route.routeNodes.length < 2 || !mapboxAccessToken) {
      setRouteGeometry(null);
      return;
    }

    const validNodes = route.routeNodes.filter(
      (node: any) => node.spot && node.spot.longitude !== null && node.spot.latitude !== null
    );

    if (validNodes.length < 2) {
      setRouteGeometry(null);
      return;
    }

    // Mapbox Directions API の制限（標準25地点）
    if (validNodes.length > 25) {
      console.warn("Too many waypoints for Mapbox Directions API (limit: 25). Falling back to straight lines.");
      setRouteGeometry(null);
      return;
    }

    const coords = validNodes
      .map((node: any) => `${node.spot.longitude},${node.spot.latitude}`)
      .join(";");

    const fetchRoute = async () => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coords}?access_token=${mapboxAccessToken}&geometries=geojson&overview=full`
        );
        if (!response.ok) throw new Error("Failed to fetch directions");
        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
          setRouteGeometry(data.routes[0].geometry);
        }
      } catch (error) {
        console.error("Mapbox Directions API error:", error);
        setRouteGeometry(null);
      }
    };

    fetchRoute();
  }, [route?.id, route?.routeNodes, mapboxAccessToken, profile]);

  return routeGeometry;
}
