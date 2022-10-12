import Browser from '../../util/Browser';
import Config from '../../config';
import util from '../../util/common';
import { assert } from 'chai';
import elements from '../../util/common/elements';
import EMMElements from './EMMElements';

describe('Delete Event', () => {

  before(async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
    }

    // creates an event
    await assert.isFulfilled(EMMElements.createEvent(page, util, elements, assert, 'event.test.name', true, true, Config.emmEmails.emails.primaryEmail, Config.emmEmails.emails.secondaryEmail, Config.emmEmails.emails.primaryEmail), 'should create a new event');
  });

  it('should delete an event', async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
    }

    // navigate to "Manage Events"
    await assert.isFulfilled(util.menu.select(page, 'Manage Events'), 'should open manage events page');

    // wait for button Create new Event is loaded in view model
    await assert.isFulfilled(page.waitForSelector('body > div.main-content.container-fluid > table > tbody > tr > td > div > a', { visible: true }), 'should wait for button create new event');

    // wait for the delete icon
    await assert.isFulfilled(page.waitForSelector('div[title="Delete event \\"event.test.name\\""]'), 'should wait for the delete icon');

    // click Delete icon
    const deleteButton = await page.$('div[title="Delete event \\"event.test.name\\""]');
    await deleteButton.click();

    // wait for the events table
    await assert.isFulfilled(page.waitForSelector('#events > tbody > tr > td'), 'should wait for the events table');

    // check for an entry by Event name in the list of events to see if it is deleted
    const checkEntry = await elements.hasListing(page, '#events > tbody > tr', 'event.test.name');
    assert.isFalse(checkEntry, 'should not contain the new event in the table');
  });
});