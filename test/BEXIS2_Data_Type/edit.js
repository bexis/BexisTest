import Browser from '../../util/Browser';
import util from '../../util/common';
import { assert } from 'chai';
import elements from '../../util/common/elements';
import dataElements from './dataTypesElements';

describe('Edit Data Type', () => {

  before( async() => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if (!(await util.login.isLoggedIn(page))) {
      await assert.isFulfilled(util.login.loginUser(page), 'should login');
    }
    //creates a data type
    await assert.isFulfilled(dataElements.createDataType(page, util, elements, dataElements, assert, 'data.test.name', 'data.test.desc'), 'should create a new data type');
  });

  after( async() => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
    }

    await assert.isFulfilled(dataElements.deleteDataType(page, util, assert, elements, 'data.test.desc'), 'should delete the new data type');
  });

  it('should edit a data type', async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
    }

    // navigate to "Manage Data Types"
    await assert.isFulfilled(util.menu.select(page, 'Manage Data Types'), 'should open manage data types page');

    // wait for button Create Data Type is loaded in view model
    await assert.isFulfilled(page.waitForSelector('body > div.main-content.container-fluid > table > tbody > tr > td > div > div.bx-rpm-buttons > a', { visible: true }), 'should wait for button create data type');

    //filter Description Name of the data type
    await assert.isFulfilled(dataElements.filterDescription(page, elements, 'data.test.desc'), 'should filter description name of the data type');

    // click edit button
    await assert.isFulfilled(page.click('#bx-rpm-dataTypeGrid > table > tbody > tr > td:nth-child(6) > div > a.bx.bx-grid-function.bx-edit'), 'should click edit button');

    // wait for Data Type Window is loaded in view model
    await assert.isFulfilled(page.waitForSelector('#DataTypeWindow', { visible: true }), 'should wait for data type window');

    // find Name field and type a name for data type
    await assert.isFulfilled(elements.typeInputField(page, '#dataType_Name', 'new.data.test.name'), 'should type a new data type name');

    // screenshot of data type name
    await page.screenshot({path: './test/BEXIS2_Data_Type/DT_Screenshots/editDataTypeName.png'});

    // select a random value for System Type
    await assert.isFulfilled(dataElements.chooseOptionValue(page, '#systemType option', 'systemType'), 'should select a random value for system type');

    // screenshot of data type window before save
    await page.screenshot({path: './test/BEXIS2_Data_Type/editDataTypeWindow.png'});

    // click Save button
    await assert.isFulfilled(page.click('#saveButton'), 'should save the edited data type');

    // after saving a data type data type window shouldn't be in view model
    await assert.isFulfilled(page.waitForSelector('#DataTypeWindow', { visible: false }), 'should wait for data type window to disappear');

    // check for an entry by Description Name in the list of data types
    const checkEntry = await elements.hasEntry(page, '#bx-rpm-dataTypeGrid > table > tbody > tr', 'new.data.test.name', '2');
    assert.isTrue(checkEntry, 'should contain the data type in the table');
  });
});
