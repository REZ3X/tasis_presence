/**
 * Geofence configuration and utilities.
 *
 * SCHOOL_AREA defines the allowed presence zone:
 *   - latitude / longitude: center of the school area
 *   - radiusMeters: maximum allowed distance from center
 *   - name: human-readable label
 *
 * To change the allowed area, update the coordinates and radius below.
 * You can find coordinates via Google Maps (right-click → "What's here?").
 */

export const SCHOOL_AREA = {
    name: 'SMK Negeri 2 Depok Sleman',
    latitude: -7.7718000,
    longitude: 110.3927567,
    radiusMeters: 170,
};

/**
 * Calculate distance between two GPS coordinates using the Haversine formula.
 * @returns distance in meters
 */
export function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth radius in meters
    const toRad = (deg) => (deg * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

/**
 * Check if a coordinate is within the allowed school area.
 * @returns {{ allowed: boolean, distance: number, maxDistance: number }}
 */
export function isWithinSchoolArea(latitude, longitude) {
    const distance = haversineDistance(
        latitude,
        longitude,
        SCHOOL_AREA.latitude,
        SCHOOL_AREA.longitude,
    );

    return {
        allowed: distance <= SCHOOL_AREA.radiusMeters,
        distance: Math.round(distance),
        maxDistance: SCHOOL_AREA.radiusMeters,
    };
}
