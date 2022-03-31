import fs from 'fs';
import { resolve } from 'path';
import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';
import _generate from '@babel/generator';

import {
  copyFile,
  findABDir,
  createABDir,
  findVariantDir,
  findImportsDir,
  getFileExtension,
  createVariantDir,
  createImportsDir,
  findExperimentDir,
  createExperimentDir,
} from '../utils.js';

const traverse = _traverse.default;
const generate = _generate.default;

async function findOrInitFolderStructure(path, experiment, variant) {
  const abDirExists = await findABDir(path);
  const experimentDirExists = await findExperimentDir(path, experiment);
  const variantDirExists = await findVariantDir(path, experiment, variant);
  const importsDirExists = await findImportsDir(path, experiment, variant);

  if (!abDirExists) {
    await createABDir(path);
  }
  if (!experimentDirExists) {
    await createExperimentDir(path, experiment);
  }
  if (!variantDirExists) {
    await createVariantDir(path, experiment, variant);
  }
  if (!importsDirExists) {
    await createImportsDir(path, experiment, variant);
  }
}

function getAST(source) {
  return parse(source.toString(), { sourceType: 'module', plugins: ['typescript', 'jsx'] });
}

function setComponentName(ast, name, variant) {
  traverse(ast, {
    enter(path) {
      const newName = `${name}${variant}`;
      if (path.isIdentifier({ name })) {
        // If variant already exists do nothing
        if (path.node.name === newName) return;

        path.node.name = newName;
      }
    },
  });
}

function getIdentifiers(source) {
  let out = [];
  const ast = getAST(source);

  traverse(ast, {
    enter(path) {
      if (path.isIdentifier()) {
        out.push(path.node.name);
      }
    },
  });

  return out;
}

function getLocalImportPaths(source) {
  let out = [];
  const ast = getAST(source);

  traverse(ast, {
    enter(path) {
      if (path.isImportDeclaration()) {
        const value = path.node.source.value;
        if (value[0] === '.' || value[0] === '/') {
          out.push(value);
        }
      }
    },
  });

  return out;
}

function setImportDeclarationSourceValue(source, value) {
  const ast = getAST(source);

  traverse(ast, {
    enter(path) {
      console.log('aici', path);
      if (path.isImportDeclaration()) {
        console.log(path.node);
        const _value = path.node.source.value;
        if (_value === value) {
          console.log('aici2', _value);
        }
      }
    },
  });
}

function generateVariant(identifier, variant, path) {
  const data = fs.readFileSync(path);
  const ast = getAST(data);

  setComponentName(ast, identifier, variant);

  return generate(ast).code;
}

function cloneImports(root, paths, experiment, variant) {
  paths.forEach(async (path) => {
    let previousWD = process.cwd();
    process.chdir(root);

    const extension = await getFileExtension(path);
    const absolutePath = `${resolve(path)}.${extension}`;
    const fileName = absolutePath.split('/').pop();

    process.chdir(previousWD);

    const destination = `${root}/__ab__/${experiment}/${variant}/imports/${fileName}`;
    await copyFile(absolutePath, destination);

    const source = fs.readFileSync(destination);
    setImportDeclarationSourceValue(source, path);
  });
}

export {
  cloneImports,
  getIdentifiers,
  generateVariant,
  setComponentName,
  getLocalImportPaths,
  findOrInitFolderStructure,
};
