import { css } from '@emotion/react'


export const globalStyles = css`

  @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');


  body, input, p, button {
    font-family: 'Poppins', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6, p {
    margin: 0
  }

  /* width */
::-webkit-scrollbar {
  width: 10px;
  
}

/* Track */
::-webkit-scrollbar-track {
  background: #393b3a;
  border-top-right-radius: 24px;
  border-bottom-right-radius: 24px;

}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 24px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
  
  
  `
