
// determine the folders to test
const folders = [ 'test/setup.js', 'test/eslint.js' ];
if( 'TEST_FOLDER' in process.env ) {
  folders.push( `test/${process.env.TEST_FOLDER}/**/*.js` );
} else {
  folders.push( 'test/**/*.js' );
}

module.exports = {

  // overall time for a single test to run
  timeout: 100 * 1000,

  // which test files to run?
  spec: folders,

};
