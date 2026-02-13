"use client";

import { QRCodeSVG } from "qrcode.react";
import styles from "./QRDisplay.module.scss";

interface QRDisplayProps {
  value: string;
  status: "valid" | "expiring" | "expired";
}

export default function QRDisplay({ value, status }: QRDisplayProps) {
  const isExpired = status === "expired";
  const isExpiring = status === "expiring";

  return (
    <div className={`${styles.qrContainer} ${styles[status]} ${isExpiring ? styles.expiringSoon : ""}`}>
      {isExpired ? (
        <div className={styles.expiredOverlay}>
          <span className={styles.expiredText}>EXPIRED</span>
          <p>Token destroyed</p>
        </div>
      ) : (
        <div className={styles.qrWrapper}>
          <QRCodeSVG
            value={value}
            size={256}
            bgColor="transparent"
            fgColor={isExpiring ? "var(--accent-warning)" : "var(--accent-valid)"}
            level="H"
            includeMargin={true}
          />
          <div className={styles.qrScanLine}></div>
        </div>
      )}
    </div>
  );
}
