import { Link } from 'gatsby';
import React, { useEffect } from 'react';
import {
  FaWordpress as Wordpress,
  FaCss3Alt as Css,
  FaReact as Reactjs,
  FaNode as Node,
  FaShopify as Shopify,
} from 'react-icons/fa';
import {
  SiJavascript as Javascript,
  SiGatsby as Gatsby,
  SiGraphql as Graphql,
} from 'react-icons/si';

import Aos from 'aos/dist/aos.cjs';
import { ExperienceDiv } from '../styles/ExperienceDiv';
import { SkillsGrid } from '../styles/SkillsGrid';
import Hero from '../components/HeroTitle';
import 'aos/dist/aos.css';

function Experience() {
  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);
  return (
    <div>
      <Hero />
      <ExperienceDiv>
        <div>
          <h3>Experience</h3>
          <h1>08 years</h1>
          <h2>Fullstack Developer</h2>
          <p>
            Currently working as a Fullstack - Shopify Developer  {' '}
            <span>
              <Link to="https://petstable.mx/">Pet's Table 🐶 </Link>
            </span>
          </p>
        </div>
        <div>
          <div data-aos="fade-up" data-aos-delay="800">
            My Skills
          </div>
          <SkillsGrid>
            <li data-aos="fade-right" data-aos-delay="1000">
              <Shopify />
            </li>
            <li data-aos="fade-up" data-aos-delay="1200">
              <Wordpress />
            </li>
            <li data-aos="fade-up" data-aos-delay="1400">
              <Css />
            </li>
            <li data-aos="fade-up" data-aos-delay="1600">
              <Javascript />
            </li>
            <li data-aos="fade-up" data-aos-delay="1800">
              <Reactjs />
            </li>
            <li data-aos="fade-up" data-aos-delay="2000">
              <Node />
            </li>
            <li data-aos="fade-up" data-aos-delay="2200">
              <Gatsby />
            </li>
            <li data-aos="fade-left" data-aos-delay="2400">
              <Graphql />
            </li>
          </SkillsGrid>
          <div className="BtnProject">
            <Link to="/projects">View my Projects</Link>
          </div>
        </div>
      </ExperienceDiv>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <div>
        <Experience />
      </div>
    </>
  );
}
