import { useState, useEffect } from 'react';

interface GeoLocationData {
  country: string;
  countryCode: string;
  city: string;
  region: string;
  lat: number;
  lon: number;
  timezone: string;
  isLoading: boolean;
  error: string | null;
}

const defaultData: GeoLocationData = {
  country: '',
  countryCode: '',
  city: '',
  region: '',
  lat: 0,
  lon: 0,
  timezone: '',
  isLoading: true,
  error: null,
};

// Map country codes to languages
const countryToLanguage: Record<string, string> = {
  // Arabic-speaking countries
  SA: 'ar', AE: 'ar', EG: 'ar', MA: 'ar', DZ: 'ar', TN: 'ar', 
  LY: 'ar', SD: 'ar', IQ: 'ar', SY: 'ar', JO: 'ar', LB: 'ar',
  KW: 'ar', QA: 'ar', BH: 'ar', OM: 'ar', YE: 'ar', PS: 'ar',
  // Spanish-speaking countries
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', PE: 'es', VE: 'es',
  CL: 'es', EC: 'es', GT: 'es', CU: 'es', BO: 'es', DO: 'es',
  HN: 'es', PY: 'es', SV: 'es', NI: 'es', CR: 'es', PA: 'es',
  UY: 'es', PR: 'es', GQ: 'es',
  // French-speaking countries
  FR: 'fr', CA: 'fr', BE: 'fr', CH: 'fr', LU: 'fr', MC: 'fr',
  SN: 'fr', CI: 'fr', ML: 'fr', BF: 'fr', NE: 'fr', TG: 'fr',
  BJ: 'fr', GA: 'fr', CG: 'fr', CD: 'fr', CM: 'fr', MG: 'fr',
  HT: 'fr', RE: 'fr', MQ: 'fr', GP: 'fr', GF: 'fr',
  // German-speaking countries
  DE: 'de', AT: 'de', LI: 'de',
};

export function useGeoLocation() {
  const [geoData, setGeoData] = useState<GeoLocationData>(defaultData);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // Using ip-api.com which is free and doesn't require API key
        const response = await fetch('http://ip-api.com/json/?fields=status,country,countryCode,regionName,city,lat,lon,timezone');
        const data = await response.json();

        if (data.status === 'success') {
          setGeoData({
            country: data.country,
            countryCode: data.countryCode,
            city: data.city,
            region: data.regionName,
            lat: data.lat,
            lon: data.lon,
            timezone: data.timezone,
            isLoading: false,
            error: null,
          });
        } else {
          throw new Error('Failed to get location');
        }
      } catch (error) {
        // Fallback to ipapi.co if ip-api.com fails (HTTPS support)
        try {
          const response = await fetch('https://ipapi.co/json/');
          const data = await response.json();
          
          setGeoData({
            country: data.country_name,
            countryCode: data.country_code,
            city: data.city,
            region: data.region,
            lat: data.latitude,
            lon: data.longitude,
            timezone: data.timezone,
            isLoading: false,
            error: null,
          });
        } catch (fallbackError) {
          setGeoData(prev => ({
            ...prev,
            isLoading: false,
            error: 'Could not detect location',
          }));
        }
      }
    };

    fetchLocation();
  }, []);

  const getRecommendedLanguage = (): string | null => {
    if (geoData.countryCode && countryToLanguage[geoData.countryCode]) {
      return countryToLanguage[geoData.countryCode];
    }
    return null;
  };

  return { ...geoData, getRecommendedLanguage };
}
