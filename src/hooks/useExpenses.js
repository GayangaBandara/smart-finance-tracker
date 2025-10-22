import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
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

        setLoading(true);
        const q = query(
            collection(db, 'expenses'),
            where('uid', '==', user.uid),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const expensesData = [];
            querySnapshot.forEach((doc) => {
                expensesData.push({ ...doc.data(), id: doc.id });
            });
            setExpenses(expensesData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching expenses:", error);
            setExpenses([]);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    return { expenses, loading };
};

export default useExpenses;