import path from 'path';

async function turnWorksIntoPages({ graphql, actions }) {
  // Get a template for this page
  const workTemplate = path.resolve('./src/templates/Work.js');
  // query all projects
  const { data } = await graphql(`
    query {
      works: allSanityWorks {
        nodes {
          name
          slug {
            current
          }
        }
      }
    }
  `);
  data.works.nodes.forEach((works) => {
    actions.createPage({
      // URl page
      path: `project/${works.slug.current}`,
      component: workTemplate,
      context: {
        slug: works.slug.current,
      },
    });
  });
  // Loop over each work and create a page for that work
}

async function turnProjectsIntoPages({ graphql, actions }) {
  console.log(`Turning the projects into pages`);
  const projectTemplate = path.resolve('./src/pages/projects.js');
  // Get the template
  // query all Projects
  const { data } = await graphql(`
    query {
      projects: allSanityProject {
        nodes {
          name
          id
        }
      }
    }
  `);
  // createPage for that project
  data.projects.nodes.forEach((project) => {
    console.log(`Creating Page for Project`, project.name);
    actions.createPage({
      path: `project/${project.name}`,
      component: projectTemplate,
      context: {
        project: project.name,
        // TODO Regex for Project
      },
    });
  });
  // Pass projects data to works.js
}

export async function createPages(params) {
  // create pages dynamically
  // Wait for all promises to be resolved before finishing this function
  await Promise.all([
    turnWorksIntoPages(params),
    turnProjectsIntoPages(params),
  ]);

  // Projects
  // About
}
