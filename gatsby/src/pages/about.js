import { graphql, Link } from 'gatsby';
import React from 'react';
import Img from 'gatsby-image';
import styled from 'styled-components';
import rectangle from '../assets/images/Rectangle.jpg';
import SEO from '../components/SEO';
import { yearsOfExperience } from '../config/career';

const StaffGrid = styled.div`
  display: grid;
  grid-gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  padding-bottom: 5%;
`;

const StaffStyles = styled.div`
  a {
    text-decoration: none;
  }
  .gatsby-image-wrapper {
    height: 500px;
  }
  h2 {
    transform: rotate(-2deg);
    text-align: center;
    font-size: 4rem;
    margin-bottom: -2rem;
    position: relative;
    z-index: 2;
  }
  .description {
    background: var(--yellow);
    padding: 1rem;
    margin: 2rem;
    margin-top: -6rem;
    z-index: 2;
    position: relative;
    transform: rotate(1deg);
    text-align: center;
  }
`;
const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: center;
  align-items: center;
  height: 600px;

  @media (min-width: 1500px) and (max-width: 2560px) {
    padding-bottom: 10%;
  }
  @media screen and (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;
const Story = styled.div`
  padding: 5%;
  @media (min-width: 1500px) and (max-width: 2560px) {
    margin-left: 30%;
  }
  h1 {
    font-size: 4em;
    padding-bottom: 40px;
  }
`;

export default function AboutPage({ data, location }) {
  const staff = data.staff.nodes;

  return (
    <>
      <SEO
        title="About"
        description="How a litigation lawyer from Venezuela became a fullstack developer — the short version of Jose Pulido's story."
        pathname={location && location.pathname}
      />
      <InfoGrid>
        <Story>
          <h1>My Story</h1>
          <p>
            Hi, I'm Jose Pulido, a fullstack developer from 🇻🇪. I've been
            building for the web for {yearsOfExperience()} years. Before that I
            made a living as a litigation lawyer ☠️ — I left it behind when my
            wife introduced me to this coding adventure, and I haven't stopped
            learning a day since.
          </p>
        </Story>
        <div>
          <img src={rectangle} alt="imageabout" />
        </div>
      </InfoGrid>
      <StaffGrid>
        {staff.map((person) => (
          <StaffStyles key={person.id}>
            <h2>
              <span className="mark">{person.name}</span>
            </h2>
            <Img fluid={person.image.asset.fluid} />
            <p className="description">{person.description}</p>
          </StaffStyles>
        ))}
      </StaffGrid>
    </>
  );
}

export const query = graphql`
  query {
    staff: allSanityPerson {
      totalCount
      nodes {
        name
        id
        slug {
          current
        }
        description
        image {
          asset {
            fluid(maxWidth: 410) {
              ...GatsbySanityImageFluid
            }
          }
        }
      }
    }
  }
`;
