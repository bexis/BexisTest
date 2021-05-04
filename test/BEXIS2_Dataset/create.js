import Browser    from '../../util/Browser';
import util       from '../../util/common';
import { assert } from 'chai';


describe('Create Meta Data Schema', () => {
  createDatasetTest('Tabular.Data.New');
  createDatasetTest('File.New');
  createDatasetTest('Existing.Tabular.Data');
  createDatasetTest('Existing.File.Data');
});

function createDatasetTest(value) {
  it(`Should create dataset ${value}`, async () => {
    // open a new tab
    const page = await Browser.openTab();

    // make sure user is logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
    }

    // navigate to "Create dataset"
    await assert.isFulfilled( util.menu.select( page, 'Create Dataset' ), 'should open the create dataset page' );

    await assert.isFulfilled( page.waitForSelector( '#SetupContainer', { visible: true }), 'wait for create dataset page' );

    if (value === 'Tabular.Data.New'){
      await assert.isFulfilled( page.click( 'input[value="CreateNewStructure"]' ), 'should select Tabular Data' );
    }
    if (value === 'File.New'){
      await assert.isFulfilled( page.click( 'input[value="CreateNewFile"]' ), 'should select file data' );
    }
    if (value === 'Existing.Tabular.Data'){
      await assert.isFulfilled( page.click( 'input[value="Existing_structured"]' ), 'should select Existing Tabular Data Structure' );
      await assert.isFulfilled( page.select('select#select_structured', '67'));
    }
    if (value === 'Existing.File.Data'){
      await assert.isFulfilled( page.click( 'input[value="Existing_unstructured"]' ), 'should select Existing Tabular Data Structure' );
      await assert.isFulfilled( page.select('select#select_unstructured', '68'));
    }

    // find telerik dorpdown to open list
    await assert.isFulfilled( page.click( 'div[title="Select a Metadata Structure"]' ), 'should open select metadata structure' );

    // this is currently implicit via the position in the list, which assumes ABCD at 2nd position
    await assert.isFulfilled( page.click( '.t-animation-container > div > ul> li:nth-child(2)' ), 'should select Second Schema' );

    // submit
    await assert.isFulfilled( page.click( 'button[value="Save"]' ), 'should click the next button' );

    // remark: loading the metadata form can take a while, especially for bigger schemas
    await assert.isFulfilled( page.waitForSelector( '.t-upload-button', { visible: true }), 'wait for edit form' );

    // fill title field (identification via idbyxpath, which is in comparison to the id stable over time)
    await assert.isFulfilled( page.type( 'input[idbyxpath="Metadata_ShipTo_1__ShipToType_1_name_1"', 'Integration test dataset - '+value ), 'should add titel to dataset' );

    // save form
    await assert.isFulfilled( page.click( '#save' ), 'should save metadata' );

    // after validation an alert is shown, that not all required fields are field -> click OK
    page.on('dialog', (dialog) => { dialog.accept();});

    // wait until the dataset is loaded in view mode
    await assert.isFulfilled( page.waitForSelector( '#metadata', { visible: true }), 'wait for show dataset' );
  });
}
