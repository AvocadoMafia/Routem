import {Map} from "react-map-gl/mapbox-legacy";

export default function MapViewer() {
    return (
        <div className={'w-full max-w-[1200px] h-[800px]'}>
            <Map
                initialViewState={{
                    latitude: 35.6804,
                    longitude: 139.7690,
                    zoom: 12,
                }}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                style={{ width: "100%", height: "100%" }}
            />
        </div>
    )
}
