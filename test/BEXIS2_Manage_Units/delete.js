import Browser from '../../util/Browser';
import util from '../../util/common';
import { assert } from 'chai';
import units from './unitElements';

require('./edit.js');

describe('Delete Unit', () => {

  it('should delete the unit', async () => {

    const page = await Browser.openTab();

    // filter unit description in the table
    await assert.isFulfilled(units.filterDescription(page, util));

    // after deleting alert box is shown -> click Ok
    page.on('dialog', async dialog => { await dialog.accept(); });

    // click the Delete icon to delete the unit
    await assert.isFulfilled(page.click('#bx-rpm-unitGrid > table > tbody > tr > td:nth-child(8) > div > a.bx.bx-grid-function.bx-trash'), 'should click the delete icon');
  });
});