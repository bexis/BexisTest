import Browser from '../../util/Browser';
import util from '../../util/common';
import { assert } from 'chai';
import units from './unitElements';

describe('Edit Unit', () => {

  // before starting the testing, create a new unit
  before(async () => {

    await assert.isFulfilled(units.createUnit(Browser, util, units, assert, 'unit.test.desc'), 'should create a new unit');
  });

  // after finishing the testing, delete the created unit
  after( async () => {

    await assert.isFulfilled(units.deleteUnit(Browser, units, util, 'Manage Units', '#information-container', '#bx-rpm-unitGrid', 'unit.test.desc'), 'should delete the created unit');
  });

  it('should edit the unit', async () => {

    const page = await Browser.openTab();

    // filter unit description in the table
    await assert.isFulfilled(units.filterDescription(page, util, 'Manage Units', '#information-container', '#bx-rpm-unitGrid', 'unit.test.desc'), 'should filter the unit description');

    // click the Edit icon
    await assert.isFulfilled(page.click('#bx-rpm-unitGrid > table > tbody > tr:nth-child(1) > td:nth-child(8) > div > a.bx.bx-grid-function.bx-edit'), 'should click the edit icon');

    // wait until the unit window is loaded in view mode
    await assert.isFulfilled(page.waitForSelector('#UintWindow', { visible: true }), 'wait for create unit form');

    // edit Name
    await assert.isFulfilled(page.type('#Unit_Name', 'new.'), 'should edit a name');

    // edit Abbreviation
    await assert.isFulfilled(page.type('#Unit_Abbreviation', 'new.'), 'should edit an abbreviation');

    // choose a Dimesion Name
    await assert.isFulfilled(units.chooseDimensionName(page), 'should choose a new dimension name');

    // choose a Data Type
    await assert.isFulfilled(units.chooseDataType(page), 'should choose a new data type');

    // click save button and wait for the navigation
    await Promise.all([
      page.waitForNavigation(),
      page.click('#saveButton'),
    ]);

    // wait until the table is loaded in view mode
    await page.waitForSelector('#bx-rpm-unitGrid > table > tbody > tr', { visible: true });

    // get the table content
    const tableContent = await units.returnTableContent(page);

    let elementContent = (content) => {
      return tableContent.includes(content);
    };

    // check if the edited unit is on the table or not
    assert.isTrue(elementContent('new.unit.test.name'), 'The edited unit should be on the table.');
  });
});