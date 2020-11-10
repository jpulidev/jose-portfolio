import { Link } from 'gatsby';
import React from 'react';
import { FirstTitle } from '../styles/FistTitle';
import { TwoGridSection } from '../styles/TwoGridSection';
import SEO from './SEO';
import homeimage from '../assets/images/josepulido.jpg';

export default function Hero() {
  return (
    <div>
      <SEO>
        <title>Welcome 🥑.</title>
        <meta property="og:image" content={homeimage} />
      </SEO>
      <TwoGridSection>
        <img src={homeimage} alt="Jose Pulido" />
        <FirstTitle>
          <h1>I'm Jose Pulido.</h1>
          <h1>Web/Shopify developer.</h1>
          <p>
            I build amazing tailor-made shopify stores. And i can make a really
            great Guacamole 🥑.
            <br /> If you have a design i can make it come to life.
          </p>
          <Link href="mailto:josecpulidoo@gmail.com">Let's work together</Link>
        </FirstTitle>
      </TwoGridSection>
    </div>
  );
}
