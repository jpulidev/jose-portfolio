import { Link } from 'gatsby';
import React from 'react';
import styled from 'styled-components';
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

import SEO from '../components/SEO';
import { TwoGridSection } from '../styles/TwoGridSection';
import { ImageJose } from '../styles/ImageJose';
import { FirstTitle } from '../styles/FistTitle';
import { ExperienceDiv } from '../styles/ExperienceDiv';
import { SkillsGrid } from '../styles/SkillsGrid';

function Hero() {
  return (
    <div>
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
function Experience() {
  return (
    <div>
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
          <div>My Skills</div>
          <SkillsGrid>
            <li>
              <Shopify />
            </li>
            <li>
              <Wordpress />
            </li>
            <li>
              <Css />
            </li>
            <li>
              <Javascript />
            </li>
            <li>
              <Reactjs />
            </li>
            <li>
              <Node />
            </li>
            <li>
              <Gatsby />
            </li>
            <li>
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
    <div>
      <div>
        <Hero />
      </div>
      <div>
        <Experience />
      </div>
    </div>
  );
}
