'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import api from '../lib/api';

const AirDataContext = createContext();

export function AirDataProvider({ children }) {
  const [selectedCity, setSelectedCity] = useState('Delhi');
  const [coordinates, setCoordinates] = useState({ lat: 28.6139, lon: 77.209 });
  const [airData, setAirData] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Active AQI calculation standard: 'IN_CPCB' (Indian National AQI) or 'US_EPA' (US EPA AQI)
  const [activeStandard, setActiveStandard] = useState('auto'); // 'auto' | 'cpcb' | 'epa'

  // Real-time tracking & polling states
  const [isRealTimeGps, setIsRealTimeGps] = useState(false);
  const [isLivePolling, setIsLivePolling] = useState(true); // Default to live auto-updating!
  const [pollingSecondsLeft, setPollingSecondsLeft] = useState(30);
  const [lastRefreshedAt, setLastRefreshedAt] = useState(null);

  const pollingTimerRef = useRef(null);

  const fetchAirQuality = useCallback(
    async (city = selectedCity, coords = coordinates, isGps = isRealTimeGps, standardChoice = activeStandard) => {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (isGps && coords?.lat && coords?.lon) {
          params.lat = coords.lat;
          params.lon = coords.lon;
        } else if (city) {
          params.city = city;
        } else if (coords?.lat && coords?.lon) {
          params.lat = coords.lat;
          params.lon = coords.lon;
        } else {
          params.city = 'Delhi';
        }

        if (standardChoice && standardChoice !== 'auto') {
          params.standard = standardChoice;
        }

        const [currentRes, forecastRes] = await Promise.all([
          api.get('/air-quality/current', { params }),
          api.get('/air-quality/forecast', { params }),
        ]);

        if (currentRes.data.success) {
          const fetched = currentRes.data.data;
          setAirData(fetched);
          if (fetched.coordinates) {
            setCoordinates(fetched.coordinates);
          }
          if (fetched.city && !isGps) {
            setSelectedCity(fetched.city);
          } else if (fetched.city && isGps) {
            setSelectedCity(fetched.city);
          }
          setLastRefreshedAt(new Date());
          setPollingSecondsLeft(30);
        }

        if (forecastRes.data.success) {
          setForecast(forecastRes.data.data);
        }
      } catch (err) {
        console.warn('Error fetching air quality data:', err.message);
        setError('Unable to fetch live air data. Calibrated regional model active.');
      } finally {
        setLoading(false);
      }
    },
    [selectedCity, coordinates, isRealTimeGps, activeStandard]
  );

  // Initial load
  useEffect(() => {
    fetchAirQuality();
  }, [fetchAirQuality]);

  // Real-time auto-polling timer (every 30 seconds)
  useEffect(() => {
    if (!isLivePolling) {
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
      return;
    }

    pollingTimerRef.current = setInterval(() => {
      setPollingSecondsLeft((prev) => {
        if (prev <= 1) {
          fetchAirQuality(selectedCity, coordinates, isRealTimeGps, activeStandard);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
    };
  }, [isLivePolling, selectedCity, coordinates, isRealTimeGps, activeStandard, fetchAirQuality]);

  const changeStandard = (std) => {
    setActiveStandard(std);
    fetchAirQuality(selectedCity, coordinates, isRealTimeGps, std);
  };

  // Switch to any city worldwide
  const changeCity = (cityName, customCoords = null) => {
    setIsRealTimeGps(false);
    setSelectedCity(cityName);
    if (customCoords) {
      setCoordinates(customCoords);
      fetchAirQuality(cityName, customCoords, false);
    } else {
      fetchAirQuality(cityName, null, false);
    }
  };

  // Real-time GPS location detection
  const enableRealTimeGps = () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      setLoading(true);
      setError(null);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          setIsRealTimeGps(true);
          setCoordinates(coords);
          setSelectedCity('Detecting Live Location...');
          await fetchAirQuality(null, coords, true);
        },
        (err) => {
          console.warn('Geolocation error:', err.message);
          setIsRealTimeGps(false);
          setError('Location permission denied or unavailable. You can search any city manually below.');
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } else {
      setError('Geolocation not supported in this browser.');
    }
  };

  const toggleLivePolling = () => {
    setIsLivePolling((prev) => !prev);
    setPollingSecondsLeft(30);
  };

  const searchCities = async (query) => {
    try {
      const res = await api.get('/air-quality/search', { params: { q: query } });
      if (res.data.success) {
        return res.data.results;
      }
    } catch (err) {
      return [];
    }
    return [];
  };

  return (
    <AirDataContext.Provider
      value={{
        selectedCity,
        coordinates,
        airData,
        forecast,
        loading,
        error,
        isRealTimeGps,
        isLivePolling,
        pollingSecondsLeft,
        lastRefreshedAt,
        activeStandard,
        changeStandard,
        changeCity,
        enableRealTimeGps,
        toggleLivePolling,
        searchCities,
        refreshAirQuality: () => fetchAirQuality(selectedCity, coordinates, isRealTimeGps, activeStandard),
      }}
    >
      {children}
    </AirDataContext.Provider>
  );
}

export function useAirData() {
  const context = useContext(AirDataContext);
  if (!context) {
    throw new Error('useAirData must be used within an AirDataProvider');
  }
  return context;
}
