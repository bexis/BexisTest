import Browser from '../../util/Browser';
import util from '../../util/common';
import { assert } from 'chai';
import elements from '../../util/common/elements';
import RBMElements from '../BExIS_Explos_RBM/RBMElements';

describe('Delete Booking', () => {

  before(async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
    }

    // books a resource
    await assert.isFulfilled(RBMElements.createBooking(page, util, elements, assert, 'any'), 'should book a new resource');
  });

  it('should delete a booking', async () => {

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

    // click Delete button
    await Promise.all([
      page.waitForNavigation(),
      page.click('#Content_Event > div.bx-footer.right > a:nth-child(3)'),
    ]);

    // wait that the controls are active
    await assert.isFulfilled(page.waitForSelector('#displayView.ready'), 'should wait until the controls are active');

    // click List button
    const listHandle = await page.evaluateHandle( () => document.querySelector( '#displayView input[value="List"]' ).parentNode );
    await assert.isFulfilled(listHandle.asElement().click(), 'should click list button');

    // wait for Resource Table Filter is loaded in view model
    await assert.isFulfilled(page.waitForSelector('#scheduleList #resources_table > tbody > tr', {visible:true}), 'should filter resource table');

    // click Show without history button
    await assert.isFulfilled(page.click('#history_no'), 'should click show without history button');

    // wait for Show with history to be visible
    await assert.isFulfilled(page.waitForSelector('#history_yes'), 'should wait for show with history to be active');

    // check for an entry by Description Name in the list of bookings
    const checkBooking= await elements.hasListing(page, '#resources_table > tbody > tr', 'booking.test.desc');
    assert.isFalse(checkBooking, 'should not contain the new booking in the table');
  });
});