/*

In the future:

- Create a way to mute one of the two polyrhythms
- Stylize better

*/

import React, { useEffect, useRef, useState } from "react";
import * as Tone from "tone";

//let isLogged = false;
//if (isLogged == false) {
//   console.log(p);
//   isLogged = true;
//}

export function useMetronome() {
   const accentSynthRef = useRef<Tone.MembraneSynth | null>(null);
   const beatSynthRef = useRef<Tone.MembraneSynth | null>(null);
   const [ready, setReady] = useState(false);

   useEffect(() => {
      accentSynthRef.current = new Tone.MembraneSynth({
         pitchDecay: 0.08,
         octaves: 4,
         envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.1 },
      }).toDestination();

      beatSynthRef.current = new Tone.MembraneSynth({
         pitchDecay: 0.05,
         octaves: 2,
         envelope: { attack: 0.001, decay: 0.16, sustain: 0, release: 0.05 },
      }).toDestination();

      setReady(true);

      return () => {
         accentSynthRef.current?.dispose();
         beatSynthRef.current?.dispose();
      };
   }, []);

   function tick(accent: boolean) {
      if (!ready || !accentSynthRef.current || !beatSynthRef.current) {
         console.warn("Metronome not ready yet");
         return;
      }

      if (accent) {
         accentSynthRef.current.triggerAttackRelease("C2", "16n");
      } else {
         beatSynthRef.current.triggerAttackRelease("G2", "16n");
      }
   }

   return { tick, ready };
}


type PieceProps = {
   width: number;
   height: number;
   backgroundColor: string;
   borderColor: string;
   borderWidth: number;
   borderRadius: string;
};

