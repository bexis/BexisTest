/**
 * handle event management
 */


export default {
  createEvent,
  deleteEvent
};

/**
 * Create event
 *
 * @param   {object}    page
 * @param   {object}    util
 * @param   {object}    elements
 * @param   {object}    assert
 */

async function createEvent(page, util, elements, assert) {

  // navigate to "Manage Events"
  await util.menu.select(page, 'Manage Events');

  // wait for button Create new Event is loaded in view model
  await page.waitForSelector('body > div.main-content.container-fluid > table > tbody > tr > td > div > a', { visible: true });

  // click Create new Event button
  await Promise.all([
    page.waitForNavigation(),
    page.click('body > div.main-content.container-fluid > table > tbody > tr > td > div > a'),
  ]);

  // wait for Event name field
  await page.waitForSelector('#Name');

  // find Event name field
  await page.type('#Name', 'event.test.name');

  // wait for Event time period and time field
  await page.waitForSelector('#EventDate');

  // find Event time period and time field
  await page.type('#EventDate', 'event.test.timePeriod');

  // wait for Important information field
  await page.waitForSelector('#ImportantInformation');

  // find Important information field
  await page.type('#ImportantInformation', 'event.test.importantInfo');

  // wait for Event language field
  await page.waitForSelector('#EventLanguage');

  // find Event language field
  await page.type('#EventLanguage', 'event.test.lang');

  // click Calendar icon for a Start date
  await page.click('body > div.main-content.container-fluid > table > tbody > tr > td > div > form > table > tbody > tr:nth-child(5) > td:nth-child(2) > div > div > span > span');

  // wait for calendar container to be visible (margin-top: 0px)
  await page.waitForFunction(() => getComputedStyle(document.querySelector('body > div.t-animation-container > div')).getPropertyValue('margin-top') === '0px');

  // click a random day on current month for a start date
  const startDays = await page.$$('body > div.t-animation-container > div > table > tbody > tr > td:not(.t-other-month)');

  // startDays.length - 2 --> it is for a gap between start and end date
  const randomStartDays = Math.floor(Math.random() * (startDays.length - 2)) + 1;
  startDays[randomStartDays].click();

  // after a clicking a random date on calendar wait for calendar container to be hidden (margin-top: -316px)
  await page.waitForFunction(() => getComputedStyle(document.querySelector('body > div.t-animation-container > div')).getPropertyValue('margin-top') !== '0px');

  // click Calendar icon for Deadline
  await page.click('body > div.main-content.container-fluid > table > tbody > tr > td > div > form > table > tbody > tr:nth-child(6) > td:nth-child(2) > div > div > span > span');

  // wait for calendar container to be visible (margin-top: 0px)
  await page.waitForFunction(() => getComputedStyle(document.querySelector('body > div.t-animation-container > div')).getPropertyValue('margin-top') === '0px');

  // click a random day on current month for an end date
  const endDays = await page.$$('body > div.t-animation-container > div > table > tbody > tr > td:not(.t-other-month)');

  // remove days until the start date for not picking a past date
  const splicedEndDays = endDays.splice(randomStartDays);
  splicedEndDays[Math.floor(Math.random() * splicedEndDays.length)].click();

  // after a clicking a random date on calendar wait for calendar container to be hidden (margin-top: -316px)
  await page.waitForFunction(() => getComputedStyle(document.querySelector('body > div.t-animation-container > div')).getPropertyValue('margin-top') !== '0px');

  // wait for Participants limitation field
  await page.waitForSelector('#ParticipantsLimitation');

  // find Participants limitation field
  await page.type('#ParticipantsLimitation', '4');

  // wait for Event password field
  await page.waitForSelector('#LogInPassword');

  // find Event password field
  await page.type('#LogInPassword', 'eventPass');

  // wait for CC email addresses field
  await page.waitForSelector('#EmailCC');

  // find CC email addresses field
  await page.type('#EmailCC', 'eventCC@example.com');

  // wait for BCC email addresses field
  await page.waitForSelector('#EmailBCC');

  // find BCC email addresses field
  await page.type('#EmailBCC', 'eventBCC@example.com');

  // wait for Reply to mail address field
  await page.waitForSelector('#EmailReply');

  // find Reply to mail address field
  await page.type('#EmailReply', 'eventReply@example.com');

  // click Save button
  await Promise.all([
    page.waitForNavigation(),
    page.click('body > div.main-content.container-fluid > table > tbody > tr > td > div > form > div > button'),
  ]);

  // wait for Event table is loaded in view model
  await page.waitForSelector('#Grid_Event > table > tbody > tr > td:nth-child(2)');

  // check for an entry by Event name in the list of events
  const checkEntry = await elements.hasEntry(page, '#Grid_Event > table > tbody > tr', 'event.test.name', '2');
  assert.isTrue(checkEntry, 'should contain the new event in the table');
}

/**
 * Delete event
 *
 * @param   {object}    page
 * @param   {object}    util
 * @param   {object}    elements
 * @param   {object}    assert
 * @param   {string}    eventName // such as
 */

async function deleteEvent(page, util, assert, elements, eventName) {

  // navigate to "Manage Events"
  await util.menu.select(page, 'Manage Events');

  // wait for button Create new Event is loaded in view model
  await page.waitForSelector('body > div.main-content.container-fluid > table > tbody > tr > td > div > a', { visible: true });

  // wait for the delete icon
  await page.waitForSelector(`div[title="Delete Unit \\"${eventName}\\""]`);

  // click Delete button
  const deleteButton = await page.$(`div[title="Delete Unit \\"${eventName}\\""]`);
  await deleteButton.click();

  // wait for the delete button to be removed
  await page.waitForFunction((eventName) => !document.querySelector(`div[title="Delete Unit \\"${eventName}\\""]`));

  // check for an entry by Event name in the list of events to see if it is deleted
  const checkEntry = await elements.hasListing(page, '#Grid_Event > table > tbody > tr', eventName);
  assert.isFalse(checkEntry, 'should not contain the new event in the table');
}