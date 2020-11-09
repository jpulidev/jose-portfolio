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

import jose from '../assets/images/josepulido.jpg';
import SEO from '../components/SEO';

const TwoGridSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: center;
  align-items: center;
  height: 700px;
  @media screen and (max-width: 1000px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
`;
const ImageJose = styled.div`
  background-image: url(${jose});
  background-repeat: no-repeat;
  height: 100%;
  background-size: contain;
  background-position: right;
  @media screen and (max-width: 1000px) {
    background-size: cover;
  }
`;
const FirstTitle = styled.div`
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
    text-align: center;
    h1 {
      font-size: 3em;
      line-height: 1;
    }
  }
`;
const ExperienceDiv = styled.div`
  padding: 7% 0%;
  background: #fcf2d4;
  margin-top: 5%;
  div {
    max-width: 1056px;
    margin: 0 auto;
  }
  h3 {
    color: lightgray;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: 900;
  }
  h1 {
    font-size: 7em;
    color: #8491a0;
  }
  p {
    max-width: 400px;
  }
  .BtnProject {
    text-align: center;
  }
  .BtnProject > a {
    padding: 9px 16px;
    background: var(--yellow);
  }
  @media screen and (max-width: 1000px) {
    padding: 7% 3%;
    h1 {
      font-size: 4em;
    }
  }
`;
const SkillsGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(8, auto);
  gap: 5%;
  list-style: none;
  justify-content: center;
  align-items: center;
  font-size: 3em;
  li {
    color: #8491a0;
  }
  @media screen and (max-width: 1000px) {
    grid-template-columns: repeat(4, auto);
    margin-left: -50px;
  }
`;

export default function HomePage() {
  return (
    <>
      <SEO>
        <title>Welcome 🥑</title>
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
    </>
  );
}
