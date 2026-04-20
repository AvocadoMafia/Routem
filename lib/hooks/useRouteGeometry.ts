import { useState, useEffect } from "react";
import getClientMapboxAccessToken from "@/lib/env/client";

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
    const allNodes = route?.routeDates?.flatMap((rd: any) => rd.routeNodes) || route?.routeNodes || [];
    const validNodes = allNodes.filter(
      (node: any) => node.spot && node.spot.longitude !== null && node.spot.latitude !== null
    );

    if (validNodes.length < 2 || !mapboxAccessToken) {
      setRouteGeometry(null);
      return;
    }

    const fetchRoute = async () => {
      // Mapbox Directions API の制限（標準25地点）
      // 25地点を超える場合は、先頭と末尾を含む25地点をサンプリングするか、エラーとする
      // ここでは簡易的に最初の25地点のみを使用する（本来はチャンク分けして結合するのが望ましい）
      const nodesToUse = validNodes.length > 25 ? validNodes.slice(0, 25) : validNodes;
      
      if (validNodes.length > 25) {
        console.warn(`Too many waypoints (${validNodes.length}). Only the first 25 are used for geometry.`);
      }

      const coords = nodesToUse
        .map((node: any) => `${node.spot.longitude},${node.spot.latitude}`)
        .join(";");

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
  }, [route?.id, route?.routeDates, route?.routeNodes, mapboxAccessToken, profile]);

  return routeGeometry;
}
