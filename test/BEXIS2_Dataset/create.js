import Browser    from '../../util/Browser';
import util       from '../../util/common';
import { assert } from 'chai';
import login from '../../util/common/login';

describe( 'Create Dataset (ABCD): new file', () => {

  it( 'should show an error when create dataset not succesfull', async () => {

    // open a new tab
    const page = await Browser.openTab();

    // ensure a normal user is logged in
    await login.loginUser (page);

    // navigate to "Create dataset"
    await assert.isFulfilled( util.menu.select( page, 'Create Dataset' ), 'should open the create dataset page' );

    await assert.isFulfilled( page.waitForSelector( '#SetupContainer', { visible: true }), 'wait for create dataset page' );

    await assert.isFulfilled( page.click( 'input[value="CreateNewFile"]' ), 'should select file data' );

    // find telerik dorpdown to open list
    await assert.isFulfilled( page.click( 'div[title="Select a Metadata Structure"]' ), 'should open select metadate structure' );

    // this is currently implicit via the position in the list, which assumes ABCD at 2nd position
    await assert.isFulfilled( page.click( '.t-animation-container > div > ul> li:nth-child(2)' ), 'should select ABCD schema' );

    // submit
    await assert.isFulfilled( page.click( 'button[value="Save"]' ), 'should click the next button' );

    // remark: loading the metadata form can take a while, especially for bigger schemas
    await assert.isFulfilled( page.waitForSelector( '.t-upload-button', { visible: true }), 'wait for edit form' );

    // fill title field (identification via idbyxpath, which is in comparison to the id stable over time)
    await assert.isFulfilled( page.type( 'input[idbyxpath="Metadata_Metadata_1__MetadataType_1__Description_1__DescriptionType_1__Representation_1__MetadataDescriptionRepr_1_Title_1"', 'Integration test dataset - new file data' ), 'should add titel to dataset' );

    // save form
    await assert.isFulfilled( page.click( '#save' ), 'should save metadata' );

    // after validation an alert is shown, that not all required fields are field -> click OK
    page.on('dialog', (dialog) => { dialog.accept();});

    // wait until the dataset is loaded in view mode
    await assert.isFulfilled( page.waitForSelector( '#metadata', { visible: true }), 'wait for show dataset' );

  });
});

describe( 'Create Dataset (ABCD): new tabular data', () => {

  it( 'should show an error when create dataset not succesfull', async () => {

    // open a new tab
    const page = await Browser.openTab();

    await login.logoff (page);
    // ensure a normal user is logged in
    await login.loginUser (page);

    // navigate to "Create dataset"
    await assert.isFulfilled( util.menu.select( page, 'Create Dataset' ), 'should open the create dataset page' );

    await assert.isFulfilled( page.waitForSelector( '#SetupContainer', { visible: true }), 'wait for create dataset page' );

    await assert.isFulfilled( page.click( 'input[value="CreateNewStructure"]' ), 'should select file data' );

    // find telerik dorpdown to open list
    await assert.isFulfilled( page.click( 'div[title="Select a Metadata Structure"]' ), 'should open select metadate structure' );

    // this is currently implicit via the position in the list, which assumes ABCD at 2nd position
    await assert.isFulfilled( page.click( '.t-animation-container > div > ul> li:nth-child(2)' ), 'should select ABCD schema' );

    // submit
    await assert.isFulfilled( page.click( 'button[value="Save"]' ), 'should click the next button' );

    // remark: loading the metadata form can take a while, especially for bigger schemas
    await assert.isFulfilled( page.waitForSelector( '.t-upload-button', { visible: true }), 'wait for edit form' );

    // fill title field (identification via idbyxpath, which is in comparison to the id stable over time)
    await assert.isFulfilled( page.type( 'input[idbyxpath="Metadata_Metadata_1__MetadataType_1__Description_1__DescriptionType_1__Representation_1__MetadataDescriptionRepr_1_Title_1"', 'Integration test dataset - new tabular data' ), 'should add titel to dataset' );

    // save form
    await assert.isFulfilled( page.click( '#save' ), 'should save metadata' );

    // after validation an alert is shown, that not all required fields are field -> click OK
    page.on('dialog', (dialog) => { dialog.accept();});

    // wait until the dataset is loaded in view mode
    await assert.isFulfilled( page.waitForSelector( '#metadata', { visible: true }), 'wait for show dataset' );

  });
});