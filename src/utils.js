import fs from 'fs';
import glob from 'glob';

function findDir(path) {
  return new Promise((resolve, reject) =>
    getDirectory(path, (err, res) => {
      if (err) {
        reject(err);
      } else {
        if (res.length) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    }),
  );
}

function getDirectories(src, callback) {
  glob(`${src}/**/*`, callback);
}

function getDirectory(src, callback) {
  glob(src, callback);
}

function getFileExtension(path) {
  return new Promise((resolve, reject) =>
    glob(`${path}*`, (err, res) => {
      if (err) {
        return reject(err);
      } else {
        if (res.length > 0) {
          const splitted = res[0]?.split('.');
          resolve(splitted[splitted?.length - 1]);
        } else {
          reject('No file found.');
        }
      }
    }),
  );
}

function createABDir(path) {
  return Promise.resolve(fs.mkdirSync(`${path}/__ab__`));
}

function createExperimentDir(path, experiment) {
  return Promise.resolve(fs.mkdirSync(`${path}/__ab__/${experiment}`));
}

function createVariantDir(path, experiment, variant) {
  return Promise.resolve(fs.mkdirSync(`${path}/__ab__/${experiment}/${variant}`));
}

function createImportsDir(path, experiment, variant) {
  return Promise.resolve(fs.mkdirSync(`${path}/__ab__/${experiment}/${variant}/imports`));
}

function findABDir(path) {
  return findDir(`${path}/__ab__`);
}

function findExperimentDir(path, experiment) {
  return findDir(`${path}/__ab__/${experiment}`);
}

function findVariantDir(path, experiment, variant) {
  return findDir(`${path}/__ab__/${experiment}/${variant}`);
}

function findImportsDir(path, experiment, variant) {
  return findDir(`${path}/__ab__/${experiment}/${variant}/imports`);
}

function writeFile(path, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, {}, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

function copyFile(path, destination) {
  return new Promise((resolve, reject) => {
    fs.copyFile(path, destination, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

export {
  copyFile,
  writeFile,
  findABDir,
  createABDir,
  getDirectories,
  findImportsDir,
  findVariantDir,
  createImportsDir,
  createVariantDir,
  getFileExtension,
  findExperimentDir,
  createExperimentDir,
};
