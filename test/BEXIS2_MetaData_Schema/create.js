import Browser from '../../util/Browser';
import util from '../../util/common';
import elements from '../../util/common/elements';
import { assert } from 'chai';

describe('Create Meta Data Schema', () => {

  createMetaDataSchemaTest('schema.name.empty');
  createMetaDataSchemaTest('schema.name.special');
  createMetaDataSchemaTest('schema.node.title');
  createMetaDataSchemaTest('schema.node.description');
  createMetaDataSchema();
});

function createMetaDataSchema() {
  it('Should create meta data schema', async () => {

    const page = await Browser.openTab();
    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
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

    // wait for schema name field
    await assert.isFulfilled(page.waitForSelector('#SchemaName'));

    // find schema name field
    const schemaName = Math.random().toString(36).substring(7);
    await assert.isFulfilled( page.type( '#SchemaName', schemaName ), 'should enter a schema name' );

    // wait for generate button
    await assert.isFulfilled(page.waitForSelector('#ReadSource > div.wizardStep_Main > div.wizardStep_Content.stepper > table > tbody > tr:nth-child(3) > td:nth-child(1) > a'));

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

    // find, wait and select the Description Node
    await assert.isFulfilled(page.waitForSelector('#descriptionSelectionContainer > a'));
    await assert.isFulfilled(page.click('#descriptionSelectionContainer > a'), 'Should Click Title Selection Container button');

    await assert.isFulfilled(page.waitForXPath('//td[contains(., "BillTo/city")]').then(selector => selector.click()));

    await assert.isFulfilled(page.click('#submitToSelectanodeforthedescription'), 'Should Click Select button');

    // click Next button
    await assert.isFulfilled(page.click('#nextBt'), 'Should Click Next button');

    // wait and click finish button
    await assert.isFulfilled(page.waitForSelector('#finishBt'));
    await assert.isFulfilled(page.click('#finishBt'), 'Should Click Next button');

    // wait and click last page
    await assert.isFulfilled(page.waitForSelector('#metadataStructuresGrid > div > div.t-pager.t-reset > a:nth-child(5) > span'));
    await assert.isFulfilled(page.click('#metadataStructuresGrid > div > div.t-pager.t-reset > a:nth-child(5) > span'), 'Should Click Last Page button');

    // find created Metadata and Assert it True
    await assert.isFulfilled(page.waitForSelector('#metadataStructuresGrid > table > tbody'));
    assert.isFulfilled(page.$x('//td[contains(., "'+schemaName+'")]'));
  }
  );
}

