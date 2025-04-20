import fetch from 'node-fetch';

const geoCache = new Map<string, string | null>();

export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  const key = `${lat},${lng}`;
  if (geoCache.has(key)) return geoCache.get(key) ?? null;
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'video-matchmaking-app/1.0' } });
    if (!res.ok) return null;
    const json = await res.json();
    const address = json.display_name || null;
    geoCache.set(key, address);
    return address;
  } catch (e) {
    geoCache.set(key, null);
    return null;
  }
}
