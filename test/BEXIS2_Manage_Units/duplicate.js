import Browser from '../../util/Browser';
import util from '../../util/common';
import { assert } from 'chai';
import units from './unitElements';
import elements from '../../util/common/elements';

describe('Duplicate Unit', () => {

  // before starting the test, create a new unit
  before(async () => {
    await assert.isFulfilled(units.createUnit(Browser, util, units, assert, 'unit.test.desc'), 'should create a new unit');

  });

  // after finishing the test, delete the created unit
  after(async () => {

    await assert.isFulfilled(units.deleteUnit(Browser, units, util, 'Manage Units', '#information-container', '#bx-rpm-unitGrid', 'unit.test.desc'), 'should delete the created unit');
  });

  it('should show an error, name and abbreviation already exist', async () => {

    const page = await Browser.openTab();

    // navigate to "Manage Units"
    await assert.isFulfilled(util.menu.select(page, 'Manage Units'), 'should open manage units page');

    // wait until the container is loaded in view mode
    await assert.isFulfilled(page.waitForSelector('#information-container', { visible: true }), 'wait for manage units page');

    // click Create Unit button
    await assert.isFulfilled(page.click('.bx-button'), 'should click Create Unit button');

    // wait until the unit window is loaded in view mode
    await assert.isFulfilled(page.waitForSelector('#UintWindow', { visible: true }), 'wait for create unit form');

    // find Name field
    await assert.isFulfilled(page.type('#Unit_Name', 'unit.test.name'), 'should enter a name');

    // find Abbreviation field
    await assert.isFulfilled(page.type('#Unit_Abbreviation', 'unit.test.abv'), 'should enter an abbreviation');

    // choose a value for Dimension Name
    await assert.isFulfilled(units.chooseDimensionName(page), 'should choose a dimension name');

    // choose a Data Type
    await assert.isFulfilled(units.chooseDataType(page), 'should choose a data type');

    // click save button and wait for the navigation
    await Promise.all([
      page.waitForNavigation(),
      assert.isFulfilled(page.click('#saveButton'), 'should fail to save the unit'),
    ]);

    // check if the Create Unit form is visible
    const isVisible = !!(await page.$('#UintWindow'));

    assert.isTrue(isVisible, 'Create unit form should be visible due to duplication.');
  });

  it('should not edit due to duplicate name', async () => {

    const page = await Browser.openTab();

    // navigate to "Manage Units"
    await assert.isFulfilled(util.menu.select(page, 'Manage Units'), 'should open manage units page');

    // wait until the container is loaded in view mode
    await assert.isFulfilled(page.waitForSelector('#information-container', { visible: true }), 'wait for manage units page');

    const tagContent = await page.evaluate(() => {
      return Array.from(document.getElementsByTagName('td'), element => element.innerText);
    });

    // click the filter button in the Description column
    await assert.isFulfilled(page.click('#bx-rpm-unitGrid > table > thead > tr > th:nth-child(7) > div'));

    // enter description of the unit into first input area on the dropdown
    await assert.isFulfilled(page.type('#bx-rpm-unitGrid > div.t-animation-container > div > input[type=text]:nth-child(4)', 'unit.test.desc'));

    // click the Filter button on the dropdown for finding the unit
    await assert.isFulfilled(page.click('#bx-rpm-unitGrid > div.t-animation-container > div > button.t-button.t-button-icontext.t-button-expand.t-filter-button'));

    // wait until the container is loaded in view mode
    await assert.isFulfilled(page.waitForSelector('#information-container', { visible: true }));

    // click the Edit icon
    await assert.isFulfilled(page.click('#bx-rpm-unitGrid > table > tbody > tr:nth-child(1) > td:nth-child(8) > div > a.bx.bx-grid-function.bx-edit'), 'should click the edit icon');

    // wait until the unit window is loaded in view mode
    await assert.isFulfilled(page.waitForSelector('#UintWindow', { visible: true }), 'wait for create unit form');

    // clears Name input field
    await elements.clearInputField(page, '#Unit_Name');

    // type name of the first unit on the table that already exists
    await assert.isFulfilled(page.type('#Unit_Name', tagContent[2].toString()), 'should enter a name');

    // click save button
    await Promise.all([
      page.waitForNavigation(),
      page.click('#saveButton'),
    ]);

    // check if the Create Unit form is visible
    const isVisible = !!(await page.$('#UintWindow'));

    assert.isTrue(isVisible, 'Create unit form should be visible due to duplication.');
  });
});