function createMetaDataSchemaTest(skipped) {
  it(`Should show an error when missing ${skipped}`, async () => {

    const page = await Browser.openTab();
    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
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

    // wait for schema name field
    await assert.isFulfilled(page.waitForSelector('#SchemaName'));

    // find schema name field
    const schemaName = Math.random().toString(36).substring(7);
    if (skipped.indexOf('schema.name')>=0){
      if(skipped==='schema.name.empty'){
        await assert.isFulfilled( page.type( '#SchemaName', '' ), 'should enter empty schema name' );
      }
      else if(skipped==='schema.name.special'){
        await assert.isFulfilled( page.type( '#SchemaName', '?>.$' ), 'should enter a special character schema name' );
      }
      // wait for generate button
      await assert.isFulfilled(page.waitForSelector('#ReadSource > div.wizardStep_Main > div.wizardStep_Content.stepper > table > tbody > tr:nth-child(3) > td:nth-child(1) > a'));

      // click generate button
      await assert.isFulfilled(page.click('#ReadSource > div.wizardStep_Main > div.wizardStep_Content.stepper > table > tbody > tr:nth-child(3) > td:nth-child(1) > a'), 'should click generate button');

      // check for errors
      const checkErrMsg = await elements.hasErrors(page, '#ReadSource > div.wizardStep_Error.stepper > ul > li');

      // take screenshot of errors
      await page.screenshot({path: `./test/BEXIS2_MetaData_Schema/${skipped}Error.png`});
      assert.isTrue(checkErrMsg, 'should show an error');
      return;
    }
    await assert.isFulfilled( page.type( '#SchemaName', schemaName ), 'should enter a schema name' );

    // wait for generate button
    await assert.isFulfilled(page.waitForSelector('#ReadSource > div.wizardStep_Main > div.wizardStep_Content.stepper > table > tbody > tr:nth-child(3) > td:nth-child(1) > a'));
    // click generate button

    await assert.isFulfilled(page.click('#ReadSource > div.wizardStep_Main > div.wizardStep_Content.stepper > table > tbody > tr:nth-child(3) > td:nth-child(1) > a'), 'should click generate button');


    // // click Next button
    await assert.isFulfilled(page.click('#nextBt'), 'Should Click Next button');


    // find Select Dataset field and fill in Dataset
    await assert.isFulfilled(page.waitForSelector('#ImportMetadataStructureSetParameters'));
    await assert.isFulfilled( page.click( '#ImportMetadataStructureSetParameters > div.wizardStep_Main > div.wizardStep_Content.stepper > table > tbody > tr:nth-child(1) > td:nth-child(2) > div > div > span.t-input'), 'should click the Entity Type' );
    await assert.isFulfilled( page.click( '.t-animation-container > div > ul> li:nth-child(2)', 'Dataset'), 'should enter name Dataset' );

    // Wait for Title Selection Container
    await assert.isFulfilled(page.waitForSelector('#titleSelectionContainer > a'));

    if (skipped.indexOf('schema.node')>=0){
      if(skipped==='schema.node.title'){
        // find, wait and select the Description Node
        await assert.isFulfilled(page.waitForSelector('#descriptionSelectionContainer > a'));
        await assert.isFulfilled(page.click('#descriptionSelectionContainer > a'), 'Should Click Title Selection Container button');
        await assert.isFulfilled(page.waitForXPath('//td[contains(., "BillTo/city")]').then(selector => selector.click()));
        await assert.isFulfilled(page.click('#submitToSelectanodeforthedescription'), 'Should Click Select button');
        await assert.isFulfilled(page.click('#nextBt'), 'should click next button');
      }
      if(skipped==='schema.node.description'){
        // find, click and select the Title node for the Title Selection Container
        await assert.isFulfilled(page.click('#titleSelectionContainer > a'), 'Should Click Title Selection Container button');
        await assert.isFulfilled(page.waitForXPath('//td[contains(., "ShipTo/state")]').then(selector => selector.click()));
        await assert.isFulfilled(page.click('#submitToSelectanodeforthetitle'), 'Should Click Select button');
      }
      // wait for next button
      await assert.isFulfilled(page.waitForSelector('#nextBt'));
      // click next button
      await assert.isFulfilled(page.click('#nextBt'), 'should click next button');
      const checkErrMsg = await elements.hasErrors(page, '#ImportMetadataStructureSetParameters > div.wizardStep_Error.stepper > div > ul > li');
      await page.screenshot({path: `./test/BEXIS2_MetaData_Schema/${skipped}Error.png`});
      assert.isTrue(checkErrMsg, 'should show an error');
      return;
    }

    // click Next button
    await assert.isFulfilled(page.click('#nextBt'), 'Should Click Next button');

    // wait and click finish button
    await assert.isFulfilled(page.waitForSelector('#finishBt'));
    await assert.isFulfilled(page.click('#finishBt'), 'Should Click Next button');

    // wait and click last page
    await assert.isFulfilled(page.waitForSelector('#metadataStructuresGrid > div > div.t-pager.t-reset > a:nth-child(5) > span'));
    await assert.isFulfilled(page.click('#metadataStructuresGrid > div > div.t-pager.t-reset > a:nth-child(5) > span'), 'Should Click Last Page button');

    // find created Metadata and Assert it True
    await assert.isFulfilled(page.waitForSelector('#metadataStructuresGrid > table > tbody'));
    assert.isFulfilled(page.$x('//td[contains(., "'+schemaName+'")]'));
    return;
  }
  );
}