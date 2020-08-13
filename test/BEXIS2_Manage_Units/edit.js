import Browser from '../../util/Browser';
import util from '../../util/common';
import { assert } from 'chai';
import units from './unitElements';

require('./create.js');

describe('Edit Unit', () => {

  it('should edit the unit', async () => {

    const page = await Browser.openTab();

    // filter unit description in the table
    await assert.isFulfilled(units.filterDescription(page, util));

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

    // save the edited unit
    await assert.isFulfilled(page.click('#saveButton'), 'should save the edited unit');
  });
});