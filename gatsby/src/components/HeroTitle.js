import { Link } from 'gatsby';
import React from 'react';
import { FirstTitle } from '../styles/FistTitle';
import { ImageJose } from '../styles/ImageJose';
import { TwoGridSection } from '../styles/TwoGridSection';
import SEO from './SEO';

export default function Hero() {
  return (
    <div>
      <SEO>
        <title>Welcome to mi site 🥑.</title>
      </SEO>
      <TwoGridSection>
        <ImageJose />
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
