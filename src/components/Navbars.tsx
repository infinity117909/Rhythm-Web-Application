import { useEffect, useState } from 'react'
import { Link, Outlet } from '@tanstack/react-router'

export const HomeNavbar = () => {
   return (
      <>
         <nav className="flex items-center justify-center min-h-screen bg-gray-950">
            <svg
               viewBox="0 0 300 300"
               className="w-[min(90vw,90vh)] mx-auto cursor-pointer select-none drop-shadow-2xl"
            >
            {/* --- EDUCATION --- */ }
            <Link to="/education">
               <g className="group">
                  <path
                     d="M150,150 L150,50 A100,100 0 0,1 236.6,200 Z"
                     className="fill-deep-teal-600 stroke-white stroke-[0.5] transition-all duration-300 group-hover:opacity-85 group-hover:brightness-110"
                  />
                  <text
                     x="206"
                     y="118"
                     textAnchor="middle"
                     dominantBaseline="middle"
                     transform="rotate(60, 206, 118)"
                     className="pointer-events-none fill-white font-semibold text-[12px] drop-shadow"
                  >
                     Education
                  </text>
               </g>
            </Link>

            {/* --- VISUALIZATION --- */ }
            <Link to="/visualization">
               <g className="group">
                  <path
                     d="M150,150 L236.6,200 A100,100 0 0,1 63.4,200 Z"
                     className="fill-blue-slate-600 stroke-white stroke-[0.5] transition-all duration-300 group-hover:opacity-85 group-hover:brightness-110"
                  />
                  <text
                     x="150"
                     y="216"
                     textAnchor="middle"
                     dominantBaseline="middle"
                     className="pointer-events-none fill-white font-semibold text-[11px] drop-shadow"
                  >
                     Visualization
                  </text>
               </g>
            </Link>

            {/* --- GAMES --- */ }
            <Link to="/games">
               <g className="group">
                  <path
                     d="M150,150 L63.4,200 A100,100 0 0,1 150,50 Z"
                     className="fill-dusty-grape-600 stroke-white stroke-[0.5] transition-all duration-300 group-hover:opacity-85 group-hover:brightness-110"
                  />
                  <text
                     x="94"
                     y="118"
                     textAnchor="middle"
                     dominantBaseline="middle"
                     transform="rotate(-60, 94, 118)"
                     className="pointer-events-none fill-white font-semibold text-[12px] drop-shadow"
                  >
                     Games
                  </text>
               </g>
            </Link>

            {/* Center circle — rendered last so it sits on top */}
            <circle cx="150" cy="150" r="32" className="fill-gray-950 cursor-default" />
            <text
               x="150"
               y="150"
               textAnchor="middle"
               dominantBaseline="middle"
               className="pointer-events-none fill-white font-semibold text-[9px] tracking-widest uppercase"
            >
               Rhythm
            </text>

            </svg>
         </nav>
      <Outlet/>
      </>
   )
};

export const EducationNavbar = () => {
   const [opacity, setOpacity] = useState(1);

   useEffect(() => {
      const handleScroll = () => {
      const y = window.scrollY;

      // clamp scroll between 0 and 300
      const max = 300;
      const clamped = Math.min(y, max);

      // map 0 → 1 and 300 → 0.2 (adjust as needed)
      const newOpacity = 1 - clamped / max * 0.25;
      console.log(clamped);

      setOpacity(newOpacity);
   };

   window.addEventListener("scroll", handleScroll);
   return () => window.removeEventListener("scroll", handleScroll);
   }, []);

   return (
      <>
         <nav
            style={{ opacity }}
            className={`
               p-4 sticky top-0 z-50 shadow-md transition-all duration-300
               ${opacity < 1 ? "bg-deep-teal-600/80 backdrop-blur-xl" : "bg-deep-teal-600"}
               text-porcelain-50
            `}
         >


            <ul className="nav-list">
               <li><Link to="/education" className="nav-link">Education Home</Link></li>
               <li><Link to="/education/theory/Introduction" className="nav-link">Introduction</Link></li>
               <li><Link to="/education/genres" className="nav-link">Genres</Link></li>
               <li className="ml-auto"><Link to="/" className="nav-link">Home</Link></li>
            </ul>
         </nav>

         <Outlet/>
      </>
   )

};

export const VisualizationNavbar = () => {
   const [opacity, setOpacity] = useState(1);

   useEffect(() => {
      const handleScroll = () => {
         const y = window.scrollY;
         const max = 300;
         const clamped = Math.min(y, max);

         // fade to 75% opacity
         const newOpacity = 1 - (clamped / max) * 0.25;
         setOpacity(newOpacity);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
   }, []);

   return (
      <>
         <nav
            style={{ opacity }}
            className={`
               p-4 sticky top-0 z-50 shadow-md transition-all duration-300 text-white
               ${opacity < 1 ? "bg-blue-slate-600/80 backdrop-blur-xl " : "bg-blue-slate-600 "}
            `}
         >
            <ul className="nav-list">
               <li><Link to="/visualization" className="nav-link">Visualization Home</Link></li>
               <li><Link to="/visualization/osmd-parser" className="nav-link">Rhythms</Link></li>
               <li><Link to="/visualization/metronome" className="nav-link">Metronome</Link></li>
               <li><Link to="/visualization/DVD-Polyrhythm-Visualizer/DvdPolyrhythmVisualizer" className="nav-link">DVD Polyrhythms</Link></li>
               <li className="ml-auto"><Link to="/" className="nav-link">Home</Link></li>
            </ul>
         </nav>

         <Outlet />
      </>
   );
};


export const GameNavbar = () => {
   const [opacity, setOpacity] = useState(1);

   useEffect(() => {
      const handleScroll = () => {
         const y = window.scrollY;
         const max = 300;
         const clamped = Math.min(y, max);

         // fade to 75% opacity
         const newOpacity = 1 - (clamped / max) * 0.25;
         setOpacity(newOpacity);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
   }, []);

   return (
      <>
         <nav
            style={{ opacity }}
            className={`
               p-4 sticky top-0 z-50 shadow-md transition-all duration-300 text-white
               ${opacity < 1 ? "bg-dusty-grape-600/80 backdrop-blur-xl " : "bg-dusty-grape-600 "}  "}
            `}
         >
            <ul className="nav-list">
               <li><Link to="/games" className="nav-link">Games Home</Link></li>
               <li><Link to="/games/drum-machine" className="nav-link">Drum Machine</Link></li>
               <li><Link to="/games/And I Will Always Love You" className="nav-link">And I Will Always Love You!!!!</Link></li>
               <li className="ml-auto"><Link to="/">Home</Link></li>
            </ul>
         </nav>

         <Outlet />
      </>
   );
};
