export interface BioPassSession {
    sessionId: string;
    iat: number;
    exp: number;
    nonce: string;
}

export interface BioPassState {
    status: "idle" | "valid" | "expiring" | "expired";
    session: BioPassSession | null;
    token: string | null;
    timeLeft: number;
}
