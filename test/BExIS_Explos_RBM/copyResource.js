import Browser from '../../util/Browser';
import util from '../../util/common';
import { assert } from 'chai';
import elements from '../../util/common/elements';
import RBMElements from './RBMElements';

describe('Copy Whole Resource', () => {

  before(async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
    }

    // books a resource
    await assert.isFulfilled(RBMElements.createBooking(page, util, elements, assert, 'no limitation'), 'should book a new resource');
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

  it('should copy a whole resource', async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
    }

    // navigate to "Calendar"
    await assert.isFulfilled(util.menu.select(page, 'Calendar'), 'should navigate to calendar page');

    // wait for Book Resource button is loaded in view model
    await assert.isFulfilled(page.waitForSelector('#Content_Filter > a', { visible: true }), 'should wait for book resource button');

    // wait for Booking button
    await assert.isFulfilled(page.waitForSelector('#contentView > label:nth-child(2)'), 'should wait for booking button');

    // click Booking button
    const bookingSwitch = await page.evaluateHandle(() => document.querySelector('#contentView input[value="Events"]').parentNode);
    await assert.isFulfilled(bookingSwitch.asElement().click(), 'should click booking button');

    // wait for Month button
    await assert.isFulfilled(page.waitForSelector('#calendar > div.fc-toolbar > div.fc-right > div > button.fc-month-button.fc-button.fc-state-default.fc-corner-left'), 'should wait for month button');

    // click Month button
    await assert.isFulfilled(page.click('#calendar > div.fc-toolbar > div.fc-right > div > button.fc-month-button.fc-button.fc-state-default.fc-corner-left'), 'should click month button');

    // wait for Month button to be active
    await assert.isFulfilled(page.waitForFunction(() => !!document.querySelector('#calendar > div.fc-toolbar > div.fc-right > div > button.fc-month-button.fc-button.fc-state-default.fc-corner-left.fc-state-active')), 'should wait for month button to be active');

    // eslint-disable-next-line no-console
    console.log('Booking: Passed navigation to month view...');

    // wait for Calendar to appear
    await assert.isFulfilled(page.waitForSelector('#calendar .fc-event'), 'should wait for calendar');

    // wait that the controls are active
    await assert.isFulfilled(page.waitForSelector('#displayView.ready'), 'should wait for controls to be active');

    // get the event contents (booking info) from the calendar
    const eventText = await RBMElements.eventContent(page, '#calendar .fc-title');

    // check if the booking appears on the calendar view
    const bookingName = eventText.some(event => event.includes('booking.test.name'));
    assert.isTrue(bookingName, 'the new booking should exist on the calendar');

    // click the booking on the calendar
    await assert.isFulfilled(elements.clickAnyElementByText(page, 'booking.test.name'), 'should click the booked event on the calendar');

    // wait for navigation after clicking the booked resource on the calendar
    await assert.isFulfilled(page.waitForNavigation(), 'should wait for the navigation');

    // wait for Edit button is loaded in view model
    await assert.isFulfilled(page.waitForSelector('#edit', {visible:true}), 'should wait for edit button to appear');

    // click Edit button
    await Promise.all([
      page.waitForNavigation(),
      page.click('#edit'),
    ]);

    // click Copy whole resource
    const copyFilled = await page.$$('span[title="Copy the whole resource schedule"]');
    await assert.isFulfilled(copyFilled[0].click(), 'should click copy whole resource');

    await page.waitForTimeout(500);

    // wait for Save button is loaded in view model
    await assert.isFulfilled(page.waitForSelector('#Content_Event > div.bx-footer.right > a:nth-child(2)', {visible:true}), 'should wait for save button to appear');

    // click Save button
    await Promise.all([
      page.waitForNavigation(),
      page.click('#Content_Event > div.bx-footer.right > a:nth-child(2)'),
    ]);

    // navigate to list view
    await assert.isFulfilled(RBMElements.navigationToList(page, util), 'should navigate to the list view');

    // get the content from resources table in list view
    const listTableContent = await elements.tableContent2D(page, '#resources_table_wrapper tr');

    // filter the table content elements to make sure that we have the test booking
    const filterTableContent = listTableContent.filter(item => item.includes('booking.test.name'));

    // check if Start Date, End Date and Activities of the three resources are equal
    assert.equal(JSON.stringify(filterTableContent[0]), JSON.stringify(filterTableContent[1]), 'all corresponding field contents should be the same');
  });
});