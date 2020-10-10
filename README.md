---
sidebar: false
home: true
heroText:
  - "test2"
  - "test1"
tagline: "test"
# heroImage: /hero.png
# heroImageStyle: {
#   maxWidth: '600px',
#   width: '100%',
#   display: block,
#   margin: '9rem auto 2rem',
#   background: '#fff',
#   borderRadius: '1rem',
# }
bgImageStyle: { height: "450px" }
---

<style>
/* * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    font-family: "Roboto";
    font-weight: 100;
  } */
  
  /* body {
    font-size: 18px;
    color: hsla(210deg, 100%, 100%, 1);
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  } */
  
 .hero h1 {
    text-transform: uppercase;
    letter-spacing: 1.5em;
    font-size: clamp(1em, 5vw, 4em);
    animation: breath 10000ms ease-in-out infinite alternate;
  }
 h1 > .last {
    letter-spacing: 0;
    z-index:100;
  }
  
  @keyframes breath {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(1.1);
    }
  }
  
  canvas {
    position: absolute;
    top: 0;
    left: 0;
    margin: 0;
    padding: 0;
    background-color: hsla(240deg, 20%, 20%, 1);

  }
  
</style>
