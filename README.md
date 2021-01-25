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
.hero h1 {
  text-transform: uppercase; 
  letter-spacing: 0.5em; 
  font-size: clamp(1em, 5vw, 4em); 
  animation: breath 10000ms ease-in-out infinite alternate; 
  text-align:center; text-indent: -1rem; 
  } 

h1 > .End { 
  letter-spacing: 0;
  }

@keyframes breath { 
  0% { transform: scale(1); } 
  100% { transform: scale(1.1); } 
  } 

canvas { 
  position: absolute; 
  top: 0; 
  left: 0; 
  margin: 0; 
  padding: 0; 
  /* background-color: hsla(240deg, 20%, 20%, 1); */
  background-color: hsla(0deg, 0%, 9.41%, 1);
  }
</style>