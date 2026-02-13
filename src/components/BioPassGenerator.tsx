"use client";

import { useBioPass } from "@/hooks/useBioPass";
import QRDisplay from "./QRDisplay";
import styles from "./BioPassGenerator.module.scss";

export default function BioPassGenerator() {
    const { status, session, token, timeLeft, generatePass, clearSession } = useBioPass();

    const isExpired = status === "expired";

    return (
        <div className={styles.bioPassContainer}>
            <div className={styles.header}>
                <h1 className={styles.title}>BIO-PASS</h1>
                <p className={styles.subtitle}>L&apos;Identité Numérique Éphémère</p>
            </div>

            <div className={styles.mainContent}>
                {(status === "valid" || status === "expiring" || status === "expired") && token ? (
                    <div className={styles.passActive}>
                        <div className={styles.statusBar}>
                            <div className={`status-indicator status-${status}`}></div>
                            <span className={styles.statusText}>{status.toUpperCase()}</span>
                            <span className={styles.timer} style={{ color: status === "expiring" ? "var(--accent-warning)" : status === "expired" ? "var(--accent-danger)" : "var(--accent-valid)" }}>
                                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                            </span>
                        </div>

                        <QRDisplay value={token} status={status} />

                        <div className={styles.sessionInfo}>
                            <p className={styles.label}>SESSION HASH</p>
                            <p className={styles.value}>{session?.sessionId.substring(0, 16)}...</p>
                        </div>

                        <div className={styles.actions}>
                            <button
                                className={`${styles.btn} ${styles.btnDanger}`}
                                onClick={clearSession}
                                disabled={isExpired}
                            >
                                DETRUIRE LA SESSION
                            </button>
                            {isExpired && (
                                <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={generatePass}>
                                    REGENERER
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className={styles.passWelcome}>
                        <div className={styles.securityIcon}>🔐</div>
                        <h2>Prêt à générer ?</h2>
                        <p>Créez une identité temporaire, sécurisée et auto-destructible.</p>
                        <button className={`${styles.btn} ${styles.btnPrimary} ${styles.large}`} onClick={generatePass}>
                            GENERER UN BIO-PASS
                        </button>
                    </div>
                )}
            </div>

            <div className={styles.footer}>
                <p>🔐 Cryptographie Client-Side • Pas de stockage persistant</p>
            </div>
        </div>
    );
}
