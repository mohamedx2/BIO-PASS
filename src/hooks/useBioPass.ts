"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
    generateSigningKeyPair,
    signToken,
    generateSessionId
} from "@/lib/crypto";
import { BioPassSession, BioPassState } from "@/types/biopass";

const SESSION_KEY = "bio-pass-session";
const DEFAULT_LIFETIME = 120; // 120 seconds

export function useBioPass() {
    const [state, setState] = useState<BioPassState>({
        status: "idle",
        session: null,
        token: null,
        timeLeft: 0,
    });

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const keysRef = useRef<CryptoKeyPair | null>(null);

    const clearSession = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        localStorage.removeItem(SESSION_KEY);
        keysRef.current = null;
        setState({
            status: "expired",
            session: null,
            token: null,
            timeLeft: 0,
        });
    }, []);

    const generatePass = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, status: "idle" }));

            const sessionId = generateSessionId();
            const iat = Math.floor(Date.now() / 1000);
            const exp = iat + DEFAULT_LIFETIME;
            const nonce = Math.random().toString(36).substring(2);

            const session: BioPassSession = {
                sessionId,
                iat,
                exp,
                nonce,
            };

            // 1. Generate keys
            const keys = await generateSigningKeyPair();
            keysRef.current = keys;

            // 2. Sign token
            const token = await signToken(session, keys.privateKey);

            // 3. Store session metadata in LocalStorage (obfuscated)
            const meta = JSON.stringify(session);
            localStorage.setItem(SESSION_KEY, btoa(meta));

            setState({
                status: "valid",
                session,
                token,
                timeLeft: DEFAULT_LIFETIME,
            });

            // 4. Start timer
            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = setInterval(() => {
                setState(prev => {
                    if (!prev.session || prev.timeLeft <= 0) {
                        if (timerRef.current) clearInterval(timerRef.current);
                        return { ...prev, status: "expired", timeLeft: 0 };
                    }

                    const newTimeLeft = prev.timeLeft - 1;
                    let newStatus = prev.status;

                    if (newTimeLeft <= 0) {
                        newStatus = "expired";
                        localStorage.removeItem(SESSION_KEY);
                    } else if (newTimeLeft < 30) {
                        newStatus = "expiring";
                    }

                    return {
                        ...prev,
                        timeLeft: newTimeLeft,
                        status: newStatus,
                    };
                });
            }, 1000);

        } catch (error) {
            console.error("Failed to generate Bio-Pass:", error);
            setState(prev => ({ ...prev, status: "expired" }));
        }
    }, []);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    return {
        ...state,
        generatePass,
        clearSession,
    };
}
