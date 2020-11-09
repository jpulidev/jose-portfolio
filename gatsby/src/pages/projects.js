import { graphql } from 'gatsby';
import React from 'react';
import styled from 'styled-components';
import ProjectList from '../components/ProjectList';
import ProjectsFilter from '../components/ProjectsFilter';
import SEO from '../components/SEO';

const ProjectsGridOne = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1200px;
  margin: 0 auto;
  gap: 20px;
  h1 {
    font-size: 3em;
    line-height: 1;
  }
  h3 {
    color: #8491a0;
    font-size: 18px;
    letter-spacing: 2px;
  }
  @media screen and (max-width: 1000px) {
    grid-template-columns: 1fr;
    h1 {
      font-size: 2em;
      max-width: 300px;
    }
  }
`;
const FilterDiv = styled.div`
  display: grid;
  align-items: end;
  background: #fbf0d1;
`;

export default function ProjectPage({ data, pageContext }) {
  const project = data.project.nodes;
  return (
    <>
      <SEO
        title={
          pageContext.project
            ? `Projects With ${pageContext.project}`
            : `All Projects`
        }
      />
      <ProjectsGridOne>
        <div>
          <h3>MY PROJECTS</h3>
          <h1>Works that I've done in the past years</h1>
        </div>
        <FilterDiv>
          <ProjectsFilter activeProject={pageContext.project} />
        </FilterDiv>
      </ProjectsGridOne>

      <ProjectList project={project} />
    </>
  );
}

export const query = graphql`
  query WorkQuery($project: [String]) {
    project: allSanityWorks(
      filter: { projects: { elemMatch: { name: { in: $project } } } }
    ) {
      nodes {
        name
        id
        slug {
          current
        }
        projects {
          id
          name
        }
        image {
          asset {
            fixed(width: 200, height: 200) {
              ...GatsbySanityImageFixed
            }
            fluid(maxWidth: 400) {
              ...GatsbySanityImageFluid
            }
          }
        }
      }
    }
  }
`;
