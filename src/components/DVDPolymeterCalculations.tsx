import { time } from "console";
import * as OSMD from 'opensheetmusicdisplay';
const { OpenSheetMusicDisplay } = OSMD;
import React, { useEffect, useRef, useState } from "react";
import './styles/DVDPolyrhythmCalculations.css'



type PieceProps = {
   width: number;
   height: number;
   backgroundColor: string;
   borderColor: string;
   borderWidth: number;
   borderRadius: string;
};

export const PolyrhythmCanvas: React.FC = () => {
   const canvasRef = useRef<HTMLCanvasElement>(null);

   const [xpoly, setXpoly] = useState(2);
   const [ypoly, setYpoly] = useState(3);
   const [bpm, setBpm] = useState(60);
   const [xBPM, setXBPM] = useState(0);
   const [yBPM, setYBPM] = useState(0);
   const [speed, setSpeed] = useState(100);
   //const [timeSignature, setTimeSignature] = useState(new OSMD.Fraction(4, 4));
   const [showGrid, setShowGrid] = useState(true);
   const [showTrace, setShowTrace] = useState(true);

   // Animation state
   const animationRef = useRef<any>(null);
   const rafRef = useRef<number | null>(null);
   const lastPositionsRef = useRef<any[]>([]);
   const durationRef = useRef(0);
   const animationStartRef = useRef(0);
   const pausedOffsetRef = useRef(0);

   const pieceProps: PieceProps = {
      width: 15,
      height: 15,
      backgroundColor: "white",
      borderColor: "black",
      borderWidth: 1,
      borderRadius: "100%",
   };

   // -----------------------------
   // Keyframe generator
   // -----------------------------
   function generateKeyframes(xp: number, yp: number) {
      const canvas = canvasRef.current!;
      const pw = pieceProps.width;
      const ph = pieceProps.height;

      const maxXpx = canvas.width - pw;
      const maxYpx = canvas.height - ph;

      // 
      function mapGridToRotated(gx: number, gy: number) {
         const xpx = xp === 0 ? 0 : maxXpx * (gx / xp);
         const ypx = yp === 0 ? 0 : maxYpx * (gy / yp);
         const scale = maxXpx === 0 ? 1 : maxYpx / maxXpx;
         const rx = ypx;
         const ry = maxYpx - xpx * scale;
         return { xpx, ypx, rx, ry };
      }

      let gx = 0;
      let gy = 0;
      let dx = 1;
      let dy = 1;

      const seen = new Set<string>();
      const positions: any[] = [];

      const limit = Math.max(1000, (xp + 1) * (yp + 1) * 4);

      for (let step = 0; step < limit; step++) {
         const key = `${gx},${gy},${dx},${dy}`;
         if (seen.has(key)) break;
         seen.add(key);

         const p = mapGridToRotated(gx, gy);

         // Creates an array of keyframes for the animation
         positions.push(p);

         if (gx + dx > xp || gx + dx < 0) dx = -dx;
         if (gy + dy > yp || gy + dy < 0) dy = -dy;

         gx += dx;
         gy += dy;
      }

      return positions;
   }

   // -----------------------------
   // Draw grid + trace (static)
   // -----------------------------
   function drawStaticLayer(xp: number, yp: number, positions: any[]) {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!showGrid && !showTrace) return;

      const pw = pieceProps.width;
      const ph = pieceProps.height;
      const maxXpx = canvas.width - pw;
      const maxYpx = canvas.height - ph;

      function mapGridToRotated(gx: number, gy: number) {
         const xpx = xp === 0 ? 0 : maxXpx * (gx / xp);
         const ypx = yp === 0 ? 0 : maxYpx * (gy / yp);
         const scale = maxXpx === 0 ? 1 : maxYpx / maxXpx;
         const rx = ypx;
         const ry = maxYpx - xpx * scale;
         return { rx, ry };
      }

      ctx.save();

      if (showGrid) {
         ctx.strokeStyle = "#ddd";
         ctx.lineWidth = 1;

         for (let gx = 0; gx <= xp; gx++) {
            ctx.beginPath();
            for (let gy = 0; gy <= yp; gy++) {
               const p = mapGridToRotated(gx, gy);
               const x = p.rx + pw / 2;
               const y = p.ry + ph / 2;
               if (gy === 0) ctx.moveTo(x, y);
               else ctx.lineTo(x, y);
            }
            ctx.stroke();
         }

         for (let gy = 0; gy <= yp; gy++) {
            ctx.beginPath();
            for (let gx = 0; gx <= xp; gx++) {
               const p = mapGridToRotated(gx, gy);
               const x = p.rx + pw / 2;
               const y = p.ry + ph / 2;
               if (gx === 0) ctx.moveTo(x, y);
               else ctx.lineTo(x, y);
            }
            ctx.stroke();
         }
      }

      if (showTrace) {
         ctx.beginPath();
         ctx.strokeStyle = "rgba(0,128,255,0.9)";
         ctx.lineWidth = 2;

         positions.forEach((p, i) => {
            const x = p.rx + pw / 2;
            const y = p.ry + ph / 2;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
         });
         ctx.stroke();

         ctx.fillStyle = "rgba(0,128,255,0.9)";
         positions.forEach((p) => {
            const x = p.rx + pw / 2;
            const y = p.ry + ph / 2;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
         });
      }

      ctx.restore();
   }

   // -----------------------------
   // Draw playhead (dynamic)
   // -----------------------------
   function drawPlayhead(rx: number, ry: number) {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;
      const pw = pieceProps.width;
      const ph = pieceProps.height;

      const x = rx + pw / 2;
      const y = ry + ph / 2;

      ctx.save();
      ctx.fillStyle = pieceProps.backgroundColor;
      ctx.strokeStyle = pieceProps.borderColor;
      ctx.lineWidth = pieceProps.borderWidth;

      ctx.beginPath();
      ctx.arc(x, y, Math.max(pw, ph) / 2, 0, Math.PI * 2);
      ctx.fill();
      if (pieceProps.borderWidth > 0) ctx.stroke();
      ctx.restore();
   }

   // -----------------------------
   // Start animation
   // -----------------------------
   function startAnimation(xp: number, yp: number) {
      const positions = generateKeyframes(xp, yp);
      lastPositionsRef.current = positions;

      // A speed playback scrub from 1% speed to 1000% speed for the higher and lower polyrhythms.
      const speedMult = speed * 0.01;

      // Calculates the time of the whole measure (from downbeat to downbeat)
      const msPerBeat = 60000 / Math.max(1, bpm) * 2;

      setXBPM(Math.floor(bpm * xpoly));
      setYBPM(Math.floor(bpm * ypoly));

      // Every step is the value of the bpm
      const duration = Math.max(msPerBeat, 100) / speedMult;

      durationRef.current = duration;

      animationStartRef.current = performance.now();
      pausedOffsetRef.current = 0;

      animationRef.current = {
         playState: "running",
         play() {
            if (this.playState !== "running") {
               animationStartRef.current = performance.now() - pausedOffsetRef.current;
               this.playState = "running";
            }
         },
         pause() {
            if (this.playState === "running") {
               pausedOffsetRef.current = performance.now() - animationStartRef.current;
               this.playState = "paused";
            }
         },
         get currentTime() {
            return this.playState === "running"
               ? performance.now() - animationStartRef.current
               : pausedOffsetRef.current;
         },
      };

      drawStaticLayer(xp, yp, positions);
      startLoop();
   }

   // -----------------------------
   // Animation loop
   // -----------------------------
   function startLoop() {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      const loop = () => {
         const canvas = canvasRef.current!;
         const ctx = canvas.getContext("2d")!;

         // redraw static layer
         drawStaticLayer(xpoly, ypoly, lastPositionsRef.current);

         const anim = animationRef.current;
         const positions = lastPositionsRef.current;
         const duration = durationRef.current;

         if (anim && positions.length > 0 && duration > 0) {
            const t = anim.currentTime;
            const frac = (t % duration) / duration;
            const n = positions.length;

            let idx = frac * (n - 1);
            const a = Math.floor(idx);
            const b = Math.min(a + 1, n - 1);
            const localT = idx - a;

            const pA = positions[a];
            const pB = positions[b];

            const x = (1 - localT) * pA.rx + localT * pB.rx;
            const y = (1 - localT) * pA.ry + localT * pB.ry;

            drawPlayhead(x, y);
         }

         rafRef.current = requestAnimationFrame(loop);
      };

      rafRef.current = requestAnimationFrame(loop);
   }

   // -----------------------------
   // Initial mount
   // -----------------------------
   useEffect(() => {
      const canvas = canvasRef.current!;
      canvas.width = 500;
      canvas.height = 500;

      startAnimation(xpoly, ypoly);
   }, []);

   return (
      <div>
         <canvas ref={ canvasRef } style={ { border: "1px solid #ccc" } } />

         {/* Controls */ }
         <div style={ { margin: 20 } }>
            <div className="polyrhythm-data">
               <div>
                  <label>
                     X Poly:
                     <input className="poly-value"
                        type="number"
                        value={ xpoly }
                        onChange={ (e) => setXpoly(Number(e.target.value)) }
                     />
                  </label>
                  <label>
                     X Poly's BPM
                     <text>
                        : { xBPM }
                     </text>
                  </label>
               </div>
               <div>
                  <label>
                     Y Poly:
                     <input className="poly-value"
                        type="number"
                        value={ ypoly }
                        onChange={ (e) => setYpoly(Number(e.target.value)) }
                     />
                  </label>
                  <label>
                     Y Poly's BPM
                     <text>
                        : { yBPM }
                     </text>
                  </label>
               </div>
            </div>


            <label>
               BPM:
               <input
                  type="range"
                  min={ 1 }
                  max={ 100 }
                  value={ bpm }
                  onChange={ (e) => setBpm(Number(e.target.value)) }
               />
               { bpm } BPM
            </label>

            <label>
               Speed:
               <input
                  type="number"
                  min={ 1 }
                  max={ 1000 }
                  value={ speed }
                  onChange={ (e) => setSpeed(Number(e.target.value)) }
               />
               { speed }%
            </label>

            <button onClick={ () => startAnimation(xpoly, ypoly) }>Update</button>

            <label>
               <input
                  type="checkbox"
                  checked={ showGrid }
                  onChange={ (e) => setShowGrid(e.target.checked) }
               />
               Show Grid
            </label>

            <label>
               <input
                  type="checkbox"
                  checked={ showTrace }
                  onChange={ (e) => setShowTrace(e.target.checked) }
               />
               Show Trace
            </label>

            <button
               onClick={ () => {
                  if (!animationRef.current) return;
                  if (animationRef.current.playState === "running") {
                     animationRef.current.pause();
                  } else {
                     animationRef.current.play();
                  }
               } }
            >
               Play / Pause
            </button>
         </div>
      </div>
   );
};
