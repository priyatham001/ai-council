import React, { useState } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Compass,
  Layers,
  Sparkles,
  ExternalLink,
  Info,
  Key,
  X,
} from 'lucide-react';

interface GoogleMapViewProps {
  onAskCouncilAboutLocation?: (prompt: string) => void;
  onClose?: () => void;
  isModal?: boolean;
}

interface LocationPreset {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  description: string;
  samplePrompt: string;
}

const PRESET_LOCATIONS: LocationPreset[] = [
  {
    id: 'bengaluru',
    name: 'Bengaluru Innovation Hub (Electronic City)',
    category: 'Tech & Research',
    lat: 12.8452,
    lng: 77.6602,
    description: 'Premier Indian semiconductor and software engineering corridor.',
    samplePrompt: 'Analyze the engineering ecosystem and infrastructure challenges of Electronic City, Bengaluru.',
  },
  {
    id: 'silicon_valley',
    name: 'Silicon Valley (Mountain View & Palo Alto)',
    category: 'AI & Venture',
    lat: 37.3861,
    lng: -122.0839,
    description: 'Global epicenter of frontier AI development and venture capital.',
    samplePrompt: 'What are the top advantages and current challenges of scaling frontier AI labs in Silicon Valley?',
  },
  {
    id: 'hyderabad',
    name: 'HITEC City (Cyberabad)',
    category: 'IT & BioTech',
    lat: 17.4474,
    lng: 78.3762,
    description: 'Major global technology delivery and pharmaceutical research district.',
    samplePrompt: 'Compare HITEC City Hyderabad vs Electronic City Bengaluru for enterprise software headquarters.',
  },
  {
    id: 'tokyo',
    name: 'Tokyo Tech District (Akihabara & Shibuya)',
    category: 'Hardware & Robotics',
    lat: 35.6983,
    lng: 139.7731,
    description: 'Robotics, semiconductor materials, and embedded systems hub.',
    samplePrompt: 'Evaluate Japan\'s competitive advantage in robotics and embedded AI hardware.',
  },
  {
    id: 'london',
    name: 'London AI Hub (King\'s Cross Knowledge Quarter)',
    category: 'Deep Tech',
    lat: 51.5308,
    lng: -0.1238,
    description: 'Frontier AI alignment and bio-molecular computing research cluster.',
    samplePrompt: 'How does London\'s Knowledge Quarter foster multi-disciplinary AI research in biology and mathematics?',
  },
  {
    id: 'pune',
    name: 'Pune AgriTech & Auto Cluster (Hinjawadi)',
    category: 'AgriTech & Automotive',
    lat: 18.5913,
    lng: 73.7389,
    description: 'Precision agriculture technologies and modern smart-manufacturing center.',
    samplePrompt: 'What role does Pune\'s AgriTech corridor play in modernizing Indian crop supply chains?',
  },
];

