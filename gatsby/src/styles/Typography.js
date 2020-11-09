import { createGlobalStyle } from 'styled-components';

import font from '../assets/fonts/CutiveMono-Regular.ttf';

const Typography = createGlobalStyle`
  @font-face {
    font-family: 'Cutive Mono';
    src: url(${font});
  }
   html {
    font-family: 'Cutive Mono';
     color: var(--black);
  }
  p, li {
    letter-spacing: 0.5px;
  }
  h1,h2,h3,h4,h5,h6 {
    font-weight: normal;
    margin: 0;
  }
  a {
    color: var(--black);
    text-decoration-color: transparent;
    /* Chrome renders this weird with this font, so we turn it off */
    text-decoration-skip-ink: none;
    letter-spacing: 2px;
  }
  mark, .mark {
    background: var(--white);
    padding: 5px;
    margin: 0;
    display: inline;
    line-height: 1;
    color:var(--black);
    font-size:1.3em;
  }

  .center {
    text-align: center;
  }

  .tilt {
    transform: rotate(-2deg);
  }
`;

export default Typography;
