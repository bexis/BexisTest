/* eslint-disable no-console */
import Browser from '../../util/Browser';
import util from '../../util/common';
import { assert } from 'chai';
import elements from '../../util/common/elements';
import RBMElements from './RBMElements';

describe('Edit Booking', () => {

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

  it('should edit a booking', async() => {

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

    // wait for Edit button is loaded in view model
    await assert.isFulfilled(page.waitForSelector('#edit', {visible:true}), 'should wait for edit button to appear');

    // click Edit button
    await Promise.all([
      page.waitForNavigation(),
      page.click('#edit'),
    ]);

    // wait for Calendar icon is loaded in view model
    await assert.isFulfilled(page.waitForSelector('#timePeriod_1 > tr:nth-child(1) > td:nth-child(2) > div > div > span > span', {visible:true}), 'should wait for calendar icon');

    console.log('Passed Clicking Edit...');
    // edit Reason
    const reasonSelector = '.fa-plus';
    if (await page.$(reasonSelector) !== null) {

      //click to remove activity
      await assert.isFulfilled(page.waitForSelector('#removeActivity'), 'should wait remove icon');
      await assert.isFulfilled(page.click('#removeActivity'), 'should remove an activity');

      // click add reason button
      await assert.isFulfilled(page.click('.fa-plus'), 'should click add reason button');

      // wait for Select Activities window is loaded in view model
      await assert.isFulfilled(page.waitForSelector('#Window_ChooseActivities', {visible:true}), 'should wait for select activities window');

      // click a random checkbox for Select column
      const selectCheckbox = await page.$$('input[type="checkbox"]');
      const randomCheckbox = Math.floor(Math.random() * selectCheckbox.length) + 1;
      selectCheckbox[randomCheckbox].click();

      await assert.isFulfilled(page.screenshot({path:'activities.png'}));

      // click Add activities to schedule
      await assert.isFulfilled(page.waitForSelector('#Content_ChooseActivities > div > div.bx-rpm-submit.bx-rpm-buttons > button'), 'should wait for the add activities to schedule button');
      await assert.isFulfilled(page.click('#Content_ChooseActivities > div > div.bx-rpm-submit.bx-rpm-buttons > button'), 'should click add activities to schedule button');

      // wait for remove activity to be found in view model
      await assert.isFulfilled(page.waitForSelector('#removeActivity', {visible:true}), 'should wait for remove activity icon to be visible');
    }

    console.log('Passed Editing Reason...');

    // wait for Name input
    await assert.isFulfilled(page.waitForSelector('#Name'), 'should wait for name input');

    // find Name field
    await assert.isFulfilled(page.type('#Name', 'edit.'), 'should enter a name');

    // wait for Description input
    await assert.isFulfilled(page.waitForSelector('#Description'), 'should wait for description input');

    // find Description field
    await assert.isFulfilled(page.type('#Description', 'edit.'), 'should enter a description');

    await assert.isFulfilled(page.screenshot({path:'edit.png'}));

    // click Save button
    await Promise.all([
      page.waitForNavigation(),
      page.click('#Content_Event > div.bx-footer.right > a:nth-child(2)'),
    ]);

    console.log('Passed Saving...');

    // click Month button
    await assert.isFulfilled(page.click('#calendar > div.fc-toolbar > div.fc-right > div > button.fc-month-button.fc-button.fc-state-default.fc-corner-left'));

    // wait for Calendar to appear
    await assert.isFulfilled(page.waitForSelector('#calendar .fc-event'), 'should wait for calendar event to appear');

    // wait that the controls are active
    await assert.isFulfilled(page.waitForSelector('#displayView.ready'), 'should wait for the controls to be active');

    // click List button
    const lSwitch = await page.evaluateHandle(() => document.querySelector( '#displayView input[value="List"]' ).parentNode);
    await assert.isFulfilled(lSwitch.asElement().click(), 'should click list button');

    // wait for Resource Table Filter is loaded in view model
    await assert.isFulfilled(page.waitForSelector('#scheduleList #resources_table > tbody > tr', {visible:true}), 'should wait for resource table filter');

    // click Show without history button
    const clickHistory = await page.waitForSelector('#history_no');
    await assert.isFulfilled(clickHistory.click(), 'should click history button');

    // wait for Show with history to be visible
    await assert.isFulfilled(page.waitForSelector('#history_yes', {visible:true}));

    // check for an entry by Description Name in the list of bookings
    const checkEntry = await elements.hasEntry(page, '#resources_table > tbody > tr', 'edit.booking.test.desc', '2');
    assert.isTrue(checkEntry, 'should contain the edited description in the table');
  });
});