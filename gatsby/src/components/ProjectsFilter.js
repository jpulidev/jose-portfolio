import { graphql, Link, useStaticQuery } from 'gatsby';
import React from 'react';
import styled from 'styled-components';

const ProjectsStyles = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 4rem;
  font-size: 17px;
  max-width: 350px;

  a {
    display: grid;
    padding: 5px;
    grid-template-columns: auto 1fr;
    grid-gap: 0 1rem;
    background: rgb(251, 240, 209);
    color: #000;
    align-items: center;
    border-radius: 2px;
    ,
    count {
      background: white;
      padding: 2px 5px;
    }
    &.active {
      background: var(--yellow);
    }
  }
  @media screen and (max-width: 1000px) {
    margin: 0 auto;
  }
`;

function countProjectsinWorks(works) {
  // return projects with count
  const counts = works
    .map((works) => works.projects)
    .flat()
    .reduce((acc, project) => {
      // Check if this is an existing project
      const existingProject = acc[project.id];
      if (existingProject) {
        existingProject.count += 1;
      } else {
        acc[project.id] = {
          id: project.id,
          name: project.name,
          count: 1,
        };
      }
      return acc;
      // if it is, increment by 1
      // otherwise create a new entry in out acc and set it to one
    }, {});
  const sortedProjects = Object.values(counts).sort(
    (a, b) => b.count - a.count
  );
  return sortedProjects;
}

export default function ProjectsFilter({ activeProject }) {
  // Get a list of all The Projects
  const { projects, works } = useStaticQuery(graphql`
    query {
      works: allSanityWorks {
        nodes {
          projects {
            name
            id
          }
        }
      }
      projects: allSanityProject {
        nodes {
          name
          id
          shopify
        }
      }
    }
  `);
  console.clear();

  const projectsWithCounts = countProjectsinWorks(works.nodes);
  // Get a list of all the Project with their Projects
  // count hoy many project are
  // Loop over the list
  return (
    <ProjectsStyles>
      <Link to="/projects">
        <span className="name">All</span>
      </Link>
      {projectsWithCounts.map((project) => (
        <Link
          to={`/project/${project.name}`}
          key={project.id}
          className={project.name === activeProject ? 'active' : ''}
        >
          <span className="name">{project.name}</span>
          <span className="count">{project.count}</span>
        </Link>
      ))}
    </ProjectsStyles>
  );
}
