import Browser from '../../util/Browser';
import util from '../../util/common';
import { assert } from 'chai';
import elements from '../../util/common/elements';
import EMMElements from './EMMElements';

describe('Create Event', () => {

  after( async() => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled(util.login.loginUser(page), 'should log in');
    }

    // deletes an event
    await assert.isFulfilled(EMMElements.deleteEvent(page, util, assert, elements, 'event.test.name'), 'should delete the event');
  });

  createEventTest('eventName');
  createEventTest('eventPeriod');
  createEventTest('importantInfo');
  createEventTest('eventLanguage');
  createEventTest('calendar');
  createEventTest('limit');
  createEventTest('password');

  it('should create an event', async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
    }

    // creates an event
    await assert.isFulfilled(EMMElements.createEvent(page, util, elements, assert, 'event.test.name', true), 'should create a new event');
  });
});

/**
   * create a test for Event Management with required field not filled until all fields filled
   *
   * @param   {String}    skipped     field to be left empty
   */

async function createEventTest(skipped) {

  it(`should show an error message when ${skipped} is missing`, async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if (!(await util.login.isLoggedIn(page))) {
      await assert.isFulfilled(util.login.loginUser(page), 'should login');
    }

    // navigate to "Manage Events"
    await assert.isFulfilled(util.menu.select(page, 'Manage Events'), 'should open manage events page');

    // wait for button Create new Event is loaded in view model
    await assert.isFulfilled(page.waitForSelector('body > div.main-content.container-fluid > table > tbody > tr > td > div > a', { visible: true }), 'should wait for button create new event');

    // click Create new Event button
    await Promise.all([
      page.waitForNavigation(),
      page.click('body > div.main-content.container-fluid > table > tbody > tr > td > div > a'),
    ]);

    if (!('eventName' == skipped)) {

      // wait for Event name field
      await assert.isFulfilled(page.waitForSelector('#Name'), 'should wait for event name field');

      // find Event name field
      await assert.isFulfilled(page.type('#Name', 'event.test.name'), 'should enter a name');
    }

    if (!('eventPeriod') == skipped) {

      // wait for Event time period and time field
      await assert.isFulfilled(page.waitForSelector('#EventDate'), 'should wait for event time period and time field');

      // find Event time period and time field
      await assert.isFulfilled(page.type('#EventDate', 'event.test.timePeriod'), 'should enter an event time period and time');
    }

    if (!('importantInfo') == skipped) {

      // wait for Important information field
      await assert.isFulfilled(page.waitForSelector('#ImportantInformation'), 'should wait for important information field');

      // find Important information field
      await assert.isFulfilled(page.type('#ImportantInformation', 'event.test.importantInfo'), 'should enter an important information');
    }

    if (!('eventLanguage') == skipped) {

      // wait for Event language field
      await assert.isFulfilled(page.waitForSelector('#EventLanguage'), 'should wait for event language field');

      // find Event language field
      await assert.isFulfilled(page.type('#EventLanguage', 'event.test.lang'), 'should enter an event language');
    }

    // click Calendar icon for a Start date
    await assert.isFulfilled(page.click('body > div.main-content.container-fluid > table > tbody > tr > td > div > form > table > tbody > tr:nth-child(5) > td:nth-child(2) > div > div > span > span'), 'should click calendar icon for a start date');

    // wait for calendar container to be visible (margin-top: 0px)
    await assert.isFulfilled(page.waitForFunction(() => getComputedStyle(document.querySelector('body > div.t-animation-container > div')).getPropertyValue('margin-top') === '0px'), 'should wait for calendar container to be visible');

    // click a random day on current month for a start date
    const startDays = await page.$$('body > div.t-animation-container > div > table > tbody > tr > td:not(.t-other-month)');

    // startDays.length - 2 --> it is for a gap between start and end date
    const randomStartDays = Math.floor(Math.random() * (startDays.length - 2)) + 1;
    startDays[randomStartDays].click();

    // after a clicking a random date on calendar wait for calendar container to be hidden (margin-top: -316px)
    await assert.isFulfilled(page.waitForFunction(() => getComputedStyle(document.querySelector('body > div.t-animation-container > div')).getPropertyValue('margin-top') === '-316px'), 'should wait for calendar container to be hidden');

    // click Calendar icon for Deadline
    await assert.isFulfilled(page.click('body > div.main-content.container-fluid > table > tbody > tr > td > div > form > table > tbody > tr:nth-child(6) > td:nth-child(2) > div > div > span > span'), 'should click calendar icon for deadline');

    // wait for calendar container to be visible (margin-top: 0px)
    await assert.isFulfilled(page.waitForFunction(() => getComputedStyle(document.querySelector('body > div.t-animation-container > div')).getPropertyValue('margin-top') === '0px'), 'should wait for calendar container to be visible');

    // click a random day on current month for an end date
    const endDays = await page.$$('body > div.t-animation-container > div > table > tbody > tr > td:not(.t-other-month)');

    let splicedEndDays;
    if ('calendar' == skipped) {

      // reverse and remove days so it picks past date
      splicedEndDays = endDays.reverse().splice((endDays.length - randomStartDays));
    } else {

      // remove days until the start date for not picking a past date
      splicedEndDays = endDays.splice(randomStartDays);
    }

    // click a random date in spliced array
    splicedEndDays[Math.floor(Math.random() * splicedEndDays.length)].click();

    // after a clicking a random date on calendar wait for calendar container to be hidden (margin-top: -316px)
    await assert.isFulfilled(page.waitForFunction(() => getComputedStyle(document.querySelector('body > div.t-animation-container > div')).getPropertyValue('margin-top') === '-316px'), 'should wait for calendar container to be hidden');

    if(!('limit' == skipped)) {

      // wait for Participants limitation field
      await assert.isFulfilled(page.waitForSelector('#ParticipantsLimitation'), 'should wait for participants limitation field');

      // find Participants limitation field
      await assert.isFulfilled(page.type('#ParticipantsLimitation', '4'), 'should enter a participants limitation');
    }

    if(!('password' == skipped)) {

      // wait for Event password field
      await assert.isFulfilled(page.waitForSelector('#LogInPassword'), 'should wait for event password field');

      // find Event password field
      await assert.isFulfilled(page.type('#LogInPassword', 'eventPass'), 'should enter an event password');
    }

    // wait for CC email addresses field
    await assert.isFulfilled(page.waitForSelector('#EmailCC'), 'should wait for CC email addresses');

    // find CC email addresses field
    await assert.isFulfilled(page.type('#EmailCC', 'eventCC@example.com'), 'should enter a CC email address');

    // wait for BCC email addresses field
    await assert.isFulfilled(page.waitForSelector('#EmailBCC'), 'should wait for BCC email addresses');

    // find BCC email addresses field
    await assert.isFulfilled(page.type('#EmailBCC', 'eventBCC@example.com'), 'should enter a BCC email address');

    // wait for Reply to mail address field
    await assert.isFulfilled(page.waitForSelector('#EmailReply'), 'should wait for reply to mail address field');

    // find Reply to mail address field
    await assert.isFulfilled(page.type('#EmailReply', 'eventReply@example.com'), 'should enter a mail address');

    if ('limit' == skipped) {

      // click Save button --> after clicking there aren't navigation and error message
      await assert.isFulfilled(page.click('body > div.main-content.container-fluid > table > tbody > tr > td > div > form > div > button'), 'should click save button');

      // check if the field for participant limitation gets error class
      const errLimitClass = await page.evaluate(() => document.querySelector('#ParticipantsLimitation').className.trim());
      assert.equal(errLimitClass, 't-input input-validation-error', 'participant limitation should have t-input input-validation-error');

    } else {

      // click Save button
      await Promise.all([
        page.waitForNavigation(),
        page.click('body > div.main-content.container-fluid > table > tbody > tr > td > div > form > div > button'),
      ]);

      // check error messages of the event form
      // field validation error boxes should contain errors
      const checkErrMsg = await elements.hasErrors(page, 'table > tbody > tr > td > small > span.field-validation-error');
      assert.isTrue(checkErrMsg, 'should show an error');
    }
  });
}