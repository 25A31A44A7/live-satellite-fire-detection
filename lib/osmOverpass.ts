// OpenStreetMap (OSM) Overpass API Spatial Query & Industrial Infrastructure Engine

export interface IndustrialFacility {
  name: string;
  type: string;
  category: 'REFINERY' | 'STEEL_PLANT' | 'POWER_PLANT' | 'PETROCHEMICAL' | 'SMELTER' | 'GAS_FLARE' | 'CHEMICAL' | 'MANUFACTURING' | 'MINING';
  lat: number;
  lng: number;
  state?: string;
  country: string;
  source: 'OSM_OVERPASS' | 'SPATIAL_REGISTRY';
}

// Built-in high-precision industrial registry for immediate fallback & zero-latency spatial indexing
export const MAJOR_INDUSTRIAL_REGISTRY: IndustrialFacility[] = [
  { name: "Rashtriya Ispat Nigam Ltd (Vizag Steel Plant)", type: "Steel Plant", category: "STEEL_PLANT", lat: 17.6324, lng: 83.1782, state: "Andhra Pradesh", country: "India", source: "SPATIAL_REGISTRY" },
  { name: "HPCL Visakh Refinery", type: "Petroleum Refinery", category: "REFINERY", lat: 17.6985, lng: 83.2718, state: "Andhra Pradesh", country: "India", source: "SPATIAL_REGISTRY" },
  { name: "NTPC Simhadri Super Thermal Power", type: "Coal Power Plant", category: "POWER_PLANT", lat: 17.5996, lng: 83.0881, state: "Andhra Pradesh", country: "India", source: "SPATIAL_REGISTRY" },
  { name: "Reliance Industries Jamnagar Refinery Complex", type: "Petrochemical Complex", category: "PETROCHEMICAL", lat: 22.3595, lng: 69.8647, state: "Gujarat", country: "India", source: "SPATIAL_REGISTRY" },
  { name: "Nayara Energy Refinery Vadinar", type: "Petroleum Refinery", category: "REFINERY", lat: 22.4184, lng: 69.6912, state: "Gujarat", country: "India", source: "SPATIAL_REGISTRY" },
  { name: "ONGC Hazira Gas Processing Plant", type: "Gas Processing Facility", category: "GAS_FLARE", lat: 21.1278, lng: 72.6582, state: "Gujarat", country: "India", source: "SPATIAL_REGISTRY" },
  { name: "Essar Steel / AMNS Hazira Complex", type: "Steel Complex", category: "STEEL_PLANT", lat: 21.1398, lng: 72.6734, state: "Gujarat", country: "India", source: "SPATIAL_REGISTRY" },
  { name: "Tata Steel Kalinganagar Complex", type: "Steel Plant", category: "STEEL_PLANT", lat: 20.9634, lng: 86.0352, state: "Odisha", country: "India", source: "SPATIAL_REGISTRY" },
  { name: "NALCO Smelter & Captive Power Plant Angul", type: "Aluminum Smelter", category: "SMELTER", lat: 20.8415, lng: 85.1472, state: "Odisha", country: "India", source: "SPATIAL_REGISTRY" },
  { name: "Jindal Steel & Power Angul Plant", type: "Integrated Steel Plant", category: "STEEL_PLANT", lat: 20.8921, lng: 85.0684, state: "Odisha", country: "India", source: "SPATIAL_REGISTRY" },
  { name: "NTPC Singrauli Super Thermal Power", type: "Thermal Power Station", category: "POWER_PLANT", lat: 24.1032, lng: 82.6781, state: "Uttar Pradesh", country: "India", source: "SPATIAL_REGISTRY" },
  { name: "NTPC Vindhyachal Super Thermal Station", type: "Thermal Power Station", category: "POWER_PLANT", lat: 24.0987, lng: 82.6689, state: "Madhya Pradesh", country: "India", source: "SPATIAL_REGISTRY" },
  { name: "Northern Coalfields Jayant Opencast Project", type: "Coal Mining & Thermal", category: "MINING", lat: 24.1487, lng: 82.6453, state: "Madhya Pradesh", country: "India", source: "SPATIAL_REGISTRY" },
  { name: "BPCL Mumbai Refinery Mahul", type: "Petroleum Refinery", category: "REFINERY", lat: 19.0125, lng: 72.8984, state: "Maharashtra", country: "India", source: "SPATIAL_REGISTRY" },
  { name: "HPCL Mumbai Refinery Chembur", type: "Petroleum Refinery", category: "REFINERY", lat: 19.0082, lng: 72.8941, state: "Maharashtra", country: "India", source: "SPATIAL_REGISTRY" },
  { name: "RCF Chembur Fertilizer Plant", type: "Chemical & Fertilizer", category: "CHEMICAL", lat: 19.0345, lng: 72.8872, state: "Maharashtra", country: "India", source: "SPATIAL_REGISTRY" },
  { name: "CPCL Manali Refinery", type: "Petroleum Refinery", category: "REFINERY", lat: 13.1672, lng: 80.2647, state: "Tamil Nadu", country: "India", source: "SPATIAL_REGISTRY" },
  { name: "Ennore Thermal Power Station", type: "Thermal Power Plant", category: "POWER_PLANT", lat: 13.2045, lng: 80.3211, state: "Tamil Nadu", country: "India", source: "SPATIAL_REGISTRY" },
  { name: "SAIL Bhilai Steel Plant", type: "Steel Plant", category: "STEEL_PLANT", lat: 21.1834, lng: 81.3856, state: "Chhattisgarh", country: "India", source: "SPATIAL_REGISTRY" },
  { name: "NTPC Korba Super Thermal Station", type: "Thermal Power Station", category: "POWER_PLANT", lat: 22.3812, lng: 82.6845, state: "Chhattisgarh", country: "India", source: "SPATIAL_REGISTRY" },
  { name: "SAIL Rourkela Steel Plant", type: "Steel Plant", category: "STEEL_PLANT", lat: 22.2214, lng: 84.8765, state: "Odisha", country: "India", source: "SPATIAL_REGISTRY" },
  { name: "Tata Steel Jamshedpur Works", type: "Integrated Steel Works", category: "STEEL_PLANT", lat: 22.7845, lng: 86.1956, state: "Jharkhand", country: "India", source: "SPATIAL_REGISTRY" },
  { name: "IOCL Paradip Refinery", type: "Petroleum Refinery", category: "REFINERY", lat: 20.2789, lng: 86.6341, state: "Odisha", country: "India", source: "SPATIAL_REGISTRY" },
  { name: "GAIL Rajahmundry Gas Processing Plant", type: "Gas Distribution & Processing", category: "GAS_FLARE", lat: 16.9891, lng: 81.7821, state: "Andhra Pradesh", country: "India", source: "SPATIAL_REGISTRY" },
  { name: "ONGC KG Basin Tatipaka Refinery / Mini-Refinery", type: "Oil & Gas Facility", category: "REFINERY", lat: 16.5241, lng: 81.8765, state: "Andhra Pradesh", country: "India", source: "SPATIAL_REGISTRY" },
  { name: "JSW Steel Vijayanagar Works Toranagallu", type: "Steel Plant", category: "STEEL_PLANT", lat: 15.1843, lng: 76.6578, state: "Karnataka", country: "India", source: "SPATIAL_REGISTRY" },
  { name: "IOCL Panipat Refinery & Petrochemical Complex", type: "Petrochemical Complex", category: "PETROCHEMICAL", lat: 29.4182, lng: 76.8924, state: "Haryana", country: "India", source: "SPATIAL_REGISTRY" },
  { name: "IOCL Koyali Refinery Vadodara", type: "Petroleum Refinery", category: "REFINERY", lat: 22.3612, lng: 73.1345, state: "Gujarat", country: "India", source: "SPATIAL_REGISTRY" },
  { name: "BHEL Haridwar Heavy Electricals", type: "Heavy Engineering", category: "MANUFACTURING", lat: 29.9324, lng: 78.1145, state: "Uttarakhand", country: "India", source: "SPATIAL_REGISTRY" },
  { name: "NTPC Ramagundam Super Thermal Power Station", type: "Thermal Power Plant", category: "POWER_PLANT", lat: 18.7562, lng: 79.4678, state: "Telangana", country: "India", source: "SPATIAL_REGISTRY" },
];

