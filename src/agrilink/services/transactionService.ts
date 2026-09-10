import { Transaction, DigitalLot, BuyerOffer, TransactionStatus } from '../types';
import { localStorageService } from './storageService';
import { lotService } from './lotService';

export const transactionService = {
  getAll(): Transaction[] {
    return localStorageService.getTransactions();
  },

  getById(id: string): Transaction | undefined {
    return this.getAll().find(t => t.id === id || t.transactionNumber === id);
  },

  getByFarmerId(farmerId: string): Transaction[] {
    return this.getAll().filter(t => t.farmerId === farmerId);
  },

  getByBuyerId(buyerId: string): Transaction[] {
    return this.getAll().filter(t => t.buyerId === buyerId);
  },

  createTransactionFromOffer(lot: DigitalLot, offer: BuyerOffer): Transaction {
    const txnNumber = `SAL-TXN-00${Math.floor(400 + Math.random() * 590)}`;
    const txnId = `txn-${Date.now()}`;
    const nowStr = 'Just now';

    const newTxn: Transaction = {
      id: txnId,
      transactionNumber: txnNumber,
      lotId: lot.id,
      lotNumber: lot.lotNumber,
      crop: lot.crop,
      quantityQuintals: lot.quantityQuintals,
      agreedPricePerQ: offer.offeredPricePerQ,
      grossAmount: offer.grossSaleValue,
      transportCost: offer.transportAllowance,
      handlingCost: offer.handlingCost,
      storageCost: 0,
      otherCharges: 0,
      netRealizationAmount: offer.totalNetRealization,
      farmerId: lot.farmerId,
      farmerName: lot.farmerName,
      buyerId: offer.buyerId,
      buyerName: offer.buyerName,
      status: 'Offer Accepted',
      paymentStatus: 'Escrow Held',
      paymentUtr: `SAL-ESC-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      timeline: [
        { stepIndex: 1, title: 'Lot Created', timestamp: 'Completed', completed: true, current: false, details: `Lot ${lot.lotNumber} registered with ${lot.qualityGrade}.` },
        { stepIndex: 2, title: 'Buyer Matched', timestamp: 'Completed', completed: true, current: false, details: `${offer.buyerName} matched and submitted commercial bid.` },
        { stepIndex: 3, title: 'Offer Accepted', timestamp: nowStr, completed: true, current: true, details: `Agreed at ₹${offer.offeredPricePerQ}/q. Net realization locked at ₹${offer.totalNetRealization.toLocaleString('en-IN')}.` },
        { stepIndex: 4, title: 'Pickup Scheduled', timestamp: 'Pending', completed: false, current: false, details: 'Assign transport vehicle for farm-gate dispatch.' },
        { stepIndex: 5, title: 'In Transit', timestamp: 'Pending', completed: false, current: false, details: 'Consignment en route to buyer unloading yard.' },
        { stepIndex: 6, title: 'Delivered', timestamp: 'Pending', completed: false, current: false, details: 'Vehicle arrived and gross weighment recorded.' },
        { stepIndex: 7, title: 'Weighment Verified', timestamp: 'Pending', completed: false, current: false, details: 'Digital weighment slip certified by APMC/Buyer gate.' },
        { stepIndex: 8, title: 'Payment Completed', timestamp: 'Pending', completed: false, current: false, details: 'Escrow release to farmer bank account via RTGS/NEFT.' }
      ]
    };

    const current = this.getAll();
    localStorageService.saveTransactions([newTxn, ...current]);
    return newTxn;
  },

  advanceTransactionStep(txnId: string): Transaction | undefined {
    const list = this.getAll();
    let updatedTxn: Transaction | undefined;

    const updatedList = list.map(txn => {
      if (txn.id !== txnId) return txn;

      const timeline = [...txn.timeline];
      const currentIndex = timeline.findIndex(step => step.current);

      if (currentIndex >= 0 && currentIndex < timeline.length - 1) {
        timeline[currentIndex].completed = true;
        timeline[currentIndex].current = false;
        timeline[currentIndex].timestamp = 'Just now';

        const nextIndex = currentIndex + 1;
        timeline[nextIndex].current = true;
        timeline[nextIndex].timestamp = 'In progress';

        let newStatus: TransactionStatus = txn.status;
        let newPaymentStatus = txn.paymentStatus;
        let lotStatus = 'In Transit';

        if (nextIndex === 3) {
          newStatus = 'Pickup Scheduled';
          lotStatus = 'In Transit';
        } else if (nextIndex === 4) {
          newStatus = 'In Transit';
          lotStatus = 'In Transit';
        } else if (nextIndex === 5) {
          newStatus = 'Delivered';
          lotStatus = 'Delivered';
        } else if (nextIndex === 6) {
          newStatus = 'Weighment Verified';
          newPaymentStatus = 'Payment Processing';
          lotStatus = 'Payment Processing';
        } else if (nextIndex === 7) {
          timeline[nextIndex].completed = true;
          timeline[nextIndex].current = false;
          timeline[nextIndex].timestamp = 'Just now';
          newStatus = 'Payment Completed';
          newPaymentStatus = 'Payment Completed';
          lotStatus = 'Completed';
          txn.paymentDate = 'Completed today';
        }

        lotService.updateLotStatus(txn.lotId, lotStatus as any);

        updatedTxn = {
          ...txn,
          status: newStatus,
          paymentStatus: newPaymentStatus,
          timeline
        };
        return updatedTxn;
      }
      return txn;
    });

    localStorageService.saveTransactions(updatedList);
    return updatedTxn;
  },

  completePayment(txnId: string): Transaction | undefined {
    const list = this.getAll();
    let updatedTxn: Transaction | undefined;

    const updatedList = list.map(txn => {
      if (txn.id !== txnId) return txn;

      const timeline = txn.timeline.map((step, idx) => {
        if (idx === 7) {
          return {
            ...step,
            completed: true,
            current: false,
            timestamp: 'Just now'
          };
        }
        return { ...step, completed: true, current: false };
      });

      updatedTxn = {
        ...txn,
        status: 'Payment Completed',
        paymentStatus: 'Payment Completed',
        paymentDate: 'Today via FastPay Escrow',
        paymentUtr: `SAL-FAST-${Date.now().toString().slice(-8)}`,
        timeline
      };
      lotService.updateLotStatus(txn.lotId, 'Completed');
      return updatedTxn;
    });

    localStorageService.saveTransactions(updatedList);
    return updatedTxn;
  }
};
