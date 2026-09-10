import { BuyerOffer } from '../types';
import { localStorageService } from './storageService';
import { lotService } from './lotService';
import { transactionService } from './transactionService';
import { notificationService } from './notificationService';

export const offerService = {
  getAllOffers(): BuyerOffer[] {
    return localStorageService.getOffers();
  },

  getOffersForLot(lotId: string): BuyerOffer[] {
    const offers = this.getAllOffers().filter(o => o.lotId === lotId);
    if (offers.length > 0) {
      return [...offers].sort((a, b) => b.totalNetRealization - a.totalNetRealization);
    }

    const lot = lotService.getLotById(lotId);
    if (lot) {
      const priceA = Math.round(lot.expectedPricePerQ * 1.04);
      const freightA = Math.round(lot.quantityQuintals * 35);
      const grossA = priceA * lot.quantityQuintals;
      const netA = grossA - (freightA + 800);

      const priceB = Math.round(lot.expectedPricePerQ * 1.08);
      const freightB = Math.round(lot.quantityQuintals * 85);
      const grossB = priceB * lot.quantityQuintals;
      const netB = grossB - (freightB + 1200);

      const generated: BuyerOffer[] = [
        {
          id: `off-gen-${lot.id}-1`,
          offerNumber: `OFF-2026-${Math.floor(10000 + Math.random() * 90000)}`,
          lotId: lot.id,
          buyerId: 'buyer-auto-regional',
          buyerName: `${lot.state} State Agro Commodity Corp`,
          buyerRating: 4.8,
          buyerLocation: `${lot.district} Agro Park (25 km)`,
          buyerDistanceKm: 25,
          buyerReliabilityPct: 97,
          offeredPricePerQ: priceA,
          quantityQuintals: lot.quantityQuintals,
          transportAllowance: freightA,
          handlingCost: 800,
          estimatedNetRealizationPerQ: Math.round(netA / lot.quantityQuintals),
          totalNetRealization: netA,
          grossSaleValue: grossA,
          paymentTerms: 'Within 24 hours via Escrow',
          status: 'Pending',
          createdAt: new Date().toISOString(),
          notes: `Direct procurement matching ${lot.qualityGrade} standard. Immediate door pickup.`
        },
        {
          id: `off-gen-${lot.id}-2`,
          offerNumber: `OFF-2026-${Math.floor(10000 + Math.random() * 90000)}`,
          lotId: lot.id,
          buyerId: 'buyer-auto-terminal',
          buyerName: 'National Agri Export Hub',
          buyerRating: 4.9,
          buyerLocation: 'State Central Terminal (110 km)',
          buyerDistanceKm: 110,
          buyerReliabilityPct: 99,
          offeredPricePerQ: priceB,
          quantityQuintals: lot.quantityQuintals,
          transportAllowance: freightB,
          handlingCost: 1200,
          estimatedNetRealizationPerQ: Math.round(netB / lot.quantityQuintals),
          totalNetRealization: netB,
          grossSaleValue: grossB,
          paymentTerms: 'Within 48 hours',
          status: 'Pending',
          createdAt: new Date().toISOString(),
          notes: 'Higher gross price quoted for export consignment; distance freight deducted.'
        }
      ];

      return generated.sort((a, b) => b.totalNetRealization - a.totalNetRealization);
    }

    return [];
  },

  createOffer(data: {
    lotId: string;
    buyerId: string;
    buyerName: string;
    buyerRating: number;
    buyerLocation: string;
    buyerDistanceKm: number;
    buyerReliabilityPct: number;
    offeredPricePerQ: number;
    quantityQuintals: number;
    transportAllowance: number;
    handlingCost: number;
    paymentTerms: string;
    notes?: string;
  }): BuyerOffer {
    const grossSaleValue = data.offeredPricePerQ * data.quantityQuintals;
    const totalNetRealization = grossSaleValue - (data.transportAllowance + data.handlingCost);
    const estimatedNetRealizationPerQ = Math.round((totalNetRealization / data.quantityQuintals) * 10) / 10;

    const newOffer: BuyerOffer = {
      id: `off-${Date.now()}`,
      offerNumber: `OFF-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      lotId: data.lotId,
      buyerId: data.buyerId,
      buyerName: data.buyerName,
      buyerRating: data.buyerRating,
      buyerLocation: data.buyerLocation,
      buyerDistanceKm: data.buyerDistanceKm,
      buyerReliabilityPct: data.buyerReliabilityPct,
      offeredPricePerQ: data.offeredPricePerQ,
      quantityQuintals: data.quantityQuintals,
      transportAllowance: data.transportAllowance,
      handlingCost: data.handlingCost,
      estimatedNetRealizationPerQ,
      totalNetRealization,
      grossSaleValue,
      paymentTerms: data.paymentTerms,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      notes: data.notes
    };

    const current = this.getAllOffers();
    localStorageService.saveOffers([newOffer, ...current]);
    lotService.updateLotStatus(data.lotId, 'Offers Received');

    notificationService.notify({
      title: 'New Digital Offer Received',
      message: `${data.buyerName} submitted an offer of ₹${data.offeredPricePerQ}/q for your lot.`,
      type: 'offer',
      link: '/farmer/offers'
    });

    return newOffer;
  },

  acceptOffer(offerId: string): { success: boolean; transactionId?: string } {
    const offers = this.getAllOffers();
    const offer = offers.find(o => o.id === offerId);
    if (!offer) return { success: false };

    const lot = lotService.getLotById(offer.lotId);
    if (!lot) return { success: false };

    // Update offer status
    const updatedOffers = offers.map(o => {
      if (o.id === offerId) {
        return { ...o, status: 'Accepted' as const };
      }
      if (o.lotId === offer.lotId && o.id !== offerId) {
        return { ...o, status: 'Rejected' as const };
      }
      return o;
    });
    localStorageService.saveOffers(updatedOffers);

    // Update lot status
    lotService.updateLotStatus(lot.id, 'Offer Accepted', {
      acceptedOfferId: offer.id,
      buyerId: offer.buyerId,
      buyerName: offer.buyerName
    });

    // Create formal transaction
    const txn = transactionService.createTransactionFromOffer(lot, offer);

    notificationService.notify({
      title: 'Offer Accepted & Deal Locked! 🎉',
      message: `Offer from ${offer.buyerName} accepted. Transaction ${txn.transactionNumber} initiated with net payout ₹${offer.totalNetRealization.toLocaleString('en-IN')}.`,
      type: 'payment',
      link: '/farmer/transactions'
    });

    return { success: true, transactionId: txn.id };
  },

  rejectOffer(offerId: string) {
    const offers = this.getAllOffers().map(o => (o.id === offerId ? { ...o, status: 'Rejected' as const } : o));
    localStorageService.saveOffers(offers);
  }
};
