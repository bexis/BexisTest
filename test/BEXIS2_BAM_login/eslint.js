import lint from 'mocha-eslint';
import Path from 'path';

// paths to check
const paths = [
  Path.join( __dirname, '..', 'util' ),
  Path.join( __dirname, '..', 'test' ),
];

// other options
const options = {
  formatter:    'compact',
  alwaysWarn:   false,
  timeout:      5000,
  slow:         1000,
  strict:       true,
  contextName:  '.eslint',
};

lint( paths, options );
