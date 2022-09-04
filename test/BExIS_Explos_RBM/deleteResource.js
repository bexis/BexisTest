import Browser from '../../util/Browser';
import util from '../../util/common';
import { assert } from 'chai';
import elements from '../../util/common/elements';
import RBMElements from '../BExIS_Explos_RBM/RBMElements';

describe('Delete a Resource from Booking', () => {

  before(async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
    }

    // books a resource
    await assert.isFulfilled(RBMElements.createBooking(page, util, elements, assert), 'should book a new resource');
  });

  after( async() => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled(util.login.loginUser(page), 'should log in');
    }

    // deletes a booking
    await assert.isFulfilled(RBMElements.deleteBooking(page, util, elements, assert), 'should delete the new booking');
  });

  it('should delete a resource from a booking', async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
    }

    // navigate to "Calendar"
    await assert.isFulfilled(util.menu.select(page, 'Calendar'), 'should navigate to calendar page');

    // wait for Book Resource button is loaded in view model
    await assert.isFulfilled(page.waitForSelector('#Content_Filter > a', { visible: true }), 'should wait for book resource button');

    // click List button
    const listSwitch = await page.evaluateHandle(() => document.querySelector( '#displayView input[value="List"]' ).parentNode);
    await assert.isFulfilled(listSwitch.asElement().click(), 'should click list button');

    // wait for Resource Table Filter is loaded in view model
    await assert.isFulfilled(page.waitForSelector('#scheduleList #resources_table > tbody > tr', {visible:true}), 'should filter resource table');

    // click Show without history button
    await assert.isFulfilled(page.click('#history_no'), 'should click show without history button');

    // wait for Show with history to be active
    await assert.isFulfilled(page.waitForSelector('#history_yes'), 'should wait for show with history to be active');

    // search for the booking by name
    await assert.isFulfilled(page.type('#resources_table_filter > label > input[type=search]', 'booking.test.name'), 'should enter the booking name');

    // click the booked resource on its name
    await Promise.all([
      page.waitForNavigation(),
      page.click('#resources_table > tbody > tr > td:nth-child(1) > a'),
    ]);

    // wait for Open Calendar icon is loaded in view model
    await assert.isFulfilled(page.waitForSelector('#Content_Event > div.bx-footer.right > a:nth-child(3)', {visible:true}), 'should wait for open calendar icon');

    // click Edit button
    await Promise.all([
      page.waitForNavigation(),
      page.click('#edit'),
    ]);

    // wait for add more resources button is loaded in view model
    await assert.isFulfilled(page.waitForSelector('#Content_Event > a'), 'should wait for add more resources button');

    // click Add more resources button
    await Promise.all([
      page.waitForNavigation(),
      page.click('#Content_Event > a'),
    ]);

    // wait for the first Select Resource button is loaded in view model
    await assert.isFulfilled(page.waitForSelector('#resourcesTable > tbody > tr:nth-child(1) > td:nth-child(3) > span', {visible: true}), 'should wait for select resource button');

    // click to add the first resource from the Available Resources table
    await assert.isFulfilled(page.click('#resourcesTable > tbody > tr:nth-child(1) > td:nth-child(3) > span'), 'should add a second resource to the resource cart');

    // wait for the second resource to appear on Selected Resources cart
    await assert.isFulfilled(page.waitForSelector('#ResourceCart > div > table > tbody > tr:nth-child(3) > td', {visible: true}), 'should wait for the second resource to appear on the resources cart');

    // wait for Continue booking button to be loaded in view model
    await assert.isFulfilled(page.waitForSelector('#ResourceCart > a', {visible: true}), 'should wait for continue booking button');

    // click Continue booking button
    await Promise.all([
      page.waitForNavigation(),
      page.click('#ResourceCart > a'),
    ]);

    // wait for Open Calendar icon is loaded in view model
    await assert.isFulfilled(page.waitForSelector('#Start_1', {visible:true}), 'should wait for open calendar icon');

    // click Copy filled values to other from the first resource
    const copyFilled = await page.$$('span[title="Use filled values for all other schedules"]');
    copyFilled[0].click();

    // -----> needs better solution
    await assert.isFulfilled(page.waitForTimeout(2000));

    // wait for the second resource header and click it
    await assert.isFulfilled(page.waitForSelector('#Content_Event > div:nth-child(4) > div.itemHeader').then(selector => selector.click()), 'should wait for expansion button then click it');

    await assert.isFulfilled(page.waitForFunction(() => document.querySelector('#\\34 .bx.fa-angle-double-down')), 'wait for arrow icon to be down');

    // wait for the second resource details to expand
    await assert.isFulfilled(page.waitForSelector('#scheduleDetails_4', {visible:true}), 'should wait for the second resource window to expand');

    // get name of the second resource
    const secondResText = await page.$eval('#Content_Event > div:nth-child(4) > div.itemHeader > b', (el) => el.textContent.trim());

    // check if the second resource is added to the booking
    assert.strictEqual(secondResText, 'Binocular (ALB)', 'the second resource should be Binocular (ALB)');

    // wait for delete icons on the resources
    await assert.isFulfilled(page.waitForSelector('span[title="Remove schedule from event"]'), 'should wait for delete icons');
    const deleteIcon = await page.$$('span[title="Remove schedule from event"]');

    // after clicking delete icon alert box is shown -> click Ok
    page.on('dialog', async dialog => { await dialog.accept(); });

    // click the delete icon for the first resource to delete it
    await deleteIcon[0].click();

    // wait for the first resource to be removed
    await page.waitForFunction(() => !document.querySelector('#scheduleDetails_1'), 'should wait for details of the first resource details to be null');

    // check if the the first resource is deleted or not. Details of the first resource shouldn't exist anymore.
    const firstRes =  await page.$('#scheduleDetails_1');
    assert.isNull(firstRes, 'the first resource should not exist by being null');

    // click Save button
    await Promise.all([
      page.waitForNavigation(),
      page.click('#Content_Event > div.bx-footer.right > a:nth-child(2)'),
    ]);
  });
});