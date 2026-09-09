import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DigitalLot, BuyerOffer, BuyerProfile } from '../agrilink/types';
import { lotService } from '../agrilink/services/lotService';
import { offerService } from '../agrilink/services/offerService';
import { buyerService } from '../agrilink/services/buyerService';
import { localStorageService } from '../agrilink/services/storageService';

export interface FarmerProfile {
  id: string;
  name: string;
  phone: string;
  location: string;
  district: string;
  state: string;
  status: 'Active' | 'Verified' | 'Flagged' | 'Suspended';
  activeLotsCount: number;
  totalQuantityQuintals: number;
  rating: number;
}

const INITIAL_FARMERS: FarmerProfile[] = [
  {
    id: 'farmer-ramesh-ap',
    name: 'Ramesh Reddy',
    phone: '+91 98480 12345',
    location: 'Kadapa Rural, Andhra Pradesh',
    district: 'YSR Kadapa',
    state: 'Andhra Pradesh',
    status: 'Verified',
    activeLotsCount: 3,
    totalQuantityQuintals: 240,
    rating: 4.9,
  },
  {
    id: 'farmer-suresh-mh',
    name: 'Suresh Patil',
    phone: '+91 98220 44551',
    location: 'Dindori, Nashik, Maharashtra',
    district: 'Nashik',
    state: 'Maharashtra',
    status: 'Verified',
    activeLotsCount: 2,
    totalQuantityQuintals: 160,
    rating: 4.8,
  },
  {
    id: 'farmer-venkat-tg',
    name: 'Venkatesh Rao',
    phone: '+91 94401 88992',
    location: 'Armoor, Nizamabad, Telangana',
    district: 'Nizamabad',
    state: 'Telangana',
    status: 'Verified',
    activeLotsCount: 4,
    totalQuantityQuintals: 310,
    rating: 4.7,
  },
  {
    id: 'farmer-anand-ka',
    name: 'Anand Gowda',
    phone: '+91 99002 33441',
    location: 'Srinivaspur, Kolar, Karnataka',
    district: 'Kolar',
    state: 'Karnataka',
    status: 'Active',
    activeLotsCount: 1,
    totalQuantityQuintals: 75,
    rating: 4.6,
  },
  {
    id: 'farmer-suspicious-01',
    name: 'Kisan Fast Traders (Unverified Broker)',
    phone: '+91 91111 00000',
    location: 'Border Checkpost, MP',
    district: 'Indore',
    state: 'Madhya Pradesh',
    status: 'Flagged',
    activeLotsCount: 1,
    totalQuantityQuintals: 500,
    rating: 3.2,
  },
];

