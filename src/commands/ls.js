import chalk from 'chalk';
import { getDirectories } from '../utils.js';

export async function ls({ src = './' }) {
  getDirectories(src, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      const foundABDirs = res.filter((path) => path.includes('__ab__'));
      console.log(
        chalk.magenta.bold.underline(
          `Listing all ${chalk.magenta.bold.underline.inverse(
            '__ab__',
          )} paths under: ${chalk.magenta.bold.inverse(src)}\n`,
        ),
      );

      foundABDirs.forEach((path) => {
        console.log(chalk.green(`  ${path}`));
      });
    }
  });
}
