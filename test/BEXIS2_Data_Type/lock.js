import Browser from '../../util/Browser';
import util from '../../util/common';
import { assert } from 'chai';
import elements from '../../util/common/elements';
import dataElements from './dataTypesElements';

describe('Lock Data Type', () => {

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
    await assert.isFulfilled(dataElements.deleteDataType(page, util, assert, elements, 'data.test.name', 'data.test.desc'), 'should delete the new data type');
  });

  it('should lock a non-locked data type', async ()=> {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
    }

    // navigate to "Manage Variable Templates"
    await assert.isFulfilled(util.menu.select(page, 'Manage Variable Templates'), 'should open manage variable templates page');

    // wait until the container is loaded in view mode
    await assert.isFulfilled(page.waitForSelector('#informationContainer', { visible: true }), 'wait for manage variable templates page');

    // click Create Variable Template button
    await assert.isFulfilled(page.click('body > div.main-content.container-fluid > table > tbody > tr > td > div > div.bx-rpm-buttons > a'), 'should click create variable template button');

    // wait template window is loaded in view mode
    await assert.isFulfilled(page.waitForSelector('#AttributeWindow', { visible: true }), 'wait for create variable template form');

    // find Name field
    await assert.isFulfilled(elements.typeInputField(page, '#Name', 'temp.test.name'), 'should enter a name');

    // screenshot of Name
    await page.screenshot({path: './test/BEXIS2_Data_Type/lockName.png'});

    // find Short Name field
    await assert.isFulfilled(page.type('#ShortName', 'temp.test.abv'), 'should enter a short name');

    // find Unit field
    await assert.isFulfilled(page.select('select[name="Unit.Id"]', '1'), 'should select none for unit field');

    // screenshot of Unit
    await page.screenshot({path: './test/BEXIS2_Data_Type/lockUnitNone.png'});

    // find Data Type field
    const option = (await page.$x(
      '//*[@name = "DataType.Id"]/option[text() = "data.test.name"]'
    ))[0];
    const value = await (await option.getProperty('value')).jsonValue();
    await assert.isFulfilled(page.select('#dataTypeId', value.toString()), 'should select a data type');

    // find Description field
    await assert.isFulfilled(elements.typeInputField(page, '#Description', 'data.test.desc'), 'should enter a description');

    // click Save button
    await assert.isFulfilled(page.click('#saveButton'), 'should save the new template');

    // wait until the container is loaded in view mode
    await assert.isFulfilled(page.waitForSelector('#informationContainer', { visible: true }), 'wait for manage variable templates page');

    // navigate to "Manage Data Types"
    await assert.isFulfilled(util.menu.select(page, 'Manage Data Types'), 'should open manage data types page');

    // wait for button Create Data Type is loaded in view model
    await assert.isFulfilled(page.waitForSelector('body > div.main-content.container-fluid > table > tbody > tr > td > div > div.bx-rpm-buttons > a', { visible: true }), 'should wait for button create data type');

    //filter Description Name of the data type
    await assert.isFulfilled(dataElements.filterDescription(page, elements, 'data.test.desc'), 'should filter description name of the data type');

    const disabledButton = await page.evaluate(() => {
      return (document.querySelector('.bx-disabled') != null) ? true : false;
    });

    // assertion is true if the Delete button is disabled
    assert.isTrue(disabledButton, 'The data type has to be locked.');

    // navigate to "Manage Variable Templates"
    await assert.isFulfilled(util.menu.select(page, 'Manage Variable Templates'), 'should open manage variable templates page');

    // wait until the container is loaded in view mode
    await assert.isFulfilled(page.waitForSelector('#informationContainer', { visible: true }), 'wait for manage variable templates page');

    // after clicking delete icon alert box is shown -> click Ok
    page.on('dialog', async dialog => { await dialog.accept(); });

    // click Delete button
    const deleteButton = await page.$$(('a[title*="temp.test.name"]'));
    await assert.isFulfilled(deleteButton[1].click(), 'should click the delete button');

    // wait until the container is loaded in view mode
    await assert.isFulfilled(page.waitForSelector('#informationContainer', { visible: true }), 'wait for manage variable templates page');

    // check for an entry by Name in the list of variable templates
    const checkEntry = await elements.hasEntry(page, '#bx-rpm-attributeGrid > table > tbody > tr', 'temp.test.name', '2');
    assert.isFalse(checkEntry, 'should not contain the template in the table');
  });
});
