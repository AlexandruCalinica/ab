import { program } from 'commander';
import _traverse from '@babel/traverse';
import _generate from '@babel/generator';

import { ls, find, create } from './src/commands/index.js';

program.version('1.0.0');

program
  .command('ls')
  .description('List all existing a/b experiment paths')
  .option('-s, --src [src]', 'Path to scan for a/b experiments. Default: current working directory')
  .action(ls);

program.command('find').description('Find a/b experiment by name').argument('<name>').action(find);

program.command('create').description('Create Experiment/Variant Wizard').action(create);

program.parseAsync(process.argv).then(
  (_) => {},
  (e) => {
    console.log(e);
    process.exit(100);
  },
);
