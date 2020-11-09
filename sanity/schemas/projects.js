import {MdLaptopMac as icon} from 'react-icons/md';


export default {
    // computer Name
    name:'project',
    // Visible title
    title:'Uses',
    type: 'document',
    icon,

    fields : [
        {
            name:'name',
        title: 'Work Name',
        type:'string',
        description: 'Description of the Project',
        }, 
        {
         name:'shopify',
        title: 'Shopify',
        type:'boolean',
        description: 'Description of the Project',
        options:{
            layout:'checkbox',
        }
        },
  
  ],
  preview: {
      select:{
          name:'name',
          shopify:'shopify',
      },
      prepare:({name, shopify}) => ({
          title: `${name} ${shopify ? '🛍' : '👷'}`
      }),
  },

};