export const PolyrhythmCanvas: React.FC = () => {
   const { tick, ready } = useMetronome();
   const canvasRef = useRef<HTMLCanvasElement>(null);

   const [xpoly, setXpoly] = useState(2);
   const [ypoly, setYpoly] = useState(3);
   const [bpm, setBpm] = useState(60);
   const [xBPM, setXBPM] = useState(0);
   const [yBPM, setYBPM] = useState(0);
   const [speed, setSpeed] = useState(100);
   const [showGrid, setShowGrid] = useState(true);
   const [showTrace, setShowTrace] = useState(true);

   const animationRef = useRef<any>(null);
   const rafRef = useRef<number | null>(null);
   const lastPositionsRef = useRef<any[]>([]);
   const durationRef = useRef(0);
   const animationStartRef = useRef(0);
   const pausedOffsetRef = useRef(0);
   const lastTickRef = useRef<number | null>(null);

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
      const canvas = canvasRef.current;
      if (!canvas || canvas.width === 0) return [];

      const pw = pieceProps.width;
      const ph = pieceProps.height;
      const maxXpx = canvas.width - pw;
      const maxYpx = canvas.height - ph;

      function mapGridToRotated(gx: number, gy: number) {
         const xpx = xp === 0 ? 0 : maxXpx * (gx / xp);
         const ypx = yp === 0 ? 0 : maxYpx * (gy / yp);
         const scale = maxYpx / maxXpx;
         return {
            xpx,
            ypx,
            rx: ypx,
            ry: maxYpx - xpx * scale,
         };
      }

      let gx = 0, gy = 0, dx = 1, dy = 1;
      const seen = new Set<string>();
      const positions: any[] = [];
      const limit = Math.max(1000, (xp + 1) * (yp + 1) * 4);

      for (let step = 0; step < limit; step++) {
         const key = `${gx},${gy},${dx},${dy}`;
         if (seen.has(key)) break;
         seen.add(key);

         positions.push(mapGridToRotated(gx, gy));

         if (gx + dx > xp || gx + dx < 0) dx = -dx;
         if (gy + dy > yp || gy + dy < 0) dy = -dy;

         gx += dx;
         gy += dy;
      }

      return positions;
   }

   // -----------------------------
   // Draw static layer
   // -----------------------------
   function drawStaticLayer(xp: number, yp: number, positions: any[]) {
      const canvas = canvasRef.current;
      if (!canvas || canvas.width === 0) return;

      const ctx = canvas.getContext("2d")!;
      const pw = pieceProps.width;
      const ph = pieceProps.height;
      const maxXpx = canvas.width - pw;
      const maxYpx = canvas.height - ph;

      function mapGridToRotated(gx: number, gy: number) {
         const xpx = xp === 0 ? 0 : maxXpx * (gx / xp);
         const ypx = yp === 0 ? 0 : maxYpx * (gy / yp);
         const scale = maxYpx / maxXpx;
         return {
            rx: ypx,
            ry: maxYpx - xpx * scale,
         };
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
   // Draw playhead
   // -----------------------------
   function drawPlayhead(rx: number, ry: number) {
      const canvas = canvasRef.current;
      if (!canvas) return;

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
      ctx.stroke();
      ctx.restore();
   }

   // -----------------------------
   // Start animation
   // -----------------------------
   function startAnimation(xp: number, yp: number) {
      const positions = generateKeyframes(xp, yp);
      if (!positions.length) return;

      lastPositionsRef.current = positions;

      const speedMult = speed * 0.01;
      const msPerBeat = (60000 / Math.max(1, bpm)) * 2;

      setXBPM(Math.floor(bpm * xpoly));
      setYBPM(Math.floor(bpm * ypoly));

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
         const canvas = canvasRef.current;
         if (!canvas || canvas.width === 0) return;

         const ctx = canvas.getContext("2d")!;
         ctx.clearRect(0, 0, canvas.width, canvas.height);

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

            if (ready && lastTickRef.current !== a) {
               lastTickRef.current = a;

               if (a % ypoly === 0) tick(false);
               if (a % xpoly === 0) tick(true);
            }

            drawPlayhead(x, y);
         }

         rafRef.current = requestAnimationFrame(loop);
      };

      rafRef.current = requestAnimationFrame(loop);
   }
   
   useEffect(() => {
      if (!ready) return;
      startAnimation(xpoly, ypoly);
   }, [ready, xpoly, ypoly, bpm, speed]);

   // -----------------------------
   // Render
   // -----------------------------
   return (
      <div className="w-full text-azure-mist-50">
         <div className="mx-auto w-full max-w-[44rem]">
            <button
               className="mb-3 rounded-lg border border-pale-sky-300 px-3 py-1.5 text-sm font-semibold bg-blue-slate-600 text-azure-mist-50 hover:bg-pale-sky-300 hover:text-shadow-grey-900 transition-colors"
               onClick={ async () => {
                  await Tone.start();
                  startAnimation(xpoly, ypoly);
               } }
            >
               Start
            </button>

            <canvas
               ref={ canvasRef }
               width={ 500 }
               height={ 500 }
               className="mx-auto block w-full rounded-xl border-2 border-pale-sky-300 bg-azure-mist-50 shadow"
            />

            {/* Controls */ }
            <div className="mt-4 w-full rounded-xl border border-blue-slate-600 bg-pale-sky-300/25 p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
               <label className="text-sm font-semibold text-pale-sky-300">
                  BPM
                  <input
                     type="range"
                     min={ 10 }
                     max={ 100 }
                     value={ bpm }
                     onChange={ (e) => setBpm(Number(e.target.value)) }
                     className="mt-2 w-full accent-blue-slate-600"
                  />
                  <span className="ml-2 text-azure-mist-50">{ bpm } BPM</span>
               </label>

               <label className="text-sm font-semibold text-pale-sky-300">
                  Speed
                  <input
                     type="range"
                     min={ 1 }
                     max={ 1000 }
                     value={ speed }
                     onChange={ (e) => setSpeed(Number(e.target.value)) }
                     className="mt-2 w-full accent-blue-slate-600"
                  />
                  <span className="ml-2 text-azure-mist-50">{ speed }%</span>
               </label>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4">
               <button
                  className="rounded-lg border border-pale-sky-300 px-3 py-1.5 text-sm font-semibold bg-blue-slate-600 text-azure-mist-50 hover:bg-pale-sky-300 hover:text-shadow-grey-900 transition-colors"
                  onClick={ () => startAnimation(xpoly, ypoly) }
               >
                  Update
               </button>

               <label className="inline-flex items-center gap-2 text-sm text-azure-mist-50">
                  <input
                     type="checkbox"
                     checked={ showGrid }
                     onChange={ (e) => setShowGrid(e.target.checked) }
                     className="accent-blue-slate-600"
                  />
                  Show Grid
               </label>

               <label className="inline-flex items-center gap-2 text-sm text-azure-mist-50">
                  <input
                     type="checkbox"
                     checked={ showTrace }
                     onChange={ (e) => setShowTrace(e.target.checked) }
                     className="accent-blue-slate-600"
                  />
                  Show Trace
               </label>

               <button
                  className="rounded-lg border border-pale-sky-300 px-3 py-1.5 text-sm font-semibold bg-shadow-grey-900 text-azure-mist-50 hover:bg-pale-sky-300 hover:text-shadow-grey-900 transition-colors"
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

            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
               <div className="rounded-lg border border-pale-sky-300 bg-shadow-grey-900/80 p-3">
                  <label className="text-sm font-semibold text-pale-sky-300">
                     X Poly
                     <input
                        type="number"
                        value={ xpoly }
                        onChange={ (e) => setXpoly(Number(e.target.value)) }
                        className="ml-2 w-20 rounded border border-pale-sky-300 bg-azure-mist-50 px-2 py-1 text-shadow-grey-900"
                     />
                  </label>
                  <div className="mt-1 text-sm text-azure-mist-50">X Poly BPM: { xBPM }</div>
               </div>

               <div className="rounded-lg border border-pale-sky-300 bg-shadow-grey-900/80 p-3">
                  <label className="text-sm font-semibold text-pale-sky-300">
                     Y Poly
                     <input
                        type="number"
                        value={ ypoly }
                        onChange={ (e) => setYpoly(Number(e.target.value)) }
                        className="ml-2 w-20 rounded border border-pale-sky-300 bg-azure-mist-50 px-2 py-1 text-shadow-grey-900"
                     />
                  </label>
                  <div className="mt-1 text-sm text-azure-mist-50">Y Poly BPM: { yBPM }</div>
               </div>
            </div>
            </div>
         </div>
      </div>
   );
};