export const GoogleMapView: React.FC<GoogleMapViewProps> = ({
  onAskCouncilAboutLocation,
  onClose,
  isModal = false,
}) => {
  const envKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || (import.meta as any).env?.VITE_MAPS_API_KEY || '';
  const [apiKey, setApiKey] = useState<string>(envKey);
  const [inputKey, setInputKey] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<LocationPreset | null>(PRESET_LOCATIONS[0]);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: 20.5937,
    lng: 78.9629,
  });
  const [zoom, setZoom] = useState<number>(5);

  const handleSelectPreset = (loc: LocationPreset) => {
    setSelectedLocation(loc);
    setMapCenter({ lat: loc.lat, lng: loc.lng });
    setZoom(13);
  };

  const handleApplyCustomKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey.trim()) {
      setApiKey(inputKey.trim());
    }
  };

  return (
    <div
      id="google-maps-view-container"
      className={`flex flex-col bg-[#09090b] text-[#fafafa] rounded-2xl border border-[#27272a] overflow-hidden ${
        isModal ? 'h-[85vh] w-full max-w-5xl shadow-2xl' : 'h-[650px] w-full'
      }`}
    >
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-[#27272a] bg-[#121214] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              Google Maps Platform
              <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-[#1c1c1f] text-[#a1a1aa] border border-[#27272a]">
                Location Grounding
              </span>
            </h2>
            <p className="text-[11px] text-[#71717a]">
              Spatial context and regional intelligence for the AI Council
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#71717a] hover:text-white hover:bg-[#27272a] transition-colors"
              title="Close Map"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content: Sidebar Presets + Map */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Presets Sidebar */}
        <div className="w-full md:w-72 border-r border-[#27272a] bg-[#0c0c0e] flex flex-col overflow-y-auto shrink-0 p-3 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#71717a] uppercase tracking-wider px-1 pt-1">
            <span>Explore Locations</span>
            <span>{PRESET_LOCATIONS.length}</span>
          </div>

          <div className="space-y-1.5">
            {PRESET_LOCATIONS.map((loc) => {
              const isSelected = selectedLocation?.id === loc.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => handleSelectPreset(loc)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all text-xs cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600/10 border-blue-500/40 text-white'
                      : 'bg-[#18181b]/60 border-[#27272a]/70 text-[#a1a1aa] hover:bg-[#18181b] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-medium text-white mb-0.5">
                    <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-400' : 'text-[#71717a]'}`} />
                    <span className="truncate">{loc.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#71717a] mt-1">
                    <span>{loc.category}</span>
                    <span className="font-mono">{loc.lat.toFixed(2)}, {loc.lng.toFixed(2)}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Prompt action for selected location */}
          {selectedLocation && onAskCouncilAboutLocation && (
            <div className="mt-auto pt-3 border-t border-[#27272a] space-y-2">
              <span className="text-[11px] font-semibold text-[#a1a1aa]">Ask AI Council:</span>
              <p className="text-[11px] text-[#71717a] line-clamp-2 italic">
                &ldquo;{selectedLocation.samplePrompt}&rdquo;
              </p>
              <button
                onClick={() => onAskCouncilAboutLocation(selectedLocation.samplePrompt)}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Deliberate on Location</span>
              </button>
            </div>
          )}
        </div>

        {/* Interactive Map Area */}
        <div className="flex-1 relative h-full bg-[#18181b] flex flex-col">
          {apiKey ? (
            <APIProvider apiKey={apiKey}>
              <Map
                center={mapCenter}
                zoom={zoom}
                onCenterChanged={(ev) => setMapCenter(ev.detail.center)}
                onZoomChanged={(ev) => setZoom(ev.detail.zoom)}
                mapId="DEMO_MAP_ID"
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                className="w-full h-full"
                gestureHandling="greedy"
              >
                {PRESET_LOCATIONS.map((loc) => (
                  <AdvancedMarker
                    key={loc.id}
                    position={{ lat: loc.lat, lng: loc.lng }}
                    onClick={() => setSelectedLocation(loc)}
                    title={loc.name}
                  >
                    <Pin
                      background={selectedLocation?.id === loc.id ? '#2563eb' : '#4f46e5'}
                      borderColor="#ffffff"
                      glyphColor="#ffffff"
                      scale={selectedLocation?.id === loc.id ? 1.2 : 1.0}
                    />
                  </AdvancedMarker>
                ))}

                {selectedLocation && (
                  <InfoWindow
                    position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                    onCloseClick={() => setSelectedLocation(null)}
                  >
                    <div className="p-1 text-[#09090b] max-w-xs space-y-1.5">
                      <div className="font-bold text-xs text-gray-900">{selectedLocation.name}</div>
                      <p className="text-[11px] text-gray-700 leading-tight">
                        {selectedLocation.description}
                      </p>
                      {onAskCouncilAboutLocation && (
                        <button
                          onClick={() => onAskCouncilAboutLocation(selectedLocation.samplePrompt)}
                          className="mt-1 w-full py-1 px-2 rounded bg-blue-600 text-white text-[10px] font-semibold hover:bg-blue-700 transition-colors"
                        >
                          Ask AI Council
                        </button>
                      )}
                    </div>
                  </InfoWindow>
                )}
              </Map>
            </APIProvider>
          ) : (
            /* Fallback when API key is not yet configured */
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-radial from-[#18181b] to-[#09090b]">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-white mb-1">
                Google Maps Platform Ready
              </h3>
              <p className="text-xs text-[#a1a1aa] max-w-md mb-4 leading-relaxed">
                Visualizing interactive maps with <code className="text-blue-400 bg-[#18181b] px-1 py-0.5 rounded font-mono text-[11px]">@vis.gl/react-google-maps</code> and <code className="text-blue-400 bg-[#18181b] px-1 py-0.5 rounded font-mono text-[11px]">AdvancedMarkerElement</code>.
                Provide a Google Maps API Key or test with a development key.
              </p>

              {/* Form to enter or test key */}
              <form onSubmit={handleApplyCustomKey} className="flex flex-col sm:flex-row items-center gap-2 w-full max-w-md mb-4">
                <div className="relative w-full">
                  <Key className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
                  <input
                    type="password"
                    placeholder="Enter VITE_GOOGLE_MAPS_API_KEY..."
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#121214] border border-[#27272a] text-xs text-white placeholder:text-[#52525b] focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shrink-0 cursor-pointer transition-colors"
                >
                  Activate Map
                </button>
              </form>

              {/* Prototyping note & presets simulation */}
              <div className="p-3 rounded-xl bg-[#121214] border border-[#27272a] text-left max-w-md w-full text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-blue-400 font-medium">
                  <Info className="w-3.5 h-3.5" />
                  <span>Prototyping Notice & Attribution</span>
                </div>
                <p className="text-[11px] text-[#71717a] leading-relaxed">
                  Configured with mandatory compliance ID <code className="text-[#a1a1aa] font-mono">gmp_mcp_codeassist_v1_aistudio</code>.
                  Subject to Google Maps Platform Terms of Service. In production, set <code className="text-[#a1a1aa] font-mono">VITE_GOOGLE_MAPS_API_KEY</code> in your environment.
                </p>
                {selectedLocation && onAskCouncilAboutLocation && (
                  <button
                    onClick={() => onAskCouncilAboutLocation(selectedLocation.samplePrompt)}
                    className="w-full mt-2 py-1.5 px-3 rounded-lg bg-[#1c1c1f] hover:bg-[#27272a] border border-[#27272a] text-[#fafafa] text-[11px] font-medium transition-colors"
                  >
                    Consult AI Council on: {selectedLocation.name}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
