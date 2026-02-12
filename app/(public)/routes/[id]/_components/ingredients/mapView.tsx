"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Map, Marker, Source, Layer, MapRef } from "react-map-gl/mapbox-legacy";
import { Route } from "@/lib/client/types";
import getClientMapboxAccessToken from "@/lib/config/client";
import { MapPin } from "lucide-react";

type Props = {
  route: Route;
  focusIndex: number;
  items: any[]; // Flattened items from RouteViewer
};

export default function MapView({ route, focusIndex, items }: Props) {
  const mapRef = useRef<MapRef>(null);
  const mapboxAccessToken = getClientMapboxAccessToken();
  const hasFitOnceRef = useRef(false);

  // 現在フォーカスされているアイテムがノード（経由地）かどうかを確認
  const focusedNode = useMemo(() => {
    const item = items[focusIndex];
    return item?.type === "node" ? item.data : null;
  }, [focusIndex, items]);

  // 全ての経由地の座標を取得
  const allCoords = useMemo(() => {
    return route.routeNodes
      .filter((node) => node.spot)
      .map((node) => ({
        id: node.id,
        lng: node.spot.longitude,
        lat: node.spot.latitude,
        name: node.spot.name,
      }));
  }, [route]);

  // ラインデータ（経由地を結ぶ線）
  const lineData = useMemo(() => {
    if (allCoords.length < 2) return null;
    return {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: allCoords.map((c) => [c.lng, c.lat]),
      },
    };
  }, [allCoords]);

  // 初回はルート全体が収まるようにズーム・位置を調整。その後はフォーカス移動時に中心のみ移動。
  useEffect(() => {
    if (!mapRef.current || allCoords.length === 0) return;

    const lats = allCoords.map((c) => c.lat);
    const lngs = allCoords.map((c) => c.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    if (!hasFitOnceRef.current) {
      // 初回は必ず全体が入るようにフィット
      mapRef.current.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        { padding: 100, duration: 800 }
      );
      hasFitOnceRef.current = true;
      return; // 初回はフォーカス移動はしない
    }

    if (focusedNode && focusedNode.spot) {
      // 現在のズームを維持したまま、中心のみ移動（親への過度なズームを避ける）
      const currentZoom = typeof mapRef.current.getZoom === 'function' ? mapRef.current.getZoom() : 12;
      mapRef.current.flyTo({
        center: [focusedNode.spot.longitude, focusedNode.spot.latitude],
        zoom: currentZoom,
        duration: 600,
      });
    } else {
      // 交通手段などノード以外にフォーカスした場合は、再度全体が見えるようにフィット
      mapRef.current.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        { padding: 100, duration: 800 }
      );
    }
  }, [focusedNode, allCoords]);

  if (!mapboxAccessToken) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background-1">
        <p className="text-foreground-1">Mapbox access token is missing.</p>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full relative"
      onWheel={(e) => e.stopPropagation()}
      onScroll={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <Map
        ref={mapRef}
        initialViewState={{
          latitude: allCoords[0]?.lat ?? 35.6804,
          longitude: allCoords[0]?.lng ?? 139.769,
          zoom: 12,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={mapboxAccessToken}
        style={{ width: "100%", height: "100%" }}
      >
        {allCoords.map((coord, idx) => {
          const isFocused = focusedNode?.id === coord.id;
          return (
            <Marker
              key={coord.id}
              longitude={coord.lng}
              latitude={coord.lat}
              anchor="bottom"
            >
              <div className="flex flex-col items-center group cursor-pointer">
                {/* ツールチップ風の名称表示（フォーカス時のみ） */}
                {isFocused && (
                  <div className="mb-2 px-3 py-1 bg-background-1 border border-accent-0 rounded-lg shadow-xl text-[10px] font-bold text-accent-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {coord.name}
                  </div>
                )}
                
                <div className="relative flex items-center justify-center">
                  <MapPin
                    size={isFocused ? 48 : 32}
                    className={`transition-all duration-300 ${
                      isFocused
                        ? "text-accent-0 fill-accent-0/20 stroke-[2.5px] drop-shadow-xl scale-110"
                        : "text-accent-0/60 fill-accent-0/5 stroke-[2px] hover:text-accent-0 hover:scale-110"
                    }`}
                  />
                  {/* 中央のドット */}
                  <div className={`absolute rounded-full bg-white transition-all duration-300 ${
                    isFocused ? "w-2 h-2 translate-y-[-6px]" : "w-1.5 h-1.5 translate-y-[-4px]"
                  }`} />
                </div>
                
              </div>
            </Marker>
          );
        })}

        {lineData && (
          <Source type="geojson" data={lineData as any}>
            <Layer
              id="route-line"
              type="line"
              layout={{
                "line-join": "round",
                "line-cap": "round",
              }}
              paint={{
                "line-color": "#2D1FF6",
                "line-width": 4,
                "line-opacity": 0.4,
              }}
            />
          </Source>
        )}
      </Map>
    </div>
  );
}
