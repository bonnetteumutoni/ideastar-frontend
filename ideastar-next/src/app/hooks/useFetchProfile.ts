'use client';
import { useState, useEffect } from "react";
import { fetchProfile } from "../utils/fetchProfile";

interface User {
    id: string;
    name: string;
    first_name: string;
    last_name?: string;
    profile_image: string;
    followers_count: number;
    following_count: number;
    role:string;
    created_at: string;
    updated_at: string;
    email?: string;
}

const useFetchProfiles = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        (async () => {
            setLoading(true);
            try {
                const userData = await fetchProfile();
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        })()
    }, []);

    return { user, loading, error };
};

export default useFetchProfiles;