import Browser from '../../util/Browser';
import Config from '../../config';
import util from '../../util/common';
import { assert } from 'chai';
import elements from '../../util/common/elements';
import EMMElements from './EMMElements';

describe('Edit Event', () => {

  before(async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
    }

    // creates an event
    await assert.isFulfilled(EMMElements.createEvent(page, util, elements, assert, 'event.test.name', true, true, Config.emmEmails.emails.primaryEmail, Config.emmEmails.emails.secondaryEmail, Config.emmEmails.emails.primaryEmail), 'should create a new event');
  });

  after( async() => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled(util.login.loginUser(page), 'should log in');
    }

    // deletes an event
    await assert.isFulfilled(EMMElements.deleteEvent(page, util, assert, elements, 'edit.event.test.name'), 'should delete the event');
  });

  it('should edit an event', async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
    }

    // navigate to "Manage Events"
    await assert.isFulfilled(util.menu.select(page, 'Manage Events'), 'should open manage events page');

    // wait for button Create new Event is loaded in view model
    await assert.isFulfilled(page.waitForSelector('body > div.main-content.container-fluid > table > tbody > tr > td > div > a', { visible: true }), 'should wait for button create new event');

    // wait for the edit icon
    await assert.isFulfilled(page.waitForSelector('div[title="Edit event \\"event.test.name\\""]'), 'should wait for the edit icon');

    // click Edit icon
    const editButton = await page.$('div[title="Edit event \\"event.test.name\\""]');
    await editButton.click();

    // wait for Event name field
    await assert.isFulfilled(page.waitForSelector('#Name'), 'should wait for event name field');

    // find Event name field
    await assert.isFulfilled(page.type('#Name', 'edit.'), 'should enter a name');

    // wait for Event time period and time field
    await assert.isFulfilled(page.waitForSelector('#EventDate'), 'should wait for event time period and time field');

    // find Event time period and time field
    await assert.isFulfilled(page.type('#EventDate', 'edit.'), 'should enter an event time period and time');

    // wait for Important information field
    await assert.isFulfilled(page.waitForSelector('#ImportantInformation'), 'should wait for important information field');

    // find Important information field
    await assert.isFulfilled(page.type('#ImportantInformation', 'edit.'), 'should enter an important information');

    // wait for Additional Mail information field
    await assert.isFulfilled(page.waitForSelector('#MailInformation'), 'should wait for additional mail information field');

    // find Additional Mail information field
    await assert.isFulfilled(page.type('#MailInformation', 'edit.event.test.addInfo'), 'should enter an additional mail information');

    // wait for Selected Event Language field
    await assert.isFulfilled(page.waitForSelector('#SelectedEventLanguage'), 'should wait for selected event language field');

    // get the value of randomly selected event language
    const langSelector = await page.$('#SelectedEventLanguage');
    const selectedLang = await (await langSelector.getProperty('value')).jsonValue();

    // edit the event language by switching the selected event language
    if (selectedLang == 'English') {

      await assert.isFulfilled(page.select('#SelectedEventLanguage', 'Deutsch'), 'should select the German language');
    }
    else if (selectedLang == 'Deutsch') {

      await assert.isFulfilled(page.select('#SelectedEventLanguage', 'English'), 'should select the English language');
    }

    // wait for Participants limitation field
    await assert.isFulfilled(page.waitForSelector('#ParticipantsLimitation'), 'should wait for participants limitation field');

    // find Participants limitation field
    await assert.isFulfilled(page.type('#ParticipantsLimitation', '2'), 'should enter a participants limitation');

    // click Save button
    await Promise.all([
      page.waitForNavigation(),
      page.click('body > div.main-content.container-fluid > table > tbody > tr > td > div > form > div > button'),
    ]);

    // wait for the events table
    await assert.isFulfilled(page.waitForSelector('#events > tbody > tr > td'), 'should wait for the events table');

    // check for an entry by Event name in the list of events
    const checkEntry = await elements.hasEntry(page, '#events > tbody > tr', 'edit.event.test.name', '2');
    assert.isTrue(checkEntry, 'should contain the new event in the table');
  });
});