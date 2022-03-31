import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { prompt } = require('enquirer');

import {
  cloneImports,
  getIdentifiers,
  generateVariant,
  getLocalImportPaths,
  findOrInitFolderStructure,
} from '../core/index.js';
import { writeFile } from '../utils.js';

const getFirstOptions = () => [
  {
    type: 'select',
    name: 'create',
    message: 'Choose action',
    choices: ['Experiment', 'Variant'],
  },
  {
    type: 'text',
    name: 'experiment',
    message: 'Experiment name',
  },
  {
    type: 'text',
    name: 'path',
    message: 'Path to the target directory',
  },
  {
    type: 'text',
    name: 'file',
    message: 'Target File (including extension)',
  },
];

const getSecondOptions = (components) => [
  {
    type: 'select',
    name: 'identifier',
    message: 'Choose component',
    choices: components,
  },
  {
    type: 'select',
    name: 'variant',
    message: 'Select variant',
    choices: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  },
];

export async function create() {
  // Prompt for first set of options
  const firstOptions = await prompt(getFirstOptions());
  const { path, experiment, file } = firstOptions;

  // Get source data of target file
  const source = fs.readFileSync(`${path}/${file}`);
  // Get paths of all local imports
  const localImportPaths = getLocalImportPaths(source);
  // Get identifiers of exported JSX components
  const components = getIdentifiers(source);

  // Prompt for second set of options after we get identifiers from target file
  const secondOptions = await prompt(getSecondOptions(components));
  const { variant, identifier } = secondOptions;

  // Check if folder structure already exists, if not, initialize it
  await findOrInitFolderStructure(path, experiment, variant);

  const targetFilePath = `${path}/${file}`;
  // Generate source code for the selected variant
  const generated = await generateVariant(identifier, variant, targetFilePath);

  const [fileName, extension] = file.split('.');
  const variantFileName = `${fileName}.${experiment}.${variant}.${extension}`;

  // Save the generated source code to a new file inside __ab__ path
  const written = await writeFile(
    `${path}/__ab__/${experiment}/${variant}/${variantFileName}`,
    generated,
  );

  // Clone source files of local imports
  cloneImports(path, localImportPaths, experiment, variant);
}
