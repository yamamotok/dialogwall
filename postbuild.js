const shell = require('shelljs');

shell.cp('src/lib/*.css', 'dist/lib');
shell.cp('src/lib/modules/*.css', 'dist/lib/modules');
