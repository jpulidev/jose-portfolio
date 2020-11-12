import { Link } from 'gatsby';
import React from 'react';
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
          <h1>05 years</h1>
          <h2>Working as a Fullstack Developer</h2>
          <p>
            Currently working as a Shopify Developer in{' '}
            <span>
              <Link to="https://www.genium.io/">Genium.io</Link>
            </span>
          </p>
        </div>
        <div>
          <div data-aos="fade-up" data-aos-delay="800">
            My Skills
          </div>
          <SkillsGrid>
            <li>
              <Shopify data-aos="fade-right" data-aos-delay="1000" />
            </li>
            <li>
              <Wordpress data-aos="fade-up" data-aos-delay="1200" />
            </li>
            <li>
              <Css data-aos="fade-up" data-aos-delay="1400" />
            </li>
            <li>
              <Javascript data-aos="fade-up" data-aos-delay="1600" />
            </li>
            <li>
              <Reactjs data-aos="fade-up" data-aos-delay="1800" />
            </li>
            <li>
              <Node data-aos="fade-up" data-aos-delay="2000" />
            </li>
            <li>
              <Gatsby data-aos="fade-up" data-aos-delay="2200" />
            </li>
            <li>
              <Graphql data-aos="fade-left" data-aos-delay="2400" />
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
