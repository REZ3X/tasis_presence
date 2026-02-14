'use client';

import { useEffect, useRef } from 'react';

/**
 * Lightweight Leaflet map component.
 * Renders a marker at the given position and optionally a geofence circle.
 *
 * Props:
 *   - latitude, longitude: marker position
 *   - geofence: { latitude, longitude, radiusMeters, name } (optional)
 *   - height: CSS height string (default '300px')
 *   - className: extra CSS classes
 */
export default function LocationMap({
    latitude,
    longitude,
    geofence,
    height = '300px',
    className = '',
}) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        let cancelled = false;

        (async () => {
            const L = (await import('leaflet')).default;
            await import('leaflet/dist/leaflet.css');

            if (cancelled || !mapRef.current) return;

            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });

            const map = L.map(mapRef.current, {
                center: [latitude, longitude],
                zoom: 17,
                attributionControl: true,
                zoomControl: true,
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                maxZoom: 19,
            }).addTo(map);

            const userIcon = L.divIcon({
                html: `<div style="position:relative;width:28px;height:28px;">
                    <div style="
                        position:absolute;inset:0;
                        background:rgba(235,174,59,0.25);
                        border-radius:50%;
                        animation:pulse-ring 1.8s ease-out infinite;
                    "></div>
                    <div style="
                        position:absolute;
                        top:4px;left:4px;
                        width:20px;height:20px;
                        background:#ebae3b;
                        border:3px solid #0d1216;
                        border-radius:50%;
                        box-shadow:0 0 12px rgba(235,174,59,0.7),0 0 4px rgba(235,174,59,0.4);
                    "></div>
                </div>
                <style>
                    @keyframes pulse-ring {
                        0% { transform:scale(1); opacity:1; }
                        100% { transform:scale(2.2); opacity:0; }
                    }
                </style>`,
                iconSize: [28, 28],
                iconAnchor: [14, 14],
                className: '',
            });

            L.marker([latitude, longitude], { icon: userIcon })
                .addTo(map)
                .bindPopup(
                    `<div style="font-size:12px;"><strong>Lokasi Presensi</strong><br/>${latitude.toFixed(6)}, ${longitude.toFixed(6)}</div>`,
                );

            if (geofence) {
                L.circle([geofence.latitude, geofence.longitude], {
                    radius: geofence.radiusMeters,
                    color: '#ebae3b',
                    fillColor: '#ebae3b',
                    fillOpacity: 0.1,
                    weight: 3,
                    dashArray: '8 5',
                }).addTo(map).bindPopup(
                    `<div style="font-size:12px;"><strong>${geofence.name}</strong><br/>Radius: ${geofence.radiusMeters}m</div>`,
                );

                const schoolIcon = L.divIcon({
                    html: `<div style="
                        width: 18px; height: 18px;
                        background: #22c55e;
                        border: 3px solid #0d1216;
                        border-radius: 50%;
                        box-shadow: 0 0 8px rgba(34,197,94,0.5);
                    "></div>`,
                    iconSize: [18, 18],
                    iconAnchor: [9, 9],
                    className: '',
                });

                L.marker([geofence.latitude, geofence.longitude], { icon: schoolIcon })
                    .addTo(map)
                    .bindPopup(
                        `<div style="font-size:12px;"><strong>${geofence.name}</strong><br/>Pusat Area</div>`,
                    );

                const bounds = L.latLngBounds([
                    [latitude, longitude],
                    [geofence.latitude, geofence.longitude],
                ]).pad(0.3);
                map.fitBounds(bounds, { maxZoom: 17 });
            }

            mapInstanceRef.current = map;
        })();

        return () => {
            cancelled = true;
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [latitude, longitude, geofence]);

    return (
        <div
            ref={mapRef}
            className={`rounded-xl overflow-hidden ${className}`}
            style={{
                height,
                width: '100%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(235,174,59,0.2)',
            }}
        />
    );
}
