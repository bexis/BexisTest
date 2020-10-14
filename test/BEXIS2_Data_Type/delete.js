import Browser from '../../util/Browser';
import util from '../../util/common';
import { assert } from 'chai';
import elements from '../../util/common/elements';
import dataElements from './dataTypesElements';

describe('Delete Data Type', ()=> {

  before( async() => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if (!(await util.login.isLoggedIn(page))) {
      await assert.isFulfilled(util.login.loginUser(page), 'should login');
    }
    //creates a data type
    await assert.isFulfilled(dataElements.createDataType(page, util, elements, dataElements, assert, 'data.test.name', 'data.test.desc'), 'should create a new data type');
  });

  it('should cancel the deletion of data type', async ()=> {

    const page = await Browser.openTab();

    // make sure we are logged in
    if (!(await util.login.isLoggedIn(page))) {
      await assert.isFulfilled(util.login.loginUser(page), 'should login');
    }

    // navigate to "Manage Data Types"
    await assert.isFulfilled(util.menu.select(page, 'Manage Data Types'), 'should open manage data types page');

    // wait for button Create Data Type is loaded in view model
    await assert.isFulfilled(page.waitForSelector('body > div.main-content.container-fluid > table > tbody > tr > td > div > div.bx-rpm-buttons > a', { visible: true }), 'should wait for button create data type');

    //filter Description Name of the data type
    await assert.isFulfilled(dataElements.filterDescription(page, elements, 'data.test.desc'), 'should filter description name of the data type');

    // after clicking delete icon alert box is shown -> click Cancel
    page.on('dialog', async dialog => { await dialog.dismiss(); });

    // click delete button
    await page.click('#bx-rpm-dataTypeGrid > table > tbody > tr > td:nth-child(6) > div > a.bx.bx-grid-function.bx-trash');

    // check for an entry by Description Name in the list of data types
    const checkEntry = await elements.hasEntry(page, '#bx-rpm-dataTypeGrid > table > tbody > tr', 'data.test.desc', '5');
    assert.isTrue(checkEntry, 'should contain the data type in the table');
  });

  it('should delete a data type', async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if (!(await util.login.isLoggedIn(page))) {
      await assert.isFulfilled(util.login.loginUser(page), 'should login');
    }

    // deletes a data type
    await assert.isFulfilled(dataElements.deleteDataType(page, util, assert, elements, 'data.test.desc'), 'should delete the new data type');
  });
});