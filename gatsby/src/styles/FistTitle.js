import styled from 'styled-components';

export const FirstTitle = styled.div`
  position: relative;
  left: -74px;
  top: -84px;
  h1 {
    font-size: 4em;
    line-height: 1;
  }
  p {
    max-width: 550px;
  }
  a {
    padding: 10px;
    background: #8491a0;
    color: #fff;
    position: relative;
    top: 14px;
  }
  a:hover {
    background: var(--yellow);
    color: var(--black);
  }
  @media screen and (max-width: 1000px) {
    left: 0px;
    top: 0px;
    padding: 5%;
    h1 {
      font-size: 2em;
    }
  }
`;
