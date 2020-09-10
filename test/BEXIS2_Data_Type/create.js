import Browser from '../../util/Browser';
import util from '../../util/common';
import { assert } from 'chai';
import elements from '../../util/common/elements';
import dataElements from './dataTypesElements';

describe('Create Data Type', () => {

  after( async() => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
    }

    await assert.isFulfilled(dataElements.deleteDataType(page, util, assert, elements, 'data.test.desc'), 'should delete the new data type');
  });

  it('should not create a new data type -- name field is skipped', async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if (!(await util.login.isLoggedIn(page))) {
      await assert.isFulfilled(util.login.loginUser(page), 'should login');
    }

    // navigate to "Manage Data Types"
    await assert.isFulfilled(util.menu.select(page, 'Manage Data Types'), 'should open manage data types page');

    // wait for button Create Data Type is loaded in view model
    await assert.isFulfilled(page.waitForSelector('body > div.main-content.container-fluid > table > tbody > tr > td > div > div.bx-rpm-buttons > a', { visible: true }), 'should wait for button create data type');

    // click Create Data Type button
    await assert.isFulfilled(page.click('body > div.main-content.container-fluid > table > tbody > tr > td > div > div.bx-rpm-buttons > a'), 'should click create data type button');

    // wait for Data Type Window is loaded in view model
    await assert.isFulfilled(page.waitForSelector('#DataTypeWindow', { visible: true }), 'should wait for data type window');

    // find Description field and type a description for a data type
    const dataTypeDescName = 'data.test.skip';
    await assert.isFulfilled(elements.typeInputField(page, '#dataType_Description', 'data.test.skip'), 'should enter a data type description');

    // screenshot of data type window for Description Name
    await page.screenshot({path: './test/BEXIS2_Data_Type/DT_Screenshots/dataTypeDescName.png'});

    // select a random value for System Type
    await assert.isFulfilled(dataElements.chooseOptionValue(page, '#systemType option', 'systemType'), 'should select a random value for system type');

    // click Save button
    await assert.isFulfilled(page.click('#saveButton'), 'should fail to save the new data type');

    // after saving a data type, data type window should still be in view model
    await assert.isFulfilled(page.waitForSelector('#DataTypeWindow', { visible: true }));

    // check error messages of the data type window
    // should have an error message -> invalid name
    const checkErrMsg = await elements.hasErrors(page, '#name > td.bx-errorMsg');
    assert.isTrue(checkErrMsg, 'should show an error - invalid name');

    // check for an entry by Description Name in the list of data types
    const checkEntry = await elements.hasEntry(page, '#bx-rpm-dataTypeGrid > table > tbody > tr', dataTypeDescName, '5');
    assert.isFalse(checkEntry, 'should not contain the new data type in the table');

    await page.screenshot({ path: './test/BEXIS2_Data_Type/DT_Screenshots/invalidNameError.png' });
  });

  it('should create a new data type', async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if (!(await util.login.isLoggedIn(page))) {
      await assert.isFulfilled(util.login.loginUser(page), 'should login');
    }
    await assert.isFulfilled(dataElements.createDataType(page, util, elements, dataElements, assert, 'data.test.name', 'data.test.desc'), 'should create a new data type');
  });
});

