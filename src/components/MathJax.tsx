import { MathJaxContext, MathJax } from "better-react-mathjax";

const config = {
   // Your MathJax configuration (e.g., TeX delimiters)
   tex: {
      inlineMath: [["$", "$"], ["\\(", "\\)"]],
      displayMath: [["$$", "$$"], ["\\[", "\\]"]],
   }
};

export default function MathComponent({ formula }) {
   return (
      <MathJaxContext config={ config }>
         {/* Renders an inline formula */ }
         {/*<p>*/}
         {/*   The quadratic formula is $\text{ x } = \frac{ -b \pm \sqrt{ b ^ 2 - 4ac}}{ 2a}$.*/}
         {/*</p>*/}

         {/* Renders a dynamic formula from props */ }
         <MathJax>{ `\\int ${formula} \\text{ d}x` }</MathJax>
      </MathJaxContext>
   );
}