import { Link } from 'gatsby';
import React, { useEffect } from 'react';
import Aos from 'aos/dist/aos.cjs';
import { FirstTitle } from '../styles/FistTitle';
import { TwoGridSection } from '../styles/TwoGridSection';
import SEO from './SEO';
import homeimage from '../assets/images/josepulido.jpg';
import 'aos/dist/aos.css';

export default function Hero() {
  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);
  return (
    <div>
      <SEO>
        <title>Welcome 🥑</title>
      </SEO>
      <TwoGridSection>
        <img src={homeimage} alt="Jose Pulido" />
        <FirstTitle data-aos="fade-up" data-aos-delay="50">
          <h1>I'm Jose Pulido.</h1>
          <h1>Web/Shopify developer.</h1>
          <p>
          I specialize in creating tailor-made Shopify stores that perfectly match your vision. Whether you have a design in mind or need help bringing your ideas to life,
          <br></br> 
          I’m here to make it happen—oh, and I make a pretty mean guacamole, too! 🥑 Let’s build something amazing together.
          </p>
          <Link href="mailto:josecpulidoo@gmail.com">Let's work together</Link>
        </FirstTitle>
      </TwoGridSection>
    </div>
  );
}
