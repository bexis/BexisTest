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

    await assert.isFulfilled(dataElements.deleteDataType(page, util, assert, elements), 'should delete the new data type');
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
    const dataTypeDesc = 'data.test.skip';
    await assert.isFulfilled(page.type('#dataType_Description', dataTypeDesc), 'should enter a data type description');

    // select a random value for System Type
    await assert.isFulfilled(dataElements.chooseOptionValue(page, '#systemType option', 'systemType'), 'should select a random value for system type');

    // click Save button
    await assert.isFulfilled(page.click('#saveButton'), 'should fail to save the new data type');

    // after saving a data type, data type window should still be in view model
    await assert.isFulfilled(page.waitForSelector('#DataTypeWindow', { visible: true }));

    // check error messages of the data type window
    // should have an error message -> invalid name
    const hasErrors = await page.evaluate(() => Array.from(document.querySelectorAll('#name > td.bx-errorMsg')).some((el) => el.textContent.trim()));

    assert.isTrue(hasErrors, 'should show an error - invalid name');

    // check for the new entry in the list of data types
    const hasDataType = await page.$$eval('#bx-rpm-dataTypeGrid > table > tbody > tr', (rows, dataTypeDesc) => {
      return rows.some((tr) => tr.querySelector('td:nth-child(5)').textContent.trim() == dataTypeDesc);
    }, dataTypeDesc);

    assert.isFalse(hasDataType, 'should not contain the new data type in the table');

    await page.screenshot({ path: 'Error.png' });
  });

  it('should create a new unit', async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if (!(await util.login.isLoggedIn(page))) {
      await assert.isFulfilled(util.login.loginUser(page), 'should login');
    }
    await assert.isFulfilled(dataElements.createDataType(page, util, elements, dataElements, assert, 'data.test.name'));
  });
});

