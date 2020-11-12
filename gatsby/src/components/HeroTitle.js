import { Link } from 'gatsby';
import React from 'react';
import AOS from 'aos';
import { FirstTitle } from '../styles/FistTitle';
import { TwoGridSection } from '../styles/TwoGridSection';
import SEO from './SEO';
import homeimage from '../assets/images/josepulido.jpg';

export default function Hero() {
  return (
    <div>
      <SEO>
        <title>Welcome 🥑</title>
      </SEO>
      <TwoGridSection>
        <img src={homeimage} alt="Jose Pulido" />
        <FirstTitle data-aos="fade-in">
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
AOS.init({
  delay: 0, // values from 0 to 3000, with step 50ms
  duration: 1000, // values from 0 to 3000, with step 50ms
  easing: 'ease', // default easing for AOS animations
  once: false, // whether animation should happen only once - while scrolling down
  mirror: false, // whether elements should animate out while scrolling past them
});
