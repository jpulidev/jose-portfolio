import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { SiGmail as Mail, SiWhatsapp as Whatsapp } from 'react-icons/si';

const NavStyles = styled.nav`
  margin-bottom: 3rem;
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 1.5%;
  ul {
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: 2fr 200px 200px;
    list-style: none;
    text-align: left;
    align-items: center;
    height: 100px;
    grid-gap: 2em;
  }
  li {
    order: 1;
  }
  a {
    font-size: 3rem;
    color: var(--black);
    text-decoration: none;
    background: var(--yellow);
    padding: 0px 10px;

    &:hover {
      color: var(--yellow);
      background: var(--black);
    }
  }
  @media screen and (max-width: 1000px) {
    ul {
      grid-template-columns: auto auto auto;
      grid-gap: 15px;
    }
  }
`;
const FloatSocials = styled.div`
  position: absolute;
  right: 51px;
  font-size: 2em;
  line-height: 1;
  margin-top: 28px;
  z-index: 1;
  a {
    font-size: 15px;
  }
  @media screen and (max-width: 1000px) {
    font-size: 1.4em;
    text-align: right;
    right: 15px;
  }
`;

export default function Nav() {
  return (
    <NavStyles>
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
        <li>
          <FloatSocials>
            <div>
              <Link to="https://www.instagram.com/jpulidev/">Instagram</Link>
            </div>
            <div>
              <Link to="https://github.com/jpulidev">Github</Link>
            </div>
            <div>
              <Link to="https://www.linkedin.com/in/joseclementepulido/">
                Linkedin
              </Link>
            </div>
            <div>
              <Link to="https://api.whatsapp.com/send?phone=584244047212&text=I%20want%20to%20work%20with%20you!">
                <Whatsapp />
              </Link>
            </div>
            <div>
              <Link href="mailto:josecpulidoo@gmail.com">
                <Mail />
              </Link>
            </div>
          </FloatSocials>
        </li>
      </ul>
    </NavStyles>
  );
}
