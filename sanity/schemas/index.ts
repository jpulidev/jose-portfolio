import type { SchemaTypeDefinition } from 'sanity';
import { works } from './works';
import { project } from './project';
import { person } from './person';

/** Every document type in the Studio. */
export const schemaTypes: SchemaTypeDefinition[] = [works, project, person];
