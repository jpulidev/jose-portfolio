import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export default {
  siteMetadata: {
    // Brand name. Appended to every page title by src/components/SEO.js.
    title: `Jose Pulido`,
    // Used for the home page, and as the fallback whenever a page sets no title.
    defaultTitle: `Jose Pulido — Fullstack Developer`,
    // Real origin. Every absolute URL (canonical, og:url, og:image) derives from this.
    siteUrl: 'https://jpulidev.com',
    description:
      'Jose Pulido — fullstack developer specialising in web applications and Shopify storefronts, built with JavaScript, React, Node and Liquid.',
    twitter: '@jpulidev',
    // Social share card, resolved to an absolute URL in SEO.js.
    // TODO: replace with a purpose-built 1200x630 card (this one is only 204x132).
    image: '/laptopcode.png',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-styled-components',
    {
      // this is the name of the plugin you are adding
      resolve: 'gatsby-source-sanity',
      options: {
        projectId: 'xom53qc4',
        dataset: 'production',
        watchMode: true,
        token: process.env.SANITY_TOKEN,
      },
    },
  ],
};
