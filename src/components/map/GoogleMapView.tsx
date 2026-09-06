import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import { LocationData, MarketItem } from '../../types/krishi';
import { MapPin, Navigation, Compass, ExternalLink, ShieldCheck, Star } from 'lucide-react';

interface GoogleMapViewProps {
  farmerLocation: LocationData;
  markets: MarketItem[];
  selectedMarket: MarketItem | null;
  onSelectMarket: (market: MarketItem) => void;
}

export const GoogleMapView: React.FC<GoogleMapViewProps> = ({
  farmerLocation,
  markets,
  selectedMarket,
  onSelectMarket,
}) => {
  const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';
  const [activeMarket, setActiveMarket] = useState<MarketItem | null>(selectedMarket || markets[0] || null);

  const center = {
    lat: farmerLocation.latitude,
    lng: farmerLocation.longitude,
  };

  // If no Google Maps API key is configured, show a visual interactive map simulator with real coordinates & distances
  if (!apiKey) {
    return (
      <div className="w-full h-full min-h-[420px] bg-stone-100 rounded-2xl border border-stone-300 relative overflow-hidden flex flex-col">
        {/* Fallback Header Notice */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-amber-700" />
            <span className="font-semibold">Interactive Mandi Distance Visualizer</span>
            <span className="text-amber-700 hidden sm:inline">• India-Wide Coordinate System</span>
          </div>
          <span className="bg-amber-200/80 px-2 py-0.5 rounded text-[11px] font-bold">
            Demo Map View
          </span>
        </div>

        {/* Map Canvas Visualizer */}
        <div className="relative flex-1 bg-gradient-to-br from-stone-50 via-emerald-50/20 to-amber-50/30 p-6 flex flex-col justify-between overflow-hidden">
          {/* Subtle Grid overlay */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#065f46 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Farmer Farm Node */}
          <div className="z-10 bg-white/95 backdrop-blur shadow-md border-2 border-emerald-600 rounded-xl p-3.5 max-w-sm">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-1">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping inline-block" />
              <span>🌾 Your Farm / Location</span>
            </div>
            <p className="text-xs font-semibold text-stone-900">
              {farmerLocation.formattedAddress}
            </p>
            <p className="text-[11px] text-stone-500 mt-0.5 font-mono">
              GPS: {farmerLocation.latitude.toFixed(4)}° N, {farmerLocation.longitude.toFixed(4)}° E
            </p>
          </div>

          {/* Connected Mandis Grid */}
          <div className="z-10 mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {markets.map((market, idx) => {
              const isSelected = activeMarket?.id === market.id;
              const isBest = idx === 0;

              return (
                <div
                  key={market.id}
                  onClick={() => {
                    setActiveMarket(market);
                    onSelectMarket(market);
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50 border-amber-500 shadow-md ring-2 ring-amber-400/40'
                      : 'bg-white border-stone-200 hover:border-emerald-400 hover:bg-emerald-50/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-xs font-bold text-stone-900 line-clamp-1">
                      {market.name}
                    </span>
                    {isBest && (
                      <span className="shrink-0 bg-amber-500 text-stone-950 font-extrabold text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-stone-950" /> BEST
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 flex items-baseline justify-between text-xs">
                    <span className="font-extrabold text-emerald-700 text-sm">
                      ₹{market.pricePerQuintal}
                      <span className="text-[11px] font-normal text-stone-500"> / qtl</span>
                    </span>
                    <span className="text-[11px] font-bold text-stone-600 flex items-center gap-1">
                      <Navigation className="w-3 h-3 text-emerald-600" />
                      {market.roadDistanceKm || Math.round(market.distanceKm * 1.2)} km
                    </span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                    <span className="truncate">{market.district}, {market.state}</span>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&origin=${farmerLocation.latitude},${farmerLocation.longitude}&destination=${market.latitude},${market.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-emerald-700 font-bold hover:underline inline-flex items-center gap-0.5"
                    >
                      Directions <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 text-center text-[11px] text-stone-500">
            Coordinates and highway distances calculated from your farm in {farmerLocation.state}, India.
          </div>
        </div>
      </div>
    );
  }

  // Google Maps Platform Active Render
  return (
    <div className="w-full h-full min-h-[420px] rounded-2xl overflow-hidden border border-stone-300 relative shadow-inner">
      <APIProvider apiKey={apiKey} region="in" language="en">
        <Map
          style={{ width: '100%', height: '100%', minHeight: '420px' }}
          defaultCenter={center}
          defaultZoom={9}
          mapId="DEMO_MAP_ID"
          gestureHandling="greedy"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        >
          {/* Farmer Farm Marker */}
          <AdvancedMarker position={center} title="Your Farm">
            <div className="bg-emerald-600 text-white p-2 rounded-full shadow-lg border-2 border-white animate-bounce">
              <MapPin className="w-5 h-5" />
            </div>
          </AdvancedMarker>

          {/* Market Markers */}
          {markets.map((market, idx) => {
            const isSelected = activeMarket?.id === market.id;
            const isBest = idx === 0;

            return (
              <AdvancedMarker
                key={market.id}
                position={{ lat: market.latitude, lng: market.longitude }}
                onClick={() => {
                  setActiveMarket(market);
                  onSelectMarket(market);
                }}
                title={market.name}
              >
                <div
                  className={`px-2 py-1 rounded-lg shadow-md border text-xs font-bold transition-transform cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-amber-500 text-stone-950 border-amber-600 scale-110'
                      : isBest
                      ? 'bg-emerald-700 text-white border-emerald-800'
                      : 'bg-white text-stone-800 border-stone-300'
                  }`}
                >
                  {isBest && <Star className="w-3 h-3 fill-amber-300 text-amber-300" />}
                  <span>₹{market.pricePerQuintal}</span>
                </div>
              </AdvancedMarker>
            );
          })}

          {/* Info Window for Selected Market */}
          {activeMarket && (
            <InfoWindow
              position={{ lat: activeMarket.latitude, lng: activeMarket.longitude }}
              onCloseClick={() => setActiveMarket(null)}
            >
              <div className="p-2 max-w-xs text-stone-900">
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-800">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  {activeMarket.verificationStatus}
                </div>
                <h4 className="font-bold text-xs mt-0.5">{activeMarket.name}</h4>
                <p className="text-[11px] text-stone-600">{activeMarket.city}, {activeMarket.state}</p>
                <div className="mt-2 bg-stone-50 p-1.5 rounded border border-stone-200 text-xs flex justify-between items-center">
                  <span className="font-extrabold text-emerald-700">₹{activeMarket.pricePerQuintal} / qtl</span>
                  <span className="text-[11px] text-stone-500">
                    ~{activeMarket.roadDistanceKm || Math.round(activeMarket.distanceKm * 1.2)} km
                  </span>
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=${farmerLocation.latitude},${farmerLocation.longitude}&destination=${activeMarket.latitude},${activeMarket.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block w-full text-center bg-emerald-800 text-white text-xs font-semibold py-1 rounded hover:bg-emerald-700"
                >
                  Get Route Directions 🗺️
                </a>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
};
