import { useCallback, useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { LoyaltyService, LoyaltyTransaction, LoyaltyAction } from '../lib/loyalty';

export function useLoyalty() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [awarded, setAwarded] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await LoyaltyService.getMyTransactions();
      setTransactions(data);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      refresh();
    } else {
      setTransactions([]);
    }
  }, [user?.id, refresh]);

  const award = useCallback(
    async (action: LoyaltyAction, objectId?: string): Promise<number> => {
      if (!user?.id) return 0;
      const points = await LoyaltyService.awardPoints(user.id, action, objectId);
      if (points > 0) {
        setAwarded(prev => ({ ...prev, [`${action}:${objectId || ''}`]: (prev[`${action}:${objectId || ''}`] || 0) + points }));
        // rafraîchir asynchrone
        refresh();
      }
      return points;
    },
    [user?.id, refresh]
  );

  return { transactions, awarded, loading, award, refresh };
}


