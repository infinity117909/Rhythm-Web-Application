import { useEffect, useState } from 'react'
import { Link, Outlet } from '@tanstack/react-router'

export const HomeNavbar = () => {
   return (
      <>
         <nav className="">
            <svg
               viewBox="0 0 300 300"
               className="w-full mx-auto cursor-pointer select-none h-screen"
            >

            {/* --- EDUCATION --- */ }
            <Link to="/education">
               <g className="group">
                  <path
                     d="M150,150 L150,50 A100,100 0 0,1 236.6,200 Z"
                     fill="#5D866C"
                     stroke="black"
                     className="transition-all duration-300 group-hover:opacity-80 group-hover:scale-[1.005]"
                  />
                  <text
                     x="190"
                     y="120"
                     textAnchor="middle"
                     dominantBaseline="middle"
                     className="pointer-events-none fill-black font-semibold text-[14px]"
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
                     fill="#7fbfff"
                     stroke="black"
                     className="transition-all duration-300 group-hover:opacity-80 group-hover:scale-[1.02]"
                  />
                  <text
                     x="150"
                     y="220"
                     textAnchor="middle"
                     dominantBaseline="middle"
                     className="pointer-events-none fill-black font-semibold text-[14px]"
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
                     fill="red"
                     stroke="black"
                     className="transition-all duration-300 group-hover:opacity-80 group-hover:scale-[1.02]"
                  />
                  <text
                     x="110"
                     y="120"
                     textAnchor="middle"
                     dominantBaseline="middle"
                     className="pointer-events-none fill-black font-semibold text-[14px]"
                  >
                     Games
                  </text>
               </g>
            </Link>

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
               ${opacity < 1 ? "bg-jungle-teal-600/80 backdrop-blur-xl" : "bg-jungle-teal-600"}
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
               p-4 sticky top-0 z-50 shadow-md transition-all duration-300
               ${opacity < 1 ? "bg-blue-100/80 backdrop-blur-xl " : "bg-blue-100 "}
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
               p-4 sticky top-0 z-50 shadow-md transition-all duration-300
               ${opacity < 1 ? "bg-red-100/80 backdrop-blur-xl " : "bg-red-100   "}
            `}
         >
            <ul className="nav-list">
               <li><Link to="/games" className="nav-link">Games Home</Link></li>
               <li><Link to="/games/drum-machine" className="nav-link">Drum Machine</Link></li>
               <li><Link to="/games/And I Will Always Love You" className="nav-link">And I Will Always Love You!!!!</Link></li>
               <li className=" ml-auto"><Link to="/" className="nav-link">Home</Link></li>
            </ul>
         </nav>

         <Outlet />
      </>
   );
};
