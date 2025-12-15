import React, { useEffect, useMemo, useState } from "react";

function CatBoostTree() {
  const sets = useMemo(
    () => [
      {
        root: "Vehicle Price ≤ 24,000",
        lvl2: "Past Claims ≥ 1",
        left: "Age of Vehicle ≤ 4",
        right: "Witness Present = Yes",
      },
      {
        root: "Accident Area = Urban",
        lvl2: "Police Report Filed = No",
        left: "Base Policy = Liability",
        right: "Vehicle Category = Sport",
      },
      {
        root: "Age of Policyholder ≤ 27",
        lvl2: "Marital Status = Single",
        left: "Vehicle Price ≥ 30,000",
        right: "Past Claims ≥ 2",
      },
      {
        root: "Vehicle Category = Sedan",
        lvl2: "Age of Vehicle ≥ 8",
        left: "Police Report Filed = Yes",
        right: "Accident Area = Rural",
      },
      {
        root: "Vehicle Price ≤ 18,000",
        lvl2: "Fault = Policyholder",
        left: "Past Claims ≥ 1",
        right: "Base Policy = Collision",
      },
      {
        root: "Accident Area = Rural",
        lvl2: "Witness Present = No",
        left: "Age of Vehicle ≥ 6",
        right: "Vehicle Category = Pickup",
      },
      {
        root: "Marital Status = Married",
        lvl2: "Vehicle Price ≥ 28,000",
        left: "Fault = Third Party",
        right: "Police Report Filed = No",
      },
      {
        root: "Past Claims = 0",
        lvl2: "Age of Policyholder ≥ 45",
        left: "Vehicle Category = SUV",
        right: "Accident Area = Urban",
      },
    ],
    []
  );

  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // fade out
      setFade(false);

      // swap text mid-transition
      setTimeout(() => {
        setIdx((i) => (i + 1) % sets.length);
        setFade(true);
      }, 220);
    }, 3000);

    return () => clearInterval(interval);
  }, [sets.length]);

  const cur = sets[idx];

  return (
    <div className="treeWrap">
      <div className={`tree ${fade ? "isIn" : "isOut"}`}>
        {/* Level 1 */}
        <div className="node nodeRoot">
          <span className="nodeText">{cur.root}</span>
        </div>

        {/* Connectors L1 -> L2 */}
        <svg className="wires wires12" viewBox="0 0 520 120" fill="none">
          <path d="M260 18 V60" stroke="rgba(255,255,255,0.20)" strokeWidth="2" />
          <path d="M260 60 C260 60, 180 60, 140 92" stroke="rgba(255,255,255,0.20)" strokeWidth="2" />
          <path d="M260 60 C260 60, 340 60, 380 92" stroke="rgba(255,255,255,0.20)" strokeWidth="2" />
        </svg>

        {/* Level 2 (symmetric: same text on both) */}
        <div className="lvl2">
          <div className="node">
            <span className="nodeText">{cur.lvl2}</span>
          </div>
          <div className="node">
            <span className="nodeText">{cur.lvl2}</span>
          </div>
        </div>

        {/* Connectors L2 -> L3 */}
        <svg className="wires wires23" viewBox="0 0 520 140" fill="none">
          {/* from left lvl2 */}
          <path d="M140 18 V52" stroke="rgba(255,255,255,0.20)" strokeWidth="2" />
          <path d="M140 52 C140 52, 95 52, 70 112" stroke="rgba(255,255,255,0.20)" strokeWidth="2" />
          <path d="M140 52 C140 52, 185 52, 210 112" stroke="rgba(255,255,255,0.20)" strokeWidth="2" />

          {/* from right lvl2 */}
          <path d="M380 18 V52" stroke="rgba(255,255,255,0.20)" strokeWidth="2" />
          <path d="M380 52 C380 52, 335 52, 310 112" stroke="rgba(255,255,255,0.20)" strokeWidth="2" />
          <path d="M380 52 C380 52, 425 52, 450 112" stroke="rgba(255,255,255,0.20)" strokeWidth="2" />
        </svg>

        {/* Level 3 (symmetric: left pair same, right pair same) */}
        <div className="lvl3">
          <div className="node">
            <span className="nodeText">{cur.left}</span>
          </div>
          <div className="node">
            <span className="nodeText">{cur.left}</span>
          </div>
          <div className="node">
            <span className="nodeText">{cur.right}</span>
          </div>
          <div className="node">
            <span className="nodeText">{cur.right}</span>
          </div>
        </div>

        {/* tiny label */}
        <div className="treeHint">Symmetric tree (depth 2) — rules refresh every 3s</div>
      </div>

      <style jsx>{`
        .treeWrap {
          position: relative;
          width: 100%;
        }

        .tree {
          position: relative;
          width: 100%;
          max-width: 560px;
          margin-left: auto;
          margin-right: auto;
        }

        /* smooth text refresh */
        .tree.isIn {
          opacity: 1;
          transform: translateY(0px);
          transition: opacity 240ms ease, transform 240ms ease;
        }
        .tree.isOut {
          opacity: 0.15;
          transform: translateY(4px);
          transition: opacity 240ms ease, transform 240ms ease;
        }

        .node {
          border-radius: 16px;
          padding: 10px 12px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(8px);
          box-shadow: 0 0 18px rgba(167, 139, 250, 0.10);
          text-align: center;
        }

        .nodeRoot {
          width: 240px;
          margin: 0 auto 14px auto;
        }

        .nodeText {
          font-size: 12px;
          line-height: 1.1;
          color: rgba(255, 255, 255, 0.88);
          white-space: nowrap;
        }

        .lvl2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          width: 520px;
          margin: 48px auto 0 auto;
        }

        .lvl3 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          width: 520px;
          margin: 58px auto 0 auto;
        }

        .wires {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
        }

        .wires12 {
          top: 52px; /* lines between root and lvl2 */
          width: 520px;
          height: 120px;
        }

        .wires23 {
          top: 170px; /* lines between lvl2 and lvl3 */
          width: 520px;
          height: 140px;
        }

        .treeHint {
          margin-top: 14px;
          text-align: center;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.45);
        }

        /* responsive */
        @media (max-width: 640px) {
          .tree {
            max-width: 100%;
          }
          .lvl2, .lvl3, .wires12, .wires23 {
            width: 100%;
          }
          .nodeText {
            white-space: normal;
          }
        }
      `}</style>
    </div>
  );
}

export default CatBoostTree;
