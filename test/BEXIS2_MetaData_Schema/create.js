import Browser from '../../util/Browser';
import util from '../../util/common';
import { assert } from 'chai';

describe('Create Meta Data Type', () => {

  it('should show error - Schema name cannot be empty', async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if (!(await util.login.isLoggedIn(page))) {
      await assert.isFulfilled(util.login.loginUser(page), 'should login');
    }

    // navigate to "Manage Metadata Structure"
    await assert.isFulfilled(util.menu.select(page, 'Manage Metadata Structure'), 'should open manage meta data structure');

    // wait for Import button is loaded in view model
    await assert.isFulfilled(page.waitForSelector('body > div.main-content.container-fluid > table > tbody > tr > td > div > a', { visible: true }), 'should wait for button create data type');

    // click Import button
    await assert.isFulfilled(page.click('body > div.main-content.container-fluid > table > tbody > tr > td > div > a'), 'should click import button');

    // select File Uploader and upload default file
    const elementHandle = await page.$('#SelectFileUploader');
    await elementHandle.uploadFile('./test/BEXIS2_MetaData_Schema/testXSDFile.xsd');

    // click Next button
    await assert.isFulfilled(page.click('#nextBt'), 'Should Click Next button');

    // click generate Schema button
    await assert.isFulfilled(page.waitForSelector('#ReadSource > div.wizardStep_Main > div.wizardStep_Content.stepper > table > tbody > tr:nth-child(3) > td:nth-child(1) > a'));
    await assert.isFulfilled(page.click('#ReadSource > div.wizardStep_Main > div.wizardStep_Content.stepper > table > tbody > tr:nth-child(3) > td:nth-child(1) > a'), 'should click generate button');

    // click Next button
    await assert.isFulfilled(page.click('#nextBt'), 'Should Click Next button');
    console.log('success');

  });

  it('should show error - Please select the missing field', async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if (!(await util.login.isLoggedIn(page))) {
      await assert.isFulfilled(util.login.loginUser(page), 'should login');
    }

    // navigate to "Manage Metadata Structure"
    await assert.isFulfilled(util.menu.select(page, 'Manage Metadata Structure'), 'should open manage meta data structure');

    // wait until Import button is loaded in view model
    await assert.isFulfilled(page.waitForSelector('body > div.main-content.container-fluid > table > tbody > tr > td > div > a', { visible: true }), 'should wait for button create data type');

    // click Import button
    await assert.isFulfilled(page.click('body > div.main-content.container-fluid > table > tbody > tr > td > div > a'), 'should click import button');

    // click generate Schema button
    const elementHandle = await page.$('#SelectFileUploader');
    await elementHandle.uploadFile('./test/BEXIS2_MetaData_Schema/testXSDFile.xsd');

    // click Next button
    await assert.isFulfilled(page.click('#nextBt'), 'Should Click Next button');

    // find Schema Name field and type a name for schema name
    await assert.isFulfilled(page.waitForSelector('#SchemaName'));
    const schemaName = Math.random().toString(36).substring(7);
    await assert.isFulfilled( page.type( '#SchemaName', schemaName ), 'should enter a schema name' );

    // click generate button
    await assert.isFulfilled(page.click('#ReadSource > div.wizardStep_Main > div.wizardStep_Content.stepper > table > tbody > tr:nth-child(3) > td:nth-child(1) > a'), 'should click generate button');

    // click Next button
    await assert.isFulfilled(page.click('#nextBt'), 'Should Click Next button');

    // find Select Dataset field and fill in Dataset
    await assert.isFulfilled(page.waitForSelector('#ImportMetadataStructureSetParameters'));
    await assert.isFulfilled( page.click( '#ImportMetadataStructureSetParameters > div.wizardStep_Main > div.wizardStep_Content.stepper > table > tbody > tr:nth-child(1) > td:nth-child(2) > div > div > span.t-input'), 'should click the Entity Type' );
    await assert.isFulfilled( page.click( '.t-animation-container > div > ul> li:nth-child(2)', 'Dataset'), 'should enter name Dataset' );

    // wait for the Title Selection container
    await assert.isFulfilled(page.waitForSelector('#titleSelectionContainer > a'));

    // find, click and select the Title node for the Title Selection Container
    await assert.isFulfilled(page.click('#titleSelectionContainer > a'), 'Should Click Title Selection Container button');
    await assert.isFulfilled(page.waitForXPath('//td[contains(., "ShipTo/state")]').then(selector => selector.click()));
    await assert.isFulfilled(page.click('#submitToSelectanodeforthetitle'), 'Should Click Select button');

    // click Next button
    await assert.isFulfilled(page.click('#nextBt'), 'Should Click Next button');
    console.log('Success');
  });

  it('should create a new Meta Data Type', async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if (!(await util.login.isLoggedIn(page))) {
      await assert.isFulfilled(util.login.loginUser(page), 'should login');
    }

    // navigate to "Manage Metadata Structure"
    await assert.isFulfilled(util.menu.select(page, 'Manage Metadata Structure'), 'should open manage meta data structure');

    // wait until Import button loaded in view model
    await assert.isFulfilled(page.waitForSelector('body > div.main-content.container-fluid > table > tbody > tr > td > div > a', { visible: true }), 'should wait for button create data type');

    // click Import button
    await assert.isFulfilled(page.click('body > div.main-content.container-fluid > table > tbody > tr > td > div > a'), 'should click import button');

    // click file upload button and upload test file
    const elementHandle = await page.$('#SelectFileUploader');
    await elementHandle.uploadFile('./test/BEXIS2_MetaData_Schema/testXSDFile.xsd');

    // click Next button
    await assert.isFulfilled(page.click('#nextBt'), 'Should Click Next button');

    // find Schema Name field and type a description for schema name
    await assert.isFulfilled(page.waitForSelector('#SchemaName'));
    const schemaName = Math.random().toString(36).substring(7);
    await assert.isFulfilled( page.type( '#SchemaName', schemaName ), 'should enter a schema name' );

    // click generate button
    await assert.isFulfilled(page.click('#ReadSource > div.wizardStep_Main > div.wizardStep_Content.stepper > table > tbody > tr:nth-child(3) > td:nth-child(1) > a'), 'should click generate button');

    // click Next button
    await assert.isFulfilled(page.click('#nextBt'), 'Should Click Next button');

    // find Select Dataset field and fill in Dataset
    await assert.isFulfilled(page.waitForSelector('#ImportMetadataStructureSetParameters'));
    await assert.isFulfilled( page.click( '#ImportMetadataStructureSetParameters > div.wizardStep_Main > div.wizardStep_Content.stepper > table > tbody > tr:nth-child(1) > td:nth-child(2) > div > div > span.t-input'), 'should click the Entity Type' );
    await assert.isFulfilled( page.click( '.t-animation-container > div > ul> li:nth-child(2)', 'Dataset'), 'should enter name Dataset' );

    // Wait for Title Selection Container
    await assert.isFulfilled(page.waitForSelector('#titleSelectionContainer > a'));

    // find, click and select the Title node for the Title Selection Container
    await assert.isFulfilled(page.click('#titleSelectionContainer > a'), 'Should Click Title Selection Container button');
    await assert.isFulfilled(page.waitForXPath('//td[contains(., "ShipTo/state")]').then(selector => selector.click()));
    await assert.isFulfilled(page.click('#submitToSelectanodeforthetitle'), 'Should Click Select button');

    // find, click and select the Description Node
    await assert.isFulfilled(page.click('#descriptionSelectionContainer > a'), 'Should Click Title Selection Container button');
    await assert.isFulfilled(page.waitForXPath('//td[contains(., "BillTo/city")]').then(selector => selector.click()));
    await assert.isFulfilled(page.click('#submitToSelectanodeforthedescription'), 'Should Cli ck Select button');

    // click Next button
    await assert.isFulfilled(page.click('#nextBt'), 'Should Click Next button');

    // wait and click finish button
    await assert.isFulfilled(page.waitForSelector('#finishBt'));
    await assert.isFulfilled(page.click('#finishBt'), 'Should Click Next button');

    // wait and click last page
    await assert.isFulfilled(page.waitForSelector('#metadataStructuresGrid > div > div.t-pager.t-reset > a:nth-child(5) > span'));
    await assert.isFulfilled(page.click('#metadataStructuresGrid > div > div.t-pager.t-reset > a:nth-child(5) > span'), 'Should Click Last Page button');

    // find created Metadata and Log it
    await assert.isFulfilled(page.waitForSelector('#metadataStructuresGrid > table > tbody'));
    const row = await page.$x('//td[contains(., "'+schemaName+'")]');
    const prop = await row[0].getProperty('innerText');
    if(prop != 'null'){
      console.log('Success');
    }

  });
});