export interface MarketplaceContextType {
  listings: DigitalLot[];
  bids: BuyerOffer[];
  farmers: FarmerProfile[];
  buyers: BuyerProfile[];
  // Farmer actions
  createListing: (data: any) => DigitalLot;
  acceptBid: (bidId: string) => void;
  rejectBid: (bidId: string) => void;
  getBidsForLot: (lotId: string) => BuyerOffer[];
  getFarmerListings: (farmerId?: string) => DigitalLot[];
  // Buyer actions
  placeBid: (lotId: string, data: {
    buyerName: string;
    buyerPhone: string;
    buyerLocation?: string;
    offeredPricePerQ: number;
    quantityQuintals: number;
    paymentTerms?: string;
    notes?: string;
  }) => BuyerOffer;
  // Admin actions
  verifyFarmer: (farmerId: string) => void;
  flagFarmer: (farmerId: string) => void;
  suspendFarmer: (farmerId: string) => void;
  removeFarmer: (farmerId: string) => void;
  verifyBuyer: (buyerId: string) => void;
  flagBuyer: (buyerId: string) => void;
  suspendBuyer: (buyerId: string) => void;
  removeBuyer: (buyerId: string) => void;
  removeListing: (lotId: string) => void;
  flagListing: (lotId: string) => void;
  // Stats
  refreshData: () => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [listings, setListings] = useState<DigitalLot[]>(() => lotService.getAllLots());
  const [bids, setBids] = useState<BuyerOffer[]>(() => offerService.getAllOffers());
  const [buyers, setBuyers] = useState<BuyerProfile[]>(() => buyerService.getAllBuyers());
  const [farmers, setFarmers] = useState<FarmerProfile[]>(() => {
    const saved = localStorage.getItem('krishi_admin_farmers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_FARMERS;
  });

  const refreshData = () => {
    setListings([...lotService.getAllLots()]);
    setBids([...offerService.getAllOffers()]);
    setBuyers([...buyerService.getAllBuyers()]);
  };

  useEffect(() => {
    localStorage.setItem('krishi_admin_farmers', JSON.stringify(farmers));
  }, [farmers]);

  useEffect(() => {
    const handler = () => {
      refreshData();
    };
    window.addEventListener('smartagrilink_data_changed', handler);
    return () => window.removeEventListener('smartagrilink_data_changed', handler);
  }, []);

  const createListing = (data: any): DigitalLot => {
    const newLot = lotService.createLot(data);
    refreshData();
    return newLot;
  };

  const getBidsForLot = (lotId: string): BuyerOffer[] => {
    return offerService.getOffersForLot(lotId);
  };

  const getFarmerListings = (farmerId?: string): DigitalLot[] => {
    if (!farmerId) return listings;
    return listings.filter((l) => l.farmerId === farmerId);
  };

  const placeBid = (
    lotId: string,
    data: {
      buyerName: string;
      buyerPhone: string;
      buyerLocation?: string;
      offeredPricePerQ: number;
      quantityQuintals: number;
      paymentTerms?: string;
      notes?: string;
    }
  ): BuyerOffer => {
    const lot = listings.find((l) => l.id === lotId) || lotService.getLotById(lotId);
    const gross = data.offeredPricePerQ * data.quantityQuintals;
    const freight = Math.round(data.quantityQuintals * 35);
    const handling = 600;
    const net = gross - (freight + handling);

    const newOffer: BuyerOffer = {
      id: `off-${Date.now()}`,
      offerNumber: `OFF-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      lotId,
      buyerId: `buyer-${data.buyerPhone.slice(-4) || 'user'}`,
      buyerName: data.buyerName,
      buyerRating: 4.9,
      buyerLocation: data.buyerLocation || 'Regional Agri Terminal Hub (18 km)',
      buyerDistanceKm: 18,
      buyerReliabilityPct: 98,
      offeredPricePerQ: data.offeredPricePerQ,
      quantityQuintals: data.quantityQuintals,
      transportAllowance: freight,
      handlingCost: handling,
      estimatedNetRealizationPerQ: Math.round(net / Math.max(1, data.quantityQuintals)),
      totalNetRealization: net,
      grossSaleValue: gross,
      paymentTerms: data.paymentTerms || 'Within 24 hours via Instant Bank Escrow',
      status: 'Pending',
      createdAt: new Date().toISOString(),
      notes: data.notes || `Direct farmgate pickup requested for ${lot?.crop || 'crop'}. Verified buyer commitment.`,
    };

    // Save to offers storage
    const allOffers = offerService.getAllOffers();
    const updatedOffers = [newOffer, ...allOffers];
    localStorageService.saveOffers(updatedOffers);

    // Also update lot status to 'Offers Received'
    if (lot) {
      lot.status = 'Offers Received';
      lot.interestedBuyers = lot.interestedBuyers || [];
      lot.interestedBuyers.push({
        id: newOffer.buyerId,
        buyerName: newOffer.buyerName,
        buyerPhone: data.buyerPhone,
        quantityQuintals: data.quantityQuintals,
        notes: data.notes,
        createdAt: new Date().toISOString(),
      });
      const allLots = lotService.getAllLots();
      const updatedLots = allLots.map((l) => (l.id === lot.id ? lot : l));
      localStorageService.saveLots(updatedLots);
    }

    refreshData();
    window.dispatchEvent(new CustomEvent('smartagrilink_data_changed'));
    return newOffer;
  };

  const acceptBid = (bidId: string) => {
    offerService.acceptOffer(bidId);
    refreshData();
    window.dispatchEvent(new CustomEvent('smartagrilink_data_changed'));
  };

  const rejectBid = (bidId: string) => {
    offerService.rejectOffer(bidId);
    refreshData();
    window.dispatchEvent(new CustomEvent('smartagrilink_data_changed'));
  };

  // Admin functions
  const verifyFarmer = (farmerId: string) => {
    setFarmers((prev) =>
      prev.map((f) => (f.id === farmerId ? { ...f, status: 'Verified' } : f))
    );
  };

  const flagFarmer = (farmerId: string) => {
    setFarmers((prev) =>
      prev.map((f) => (f.id === farmerId ? { ...f, status: 'Flagged' } : f))
    );
  };

  const suspendFarmer = (farmerId: string) => {
    setFarmers((prev) =>
      prev.map((f) => (f.id === farmerId ? { ...f, status: 'Suspended' } : f))
    );
  };

  const removeFarmer = (farmerId: string) => {
    setFarmers((prev) => prev.filter((f) => f.id !== farmerId));
  };

  const verifyBuyer = (buyerId: string) => {
    setBuyers((prev) =>
      prev.map((b) => (b.id === buyerId ? { ...b, kycVerified: true, businessVerified: true } : b))
    );
  };

  const flagBuyer = (buyerId: string) => {
    setBuyers((prev) =>
      prev.map((b) => (b.id === buyerId ? { ...b, kycVerified: false } : b))
    );
  };

  const suspendBuyer = (buyerId: string) => {
    setBuyers((prev) =>
      prev.map((b) => (b.id === buyerId ? { ...b, paymentReliabilityPct: 0 } : b))
    );
  };

  const removeBuyer = (buyerId: string) => {
    setBuyers((prev) => prev.filter((b) => b.id !== buyerId));
  };

  const removeListing = (lotId: string) => {
    const updated = listings.filter((l) => l.id !== lotId);
    localStorageService.saveLots(updated);
    setListings(updated);
    window.dispatchEvent(new CustomEvent('smartagrilink_data_changed'));
  };

  const flagListing = (lotId: string) => {
    const target = listings.find((l) => l.id === lotId);
    if (target) {
      target.description = `[FLAGGED BY REGULATOR] ${target.description}`;
      const allLots = lotService.getAllLots();
      const updatedLots = allLots.map((l) => (l.id === lotId ? target : l));
      localStorageService.saveLots(updatedLots);
      refreshData();
    }
  };

  return (
    <MarketplaceContext.Provider
      value={{
        listings,
        bids,
        farmers,
        buyers,
        createListing,
        acceptBid,
        rejectBid,
        getBidsForLot,
        getFarmerListings,
        placeBid,
        verifyFarmer,
        flagFarmer,
        suspendFarmer,
        removeFarmer,
        verifyBuyer,
        flagBuyer,
        suspendBuyer,
        removeBuyer,
        removeListing,
        flagListing,
        refreshData,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = (): MarketplaceContextType => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
