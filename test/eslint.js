import lint from 'mocha-eslint';
import Path from 'path';

// paths to check
const paths = [
  Path.join( __dirname, '..', 'util' ),
];
if( 'TEST_FOLDER' in process.env ) {
  paths.push( Path.join( __dirname, '..', 'test', process.env.TEST_FOLDER ) );
} else {
  paths.push( Path.join( __dirname, '..', 'test' ), );
}

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
