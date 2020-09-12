import Browser from '../../util/Browser';
import util from '../../util/common';
import { assert } from 'chai';
import elements from '../../util/common/elements';
import dataElements from './dataTypesElements';

describe('Duplicate Data Type', () => {

  before( async() => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if (!(await util.login.isLoggedIn(page))) {
      await assert.isFulfilled(util.login.loginUser(page), 'should login');
    }

    //create a data type
    await assert.isFulfilled(dataElements.createDataType(page, util, elements, dataElements, assert, 'data.test.name', 'data.test.desc'), 'should create a new data type');
  });

  after( async() => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
    }

    // delete a data type
    await assert.isFulfilled(dataElements.deleteDataType(page, util, assert, elements, 'data.test.desc'), 'should delete the new data type');
  });

  it('should show an error due to duplication, name already exist ', async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
    }

    // navigate to "Manage Data Types"
    await assert.isFulfilled(util.menu.select(page, 'Manage Data Types'), 'should open manage data types page');

    // wait for button Create Data Type is loaded in view model
    await assert.isFulfilled(page.waitForSelector('body > div.main-content.container-fluid > table > tbody > tr > td > div > div.bx-rpm-buttons > a', { visible: true }), 'should wait for button create data type');

    // click Create Data Type button
    await assert.isFulfilled(page.click('body > div.main-content.container-fluid > table > tbody > tr > td > div > div.bx-rpm-buttons > a'), 'should click create data type button');

    // wait for Data Type Window is loaded in view model
    await assert.isFulfilled(page.waitForSelector('#DataTypeWindow', { visible: true }), 'should wait for data type window');

    // find Name field
    await assert.isFulfilled(elements.typeInputField(page, '#dataType_Name', 'data.test.name'), 'should type a data type name');

    // find Description field
    await assert.isFulfilled(page.type('#dataType_Description', 'data.test.desc'), 'should type a description name');

    // select a random value for System Type
    await assert.isFulfilled(dataElements.chooseOptionValue(page, '#systemType option', 'systemType'), 'should select a random value for system type');

    // click Save button
    await assert.isFulfilled(page.click('#saveButton'), 'should fail to save the duplicate data type');

    // wait for Data Type Window is loaded in view model
    await assert.isFulfilled(page.waitForSelector('#DataTypeWindow', { visible: true }), 'should wait for data type window');

    // screenshot of error message on data type window
    await page.screenshot({ path: './test/BEXIS2_Data_Type/dupeNameCreate.png' });

    // check error messages of the data type window
    // should have an error message -> invalid name
    const checkErrMsg = await elements.hasErrors(page, '#name > td.bx-errorMsg');
    assert.isTrue(checkErrMsg, 'should show an error - Name already exist');
  });

  it('should not edit due to duplicate name', async ()=> {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
    }

    // navigate to "Manage Data Types"
    await assert.isFulfilled(util.menu.select(page, 'Manage Data Types'), 'should open manage data types page');

    // wait for button Create Data Type is loaded in view model
    await assert.isFulfilled(page.waitForSelector('body > div.main-content.container-fluid > table > tbody > tr > td > div > div.bx-rpm-buttons > a', { visible: true }), 'should wait for button create data type');

    const tagContent = await page.evaluate(() => {
      return Array.from(document.getElementsByTagName('td'), element => element.innerText.trim());
    });

    //filter Description Name of the data type
    await assert.isFulfilled(dataElements.filterDescription(page, elements, 'data.test.desc'), 'should filter description name of the data type');

    // click edit button
    await assert.isFulfilled(page.click('#bx-rpm-dataTypeGrid > table > tbody > tr > td:nth-child(6) > div > a.bx.bx-grid-function.bx-edit'), 'should click edit button');

    // wait for Data Type Window is loaded in view model
    await assert.isFulfilled(page.waitForSelector('#DataTypeWindow', { visible: true }), 'should wait for data type window');

    // clears Name input field
    await assert.isFulfilled(elements.clearInputField(page, '#dataType_Name'), 'should clear name input field');

    // type name of the first unit on the table that already exists
    await assert.isFulfilled(elements.typeInputField(page, '#dataType_Name',  tagContent[2].toString()), 'should enter a existing name from the table');

    // click Save button
    await assert.isFulfilled(page.click('#saveButton'), 'should fail to save the duplicate data type');

    // wait for Data Type Window is loaded in view model
    await assert.isFulfilled(page.waitForSelector('#DataTypeWindow', { visible: true }), 'should wait for data type window');

    // screenshot of error message on data type window
    await page.screenshot({ path: './test/BEXIS2_Data_Type/dupeNameEdit.png' });

    // check error messages of the data type window
    // should have an error message -> invalid name
    const checkErrMsg = await elements.hasErrors(page, '#name > td.bx-errorMsg');
    assert.isTrue(checkErrMsg, 'should show an error - Name already exist');
  });

});
