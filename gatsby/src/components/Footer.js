import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { FiInstagram as Instagram } from 'react-icons/fi';
import { FaLinkedin as Linkedin, FaGithub as Github } from 'react-icons/fa';
import { SiGatsby as Gatsby } from 'react-icons/si';
import { CgFigma as Figma } from 'react-icons/cg';

const FooterStyles = styled.footer`
  background: var(--black);
  color: var(--white);
  height: 350px;
  margin-top: -18px;
  p {
    text-align: center;
  }
  a {
    color: #fff;
    text-align: center;
    font-size: 16px;
  }
`;
const FooterGridStyle = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding-top: 5%;
  div,
  ul,
  li,
  a {
    color: #fff;
    list-style: none;
    padding: 5px;
  }
  @media screen and (max-width: 1000px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;
const FlexSociales = styled.div`
  display: flex;
  gap: 50px;
  a {
    font-size: 1.6em;
  }
  @media screen and (max-width: 1000px) {
    justify-content: center;
  }
`;

export default function Footer() {
  return (
    <FooterStyles>
      <FooterGridStyle>
        <div>
          <FlexSociales>
            <li>
              <Link to="https://www.instagram.com/jpulidev/">
                <Instagram />
              </Link>
            </li>
            <li>
              <Link to="https://www.linkedin.com/in/joseclementepulido/">
                <Linkedin />
              </Link>
            </li>
            <li>
              <Link to="https://github.com/jpulidev">
                <Github />
              </Link>
            </li>
          </FlexSociales>
        </div>
        <div>
          <ul>
            <li>
              <Link to="/">JP</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/projects">Projects</Link>
            </li>
          </ul>
        </div>
      </FooterGridStyle>
      <p>
        &copy; Jose Pulido Dev {new Date().getFullYear()}
        <br />
        <Link to="https://github.com/jpulidev">
          Designed with <Figma /> Built with <Gatsby /> Find code in
          <span>
            <Github />
          </span>
        </Link>
      </p>
    </FooterStyles>
  );
}
