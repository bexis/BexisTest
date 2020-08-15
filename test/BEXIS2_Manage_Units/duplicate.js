import Browser from '../../util/Browser';
import util from '../../util/common';
import { assert } from 'chai';
import units from './unitElements';

require('./create.js');

describe('Duplicate Unit', () => {
  it('should show an error name and abbreviation already exist', async () => {

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

    // find Description field
    await assert.isFulfilled(page.type('#Unit_Description', 'unit.test.desc.dup'), 'should enter a description');

    // choose a value for Dimension Name
    await assert.isFulfilled(units.chooseDimensionName(page), 'should choose a dimension name');

    // choose a Data Type
    await assert.isFulfilled(units.chooseDataType(page), 'should choose a data type');

    // click Save button
    await assert.isFulfilled(page.click('#saveButton'), 'should save the new unit');
  });
});

