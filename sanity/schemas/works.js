import {MdLocalLibrary as icon} from 'react-icons/md';

export default {
    // computer Name
    name:'works',
    // Visible title
    title:'Works',
    type: 'document',
    icon,

    fields : [
        {
            name:'name',
        title: 'Work Name',
        type:'string',
        description: 'Name of the Project',
    },
    {
        name:'slug',
        title: 'Slug',
        type:'slug',
        options:{
            source:'name',
            maxLenght: 200,
        },    
    },
    {
        name:'image',
    title: 'Image',
    type:'image',
    options:{
        hotspot:true,
    },
},
{
    name:'project',
title: 'Project',
type:'string',
description: 'Description of the Project',
},
{
    title: 'Image URL',
    name: 'imageUrl',
    type: 'url',
  },
{
    name:'projects',
    title:'Projects',
    type: 'array',
    of: [{type:'reference',to:[{type:'project'}] }],
}, 
],
preview: {
    select:{
        title:'name',
        media:'image',
        project0:'projects.0.name',
        project1:'projects.1.name',
        project2:'projects.2.name',
        project3:'projects.3.name',
    },
    prepare:({title, media, ...projects}) => {
      const tops = Object.values(projects).filter(Boolean);
      return {
          title,
          media,
          subtitle:tops.join(', '),
      };

    },
},
};