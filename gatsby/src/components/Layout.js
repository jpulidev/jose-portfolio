import React from 'react';
import styled from 'styled-components';
import Footer from './Footer';
import Nav from './Nav';
import 'normalize.css';
import GlobalStyles from '../styles/GlobalStyle';
import Typography from '../styles/Typography';

const ContentStyles = styled.div`
  padding: 0px;
`;

export default function Layout({ children }) {
  return (
    <>
      <GlobalStyles />
      <ContentStyles>
        <Typography />
        <Nav />
        {children}
        <Footer />
      </ContentStyles>
    </>
  );
}
