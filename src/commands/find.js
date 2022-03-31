import chalk from 'chalk';
import { getDirectories } from '../utils.js';

export async function find(name) {
  getDirectories('./', (err, res) => {
    if (err) {
      console.log(err);
    } else {
      const foundPaths = res.filter((path) => path.includes(name));
      const cleanedPaths = foundPaths.filter((path) => path.includes('__ab__'));

      console.log(
        chalk.magenta.bold.underline(`Listing paths for experiment: `),
        chalk.magenta.bold.inverse(name),
        '\n',
      );

      cleanedPaths.forEach((path) => {
        console.log(chalk.green(`  ${path}`));
      });
    }
  });
}
