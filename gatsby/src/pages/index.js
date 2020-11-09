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

import { ExperienceDiv } from '../styles/ExperienceDiv';
import { SkillsGrid } from '../styles/SkillsGrid';
import Hero from '../components/HeroTitle';

function Experience() {
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
    <>
      <div>
        <Experience />
      </div>
    </>
  );
}
