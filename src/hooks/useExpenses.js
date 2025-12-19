import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const useExpenses = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    let channel = null;

    const fetchExpenses = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('expenses')
          .select('*')
          .eq('uid', user.uid)
          .order('created_at', { ascending: false });
        if (error) throw error;

        const formatted = (data || []).map((r) => ({
          ...r,
          id: r.id,
          createdAt: r.created_at ? new Date(r.created_at) : new Date(),
        }));
        setExpenses(formatted);
      } catch (err) {
        console.error('Error fetching expenses:', err);
        setExpenses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();

    // Subscribe to realtime changes for this user's expenses
    channel = supabase
      .channel(`public:expenses:uid=${user.uid}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'expenses', filter: `uid=eq.${user.uid}` },
        (payload) => {
          // Simple handler: refetch on changes. For higher performance, update local state from payload.
          fetchExpenses();
        }
      )
      .subscribe();

    return () => {
      if (channel) channel.unsubscribe();
    };
  }, [user]);

  return { expenses, loading };
};

export default useExpenses;
