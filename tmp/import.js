const shell = require('shelljs');

const SOURCE_DIR = '../mh-home/src/components/DialogWall';
const TARGET_DIR = './src/lib';

shell.echo('Start');

if (!shell.test('-d', SOURCE_DIR)){
  shell.echo('SOURCE_DIR does not exist.')
  exit(1);
}

shell.rm('-rf', `${TARGET_DIR}`);
shell.mkdir(TARGET_DIR);
shell.cp('-R', `${SOURCE_DIR}/*.*`, TARGET_DIR);

shell.echo('Done');
