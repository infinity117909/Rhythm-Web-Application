import { useEffect, useState } from 'react'
import { Link, Outlet } from '@tanstack/react-router'

const genreLinks = [
   { to: '/education/genres/jazz', label: 'Jazz' },
   { to: '/education/genres/afro-cuban', label: 'Afro Cuban' },
   { to: '/education/genres/hip-hop', label: 'Hip Hop' },
   { to: '/education/genres/metal', label: 'Metal' },
   { to: '/education/genres/classic-rock', label: 'Classic Rock' },
   { to: '/education/genres/punk-rock', label: 'Punk Rock' },
   { to: '/education/genres/prog', label: 'Prog' },
   { to: '/education/genres/pop', label: 'Pop' },
   { to: '/education/genres/edm', label: 'Electronic Dance Music' },
] as const

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

      setOpacity(newOpacity);
   };

   window.addEventListener("scroll", handleScroll);
   return () => window.removeEventListener("scroll", handleScroll);
   }, []);

   return (
      <>
         <nav
            style={{
               opacity,
               backgroundColor: "var(--education-nav-bg, var(--color-deep-teal-600))",
               color: "var(--education-nav-text, var(--color-porcelain-50))",
            }}
            className={`
               p-4 sticky top-0 z-50 shadow-md transition-all duration-300
               ${opacity < 1 ? "backdrop-blur-xl" : ""}
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
               <li><Link to="/games/whitney-houston-challenge" className="nav-link">The Whitney Houston Challenge</Link></li>
               <li className=" ml-auto"><Link to="/" className="nav-link">Home</Link></li>
            </ul>
         </nav>

         <Outlet />
      </>
   );
};

export function GenresSideNav() {
   return (
      <aside className="group fixed left-0 top-28 z-40 hidden lg:block">
         <div className="flex items-start">
            <button
               type="button"
               aria-label="Open genres navigation"
               style={{
                  backgroundColor: "var(--genres-side-button-bg, var(--color-deep-teal-600))",
                  color: "var(--genres-side-button-text, var(--color-porcelain-50))",
                  borderColor: "var(--genres-side-border, var(--color-deep-teal-500))",
               }}
               className="mt-3 flex h-12 w-12 items-center justify-center rounded-r-lg border-2 shadow-lg"
            >
               <span className="flex flex-col gap-1.5">
                  <span className="block h-0.5 w-5 bg-current" />
                  <span className="block h-0.5 w-5 bg-current" />
                  <span className="block h-0.5 w-5 bg-current" />
               </span>
            </button>

            <nav
               style={{
                  backgroundColor: "var(--genres-side-panel-bg, var(--color-porcelain-50))",
                  borderColor: "var(--genres-side-border, var(--color-deep-teal-500))",
               }}
               className="ml-2 w-0 overflow-hidden rounded-lg border-2 shadow-xl transition-all duration-300 ease-out group-hover:w-72 group-focus-within:w-72"
            >
               <div className="w-72 p-4">
                  <h3
                     style={{
                        color: "var(--genres-side-heading-text, var(--color-deep-teal-700))",
                        borderColor: "var(--genres-side-divider, var(--color-deep-teal-300))",
                     }}
                     className="mb-3 border-b pb-2 text-sm font-semibold uppercase tracking-[0.2em]"
                  >
                     Genres
                  </h3>
                  <ul className="space-y-1">
                     {genreLinks.map(({ to, label }) => (
                        <li key={to}>
                           <Link
                              to={to}
                              style={{
                                 color: "var(--genres-side-link-text, var(--color-deep-teal-800))",
                              }}
                              className="block rounded-md px-2 py-1.5 text-sm transition-colors duration-200 hover:bg-[var(--genres-side-link-hover-bg,var(--color-deep-teal-100))] hover:text-[var(--genres-side-link-hover-text,var(--color-deep-teal-900))]"
                           >
                              {label}
                           </Link>
                        </li>
                     ))}
                  </ul>
               </div>
            </nav>
         </div>
      </aside>
   )
}

export function GenresFooterNav() {
   return (
      <footer
         style={{
            backgroundColor: "var(--genres-footer-bg, var(--color-deep-teal-600))",
            color: "var(--genres-footer-text, var(--color-porcelain-50))",
            borderColor: "var(--genres-footer-border, var(--color-deep-teal-300))",
         }}
         className="mt-10 border-t-2 px-4 py-6"
      >
         <h2 className="text-center text-2xl">Genres to Explore</h2>
         <ul className="mx-auto mt-4 flex max-w-6xl flex-wrap justify-center gap-4 text-sm tracking-wide sm:text-base">
            {genreLinks.map(({ to, label }) => (
               <li key={to}>
                  <Link
                     to={to}
                     className="rounded-md px-2 py-1 transition-colors duration-200 hover:bg-[var(--genres-footer-link-hover-bg,var(--color-porcelain-50))] hover:text-[var(--genres-footer-link-hover-text,var(--color-deep-teal-700))]"
                  >
                     {label}
                  </Link>
               </li>
            ))}
         </ul>
      </footer>
   )
}
