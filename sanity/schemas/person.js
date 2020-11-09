import {MdPerson as icon} from 'react-icons/md';

export default {
    // computer Name
    name:'person',
    // Visible title
    title:'Team',
    type: 'document',
    icon,

    fields : [
        {
            name:'name',
        title: 'Name',
        type:'string',
        description: 'Team Member',
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
        name:'description',
        title: 'description',
        type:'text',
        description:'Tell us a bit about this person',
    },
    {
        name:'image',
    title: 'Image',
    type:'image',
    options:{
        hotspot:true,
    },
    
},
],
};