/**
 * Calculates distance between two coordinates in kilometers using the Haversine formula
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

export interface IndustrialMatchResult {
  isIndustrial: boolean;
  distanceKm: number;
  facility: IndustrialFacility | null;
  confidenceBonus: number;
}

/**
 * Checks proximity against registered spatial facilities and live Overpass OSM queries
 */
export async function matchIndustrialInfrastructure(
  lat: number,
  lng: number,
  thresholdKm: number = 8.0
): Promise<IndustrialMatchResult> {
  let closestFacility: IndustrialFacility | null = null;
  let minDistance = Infinity;

  // 1. Check our built-in high-precision registry
  for (const facility of MAJOR_INDUSTRIAL_REGISTRY) {
    const dist = calculateHaversineDistance(lat, lng, facility.lat, facility.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closestFacility = facility;
    }
  }

  // 2. If within threshold, return immediate match
  if (minDistance <= thresholdKm && closestFacility) {
    const confidenceBonus = Math.max(0, (thresholdKm - minDistance) / thresholdKm) * 25;
    return {
      isIndustrial: true,
      distanceKm: minDistance,
      facility: closestFacility,
      confidenceBonus: parseFloat(confidenceBonus.toFixed(1)),
    };
  }

  // 3. Fallback to Overpass API query for dynamic OSM nodes if distance is outside registry
  try {
    const overpassQuery = `
      [out:json][timeout:5];
      (
        node["landuse"="industrial"](around:5000, ${lat}, ${lng});
        way["landuse"="industrial"](around:5000, ${lat}, ${lng});
        node["man_made"="works"](around:5000, ${lat}, ${lng});
        node["power"="plant"](around:5000, ${lat}, ${lng});
        node["man_made"="refinery"](around:5000, ${lat}, ${lng});
      );
      out center 5;
    `;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: `data=${encodeURIComponent(overpassQuery)}`,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data.elements && data.elements.length > 0) {
        const el = data.elements[0];
        const elLat = el.lat || (el.center && el.center.lat) || lat;
        const elLon = el.lon || (el.center && el.center.lon) || lng;
        const osmDist = calculateHaversineDistance(lat, lng, elLat, elLon);
        const name = el.tags?.name || el.tags?.operator || "Industrial Facility (OSM)";
        const type = el.tags?.industrial || el.tags?.man_made || el.tags?.power || "Industrial Area";

        if (osmDist <= thresholdKm) {
          const dynamicFacility: IndustrialFacility = {
            name,
            type,
            category: "MANUFACTURING",
            lat: elLat,
            lng: elLon,
            country: "India",
            source: "OSM_OVERPASS",
          };
          return {
            isIndustrial: true,
            distanceKm: osmDist,
            facility: dynamicFacility,
            confidenceBonus: 15,
          };
        }
      }
    }
  } catch (e) {
    // Graceful fallback to registry distance
  }

  return {
    isIndustrial: minDistance <= thresholdKm,
    distanceKm: minDistance === Infinity ? 999 : minDistance,
    facility: minDistance <= thresholdKm ? closestFacility : null,
    confidenceBonus: 0,
  };
}
