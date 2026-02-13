"use client";

import { useBioPass } from "@/hooks/useBioPass";
import QRDisplay from "./QRDisplay";

export default function BioPassGenerator() {
    const { status, session, token, timeLeft, generatePass, clearSession } = useBioPass();

    const isIdle = status === "idle" && !token;
    const isExpired = status === "expired";

    return (
        <div className="bio-pass-container">
            <div className="header">
                <h1>BIO-PASS</h1>
                <p className="subtitle">L'Identité Numérique Éphémère</p>
            </div>

            <div className="main-content">
                {(status === "valid" || status === "expiring" || status === "expired") && token ? (
                    <div className="pass-active">
                        <div className="status-bar glass">
                            <div className={`status-indicator status-${status}`}></div>
                            <span className="status-text">{status.toUpperCase()}</span>
                            <span className="timer" style={{ color: status === "expiring" ? "var(--accent-warning)" : status === "expired" ? "var(--accent-danger)" : "var(--accent-valid)" }}>
                                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                            </span>
                        </div>

                        <QRDisplay value={token} status={status} timeLeft={timeLeft} />

                        <div className="session-info glass">
                            <p className="label">SESSION HASH</p>
                            <p className="value">{session?.sessionId.substring(0, 16)}...</p>
                        </div>

                        <div className="actions">
                            <button
                                className="btn btn-danger"
                                onClick={clearSession}
                                disabled={isExpired}
                            >
                                DETRUIRE LA SESSION
                            </button>
                            {isExpired && (
                                <button className="btn btn-primary" onClick={generatePass}>
                                    REGENERER
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="pass-welcome glass">
                        <div className="security-icon">🔐</div>
                        <h2>Prêt à générer ?</h2>
                        <p>Créez une identité temporaire, sécurisée et auto-destructible.</p>
                        <button className="btn btn-primary large" onClick={generatePass}>
                            GENERER UN BIO-PASS
                        </button>
                    </div>
                )}
            </div>

            <div className="footer">
                <p>🔐 Cryptographie Client-Side • Pas de stockage persistant</p>
            </div>

            <style jsx>{`
        .bio-pass-container {
          max-width: 480px;
          margin: 0 auto;
          padding: 40px 20px;
          display: flex;
          flex-direction: column;
          gap: 40px;
          min-height: 100vh;
        }

        .header {
          text-align: center;
        }

        h1 {
          font-size: 3rem;
          letter-spacing: 8px;
          margin-bottom: 4px;
          background: linear-gradient(to bottom, #fff, #666);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          color: var(--text-secondary);
          letter-spacing: 2px;
          font-size: 0.9rem;
        }

        .main-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
        }

        .status-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 24px;
          border-radius: 40px;
          width: 100%;
          justify-content: space-between;
        }

        .status-text {
          font-weight: bold;
          letter-spacing: 2px;
          flex-grow: 1;
        }

        .timer {
          font-family: var(--font-mono);
          font-weight: bold;
          font-size: 1.2rem;
        }

        .session-info {
          width: 100%;
          padding: 16px;
          text-align: center;
        }

        .label {
          font-size: 0.7rem;
          color: var(--text-secondary);
          margin-bottom: 4px;
        }

        .value {
          font-size: 0.8rem;
          color: var(--accent-valid);
          word-break: break-all;
        }

        .pass-welcome {
          padding: 40px;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 20px;
          align-items: center;
        }

        .security-icon {
          font-size: 3rem;
          margin-bottom: 10px;
        }

        .actions {
          display: flex;
          gap: 12px;
          width: 100%;
        }

        .btn {
          padding: 12px 24px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-family: var(--font-mono);
          font-weight: bold;
          transition: all 0.2s ease;
          flex: 1;
        }

        .btn-primary {
          background: var(--accent-valid);
          color: black;
        }

        .btn-primary:hover {
          box-shadow: 0 0 20px var(--accent-valid);
        }

        .btn-danger {
          background: transparent;
          border: 1px solid var(--accent-danger);
          color: var(--accent-danger);
        }

        .btn-danger:hover:not(:disabled) {
          background: var(--accent-danger);
          color: white;
        }

        .btn-danger:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .large {
          width: 100%;
          padding: 16px;
          font-size: 1.1rem;
        }

        .footer {
          text-align: center;
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-top: auto;
        }
      `}</style>
        </div>
    );
}
