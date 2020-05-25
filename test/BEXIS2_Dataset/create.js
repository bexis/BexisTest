import Browser    from '../../util/Browser';
import util       from '../../util/common';
import { assert } from 'chai';
import login from '../../util/common/login';

describe( 'Login', () => {

  it( 'should show an error when create dataset not succesfull', async () => {

    // get a tab
    const page = await Browser.openTab();

    // ensure no user is logged in
    await login.loginUser (page);

    // navigate to "Create dataset"
    await assert.isFulfilled( util.menu.select( page, 'Create Dataset' ), 'should open the create dataset page' );

    await assert.isFulfilled( page.waitForSelector( '#SetupContainer', { visible: true }), 'wait for create dataset page' );

    await assert.isFulfilled( page.click( 'input[value="CreateNewFile"]' ), 'should select file data' );

    await assert.isFulfilled( page.click( 'div[title="Select a Metadata Structure"]' ), 'should open select metadate structure' );

    await assert.isFulfilled( page.click( '.t-animation-container > div > ul> li:nth-child(2)' ), 'should select tabular data' );

    // submit
    await assert.isFulfilled( page.click( 'button[value="Save"]' ), 'should click the nect button' );

    await assert.isFulfilled( page.waitForSelector( '.t-upload-button', { visible: true }), 'wait for edit form' );

    await assert.isFulfilled( page.type( 'input[idbyxpath="Metadata_Metadata_1__MetadataType_1__Description_1__DescriptionType_1__Representation_1__MetadataDescriptionRepr_1_Title_1"', 'UI test dataset' ), 'should add titel to dataset' );

    await assert.isFulfilled( page.click( '#save' ), 'should save metadata' );

    page.on('dialog', (dialog) => { dialog.accept();});

    await assert.isFulfilled( page.waitForSelector( '#metadata', { visible: true }), 'wait for show dataset' );

  });
});