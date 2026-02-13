"use client";

import { QRCodeSVG } from "qrcode.react";

interface QRDisplayProps {
    value: string;
    status: "valid" | "expiring" | "expired";
    timeLeft: number;
}

export default function QRDisplay({ value, status, timeLeft }: QRDisplayProps) {
    const isExpired = status === "expired";
    const isExpiring = status === "expiring";

    return (
        <div className={`qr-container glass ${isExpiring ? "expiring-soon" : ""}`}>
            {isExpired ? (
                <div className="expired-overlay">
                    <span className="expired-text">EXPIRED</span>
                    <p>Token destroyed</p>
                </div>
            ) : (
                <div className="qr-wrapper">
                    <QRCodeSVG
                        value={value}
                        size={256}
                        bgColor="transparent"
                        fgColor={isExpiring ? "var(--accent-warning)" : "var(--accent-valid)"}
                        level="H"
                        includeMargin={true}
                    />
                    <div className="qr-scan-line"></div>
                </div>
            )}

            <style jsx>{`
        .qr-container {
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 320px;
          height: 320px;
          position: relative;
          transition: all 0.3s ease;
          border-color: ${isExpiring ? "var(--accent-warning)" : isExpired ? "var(--accent-danger)" : "var(--accent-valid)"};
        }

        .qr-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }

        .qr-scan-line {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: ${isExpiring ? "var(--accent-warning)" : "var(--accent-valid)"};
          animation: scan 3s linear infinite;
          box-shadow: 0 0 15px currentColor;
        }

        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }

        .expired-overlay {
          text-align: center;
          color: var(--accent-danger);
        }

        .expired-text {
          font-size: 2rem;
          font-weight: bold;
          letter-spacing: 4px;
          display: block;
          margin-bottom: 8px;
        }

        .expiring-soon {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both infinite;
          transform: translate3d(0, 0, 0);
        }

        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
        </div>
    );
}
