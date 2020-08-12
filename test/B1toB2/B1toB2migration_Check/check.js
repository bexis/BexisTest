import Browser    from '../../util/Browser';
import { assert } from 'chai';
import login from '../../util/common/login';
import Config     from '../../config';
import ds_ids from '../B2toB1compare_Datasets/dataset_ids';
import common from '../../util/common';

//var dataset_ids = ds_ids.dataset_Ids();
var unstructured_dataset_ids = ds_ids.unstructured_Ids();
var numberofVersions = null;

/**
 * small things to check
*/
describe( 'Check after migration', () => {
  // select one random unstructured dataset
  const randomIDpos = Math.floor(Math.random() * unstructured_dataset_ids.length);

  // check amout of created versions
  checkVersions(unstructured_dataset_ids[randomIDpos]);

});


/**
 * Check amout of versions
 *
 * @param {string | number} id
 */
function checkVersions(id){

  it('check metadata not valid is not shown', async () => {
    // open tab
    const page = await Browser.openTab();

    // ensure user is logged in BEXIS 2
    const elem = await page.$x('//a[text()="Login"]');
    if (await elem[0] != null){
      await login.loginUser(page);
    }

    // navigate to dataset page
    await assert.isFulfilled( page.goto( Config.browser.baseURL + '/ddm/data/Showdata/' + id ), 'should show dataset view' );

    // get options from selection list
    const result = await common.elements.returnSelectContent( page);

    // get number of versions to check later
    numberofVersions = result.length;
    console.log(result);

    // search for warning element
    await assert.isFulfilled( page.waitForSelector( '#view-warning', { visible: true }), 'metadata is invalid' );
    const warning = await page.$('#view-warning');

    // check if element was found - if yes it is an error
    await assert.isRejected( warning.isIntersectingViewport(), 'Metadata is invalid should be not shown');

  });

  it('check number of created versions for unstructured datasets', async () => {
    assert.equal( numberofVersions, 3, 'should have only 3 version, but has ' + numberofVersions);
  });
}
