/**
 * handle event management
 */


export default {
  createEvent,
  deleteEvent,
  registerEvent,
  removeEvent,
  filterEventByName
};

/**
 * Create event
 *
 * @param   {object}    page
 * @param   {object}    util
 * @param   {object}    elements
 * @param   {object}    assert
 * @param   {string}    eventName
 * @param   {boolean}   editCondition
 * @param   {boolean}   calendarCondition
 */

async function createEvent(page, util, elements, assert, eventName, editCondition, calendarCondition, emailCC, emailBCC, emailReply) {

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
  await page.type('#Name', eventName);

  // wait for Event time period and time field
  await page.waitForSelector('#EventDate');

  // find Event time period and time field
  await page.type('#EventDate', 'event.test.timePeriod');

  // find Event location field
  await page.type('#Location', 'event.test.location');

  // wait for Important information field
  await page.waitForSelector('#ImportantInformation');

  // find Important information field
  await page.type('#ImportantInformation', 'event.test.importantInfo');

  // wait for Additional Mail information field
  await page.waitForSelector('#MailInformation');

  // find Additional Mail information field
  await page.type('#MailInformation', 'event.test.addInfo');

  // wait for Selected Event Language field
  await page.waitForSelector('#SelectedEventLanguage');

  // select only English language for event registration because Deutsch is not working
  if(!calendarCondition) {

    await page.select('#SelectedEventLanguage', 'English');
  } else {

    // should select a random event language
    let selectLang = Math.random() < 0.5 ? 'English' : 'Deutsch';
    await page.select('#SelectedEventLanguage', selectLang);
  }

  if (editCondition) {

    // wait for Allow edit checkbox field
    await page.waitForSelector('#EditAllowed');

    // click Allow edit checkbox field
    await page.click('#EditAllowed');
  }

  if(!calendarCondition) {

    // get the date of the next day
    // This block of code is written for Registration Event test so newly created event should always be visible under Event Registration otherwise calendar date is random.
    // If the date format of the calendar changes, the Registration Event test will fail so the code has to be changed according the new date format.
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    let nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 1);

    let nextDateString = ('0' + nextDate.getDate()).slice(-2) + '-' + monthNames[nextDate.getMonth()] + '-' + ('0' + nextDate.getFullYear()).slice(-2);

    // clear and type the date of the next date in Deadline field
    const deadlineInput = await page.$('#Deadline');
    await deadlineInput.click({ clickCount: 3 });
    await deadlineInput.type(nextDateString);

  } else {

    // click Calendar icon for a Start date
    await page.click('body > div.main-content.container-fluid > table > tbody > tr > td > div > form > table > tbody > tr:nth-child(7) > td:nth-child(2) > div > div > span > span');

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
    await page.click('body > div.main-content.container-fluid > table > tbody > tr > td > div > form > table > tbody > tr:nth-child(8) > td:nth-child(2) > div > div > span > span');

    // wait for calendar container to be visible (margin-top: 0px)
    await page.waitForFunction(() => getComputedStyle(document.querySelector('body > div.t-animation-container > div')).getPropertyValue('margin-top') === '0px');

    // click a random day on current month for an end date
    const endDays = await page.$$('body > div.t-animation-container > div > table > tbody > tr > td:not(.t-other-month)');

    // remove days until the start date for not picking a past date
    const splicedEndDays = endDays.splice(randomStartDays);
    splicedEndDays[Math.floor(Math.random() * splicedEndDays.length)].click();

    // after a clicking a random date on calendar wait for calendar container to be hidden (margin-top: -316px)
    await page.waitForFunction(() => getComputedStyle(document.querySelector('body > div.t-animation-container > div')).getPropertyValue('margin-top') !== '0px');
  }

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
  await page.type('#EmailCC', emailCC);

  // wait for BCC email addresses field
  await page.waitForSelector('#EmailBCC');

  // find BCC email addresses field
  await page.type('#EmailBCC', emailBCC);

  // wait for Reply to mail address field
  await page.waitForSelector('#EmailReply');

  // find Reply to mail address field
  await page.type('#EmailReply', emailReply);

  // click Save button
  await Promise.all([
    page.waitForNavigation(),
    page.click('body > div.main-content.container-fluid > table > tbody > tr > td > div > form > div > button'),
  ]);

  // wait for Event table is loaded in view model
  await page.waitForSelector('#events > tbody > tr');

  // check for an entry by Event name in the list of events
  const checkEntry = await elements.hasEntry(page, '#events > tbody > tr', eventName, '2');
  assert.isTrue(checkEntry, 'should contain the new event in the table');
}

/**
 * Delete event
 *
 * @param   {object}    page
 * @param   {object}    util
 * @param   {object}    elements
 * @param   {object}    assert
 * @param   {string}    eventName
 */

async function deleteEvent(page, util, assert, elements, eventName) {

  // navigate to "Manage Events"
  await util.menu.select(page, 'Manage Events');

  // wait for button Create new Event is loaded in view model
  await page.waitForSelector('body > div.main-content.container-fluid > table > tbody > tr > td > div > a', { visible: true });

  // wait for the delete icon
  await page.waitForSelector(`div[title="Delete event \\"${eventName}\\""]`);

  // click Delete button
  const deleteButton = await page.$(`div[title="Delete event \\"${eventName}\\""]`);
  await deleteButton.click();

  // wait for the events table
  await assert.isFulfilled(page.waitForSelector('#events > tbody > tr > td'), 'should wait for the events table');

  // check for an entry by Event name in the list of events to see if it is deleted
  const checkEntry = await elements.hasListing(page, '#events > tbody > tr', 'event.test.name');
  assert.isFalse(checkEntry, 'should not contain the new event in the table');
}

/**
 * Register event
 *
 * @param   {object}    page
 * @param   {object}    util
 * @param   {object}    assert
 */

async function registerEvent(page, util, assert, emailRegistration) {

  // navigate to "Event Registrations"
  await util.menu.select(page, 'Event Registration');

  // wait for the events table to be loaded in view model
  await page.waitForSelector('#events', {visible: true});

  // wait for the Search input
  await page.waitForSelector('#events_filter', {visible: true});

  // type the event name in the search input
  await page.type('#events_filter > label > input[type=search]', 'register.event.test.name');

  // wait for Register button
  await page.waitForSelector('#events > tbody > tr > td.sorting_1 > div');

  // click Register button
  await page.click('#events > tbody > tr > td.sorting_1 > div');

  // wait for Event Registration window to be visible
  await page.waitForSelector('#Window_LogInToEvent', {visible:true});

  // wait for Event password input field
  await page.waitForSelector('#LogInPassword');

  // type Event password
  await page.type('#LogInPassword', 'eventPass');

  // wait for Continue registration button
  await page.waitForSelector('#logInToEvent > div > button:nth-child(1)');

  // click Continue registration button
  await Promise.all([
    page.waitForNavigation(),
    page.click('#logInToEvent > div > button:nth-child(1)'),
  ]);

  // wait for Last name input field
  await page.waitForSelector('#\\143_33_1_1_1_4_Input');

  // type Last name
  await page.type('#\\143_33_1_1_1_4_Input', 'Doe');

  // wait for First name input field
  await page.waitForSelector('#\\144_33_1_1_1_4_Input');

  // type First name
  await page.type('#\\144_33_1_1_1_4_Input', 'Jane');

  // wait for Email input field
  await page.waitForSelector('#\\146_33_1_1_1_4_Input');

  // type Email
  await page.type('#\\146_33_1_1_1_4_Input', emailRegistration);

  // wait for the arrow icon on Position field
  await page.waitForSelector('#\\38 8_27_1_1_1_4 > table > tbody > tr:nth-child(2) > td.metadataAttributeInput > div > div > span.t-select > span');

  // click the arrow icon on Position field
  await page.click('#\\38 8_27_1_1_1_4 > table > tbody > tr:nth-child(2) > td.metadataAttributeInput > div > div > span.t-select > span');

  // after clicking the arrow icon wait for dropdown to appear (margin-top: 0px)
  await page.waitForFunction(() => getComputedStyle(document.querySelector('body > div.t-animation-container > div.t-popup.t-group')).getPropertyValue('margin-top') === '0px');

  // set max from length of position list
  const maxLength = await page.evaluate(() => {
    const rows = document.querySelectorAll('body > div.t-animation-container > div > ul > li');
    return rows.length;
  });

  // choose a random Position value
  const randomPosition = Math.floor(Math.random() * (maxLength - 2 + 1) + 2); // todo
  await page.click(`body > div.t-animation-container > div > ul > li:nth-child(${randomPosition})`);

  // after clicking a random position wait for dropdown to be hidden (margin-top: -179px)
  await page.waitForFunction(() => getComputedStyle(document.querySelector('body > div.t-animation-container > div.t-popup.t-group')).getPropertyValue('margin-top') !== '0px');

  // wait for Additional information
  await page.waitForSelector('#\\38 9_28_1_1_1_6_Input');

  // type additional information
  await page.type('#\\38 9_28_1_1_1_6_Input', 'additionalInfo');

  // click Save button
  await Promise.all([
    page.waitForNavigation(),
    page.click('#save'),
  ]);

  // wait for the events table to be loaded in view model
  await page.waitForSelector('#events', {visible: true});

  // wait for the Search input
  await page.waitForSelector('#events_filter', {visible: true});

  // type the event name in the search input
  await page.type('#events_filter > label > input[type=search]', 'register.event.test.name');

  // after registration there should be two icons, edit and delete icons, instead of Register button
  const deleteIconClass = await page.evaluate(() => document.querySelector('#events > tbody > tr > td:nth-child(2)').previousElementSibling.lastElementChild.className.trim());
  assert.equal(deleteIconClass, 'bx bx-grid-function bx-trash', 'the second element child should have bx bx-grid-function bx-trash class name for delete icon');
}

/**
 * Remove event -- it also removes registered events
 *
 * @param   {object}    page
 * @param   {object}    util
 * @param   {object}    elements
 * @param   {object}    assert
 * @param   {string}    eventName
 */

async function removeEvent(page, util, elements, assert, eventName){

  // navigate to "Show Reservations"
  await util.menu.select(page, 'Show Reservations');

  // wait for the first event in Event contents
  await page.waitForSelector('#Content_Events > div > ul > li > ul > li > div > a.t-link.t-in.event');

  // click registration event on its name to show it on the Event Registration Results table and wait for navigation
  await elements.clickAnyElementByText(page, eventName);
  await page.waitForNavigation();

  // wait for the first event in Event contents
  await page.waitForSelector('#Content_Events > div > ul > li > ul > li > div > a.t-link.t-in.event');

  // wait for Delete button
  await page.waitForSelector('body > div.main-content.container-fluid > table > tbody > tr > td:nth-child(3) > div > span');

  // after clicking delete button, alert box is shown -> click Ok
  page.on('dialog', async dialog => { await dialog.accept(); });

  // click Delete button
  await Promise.all([
    page.waitForNavigation(),
    page.click('body > div.main-content.container-fluid > table > tbody > tr > td:nth-child(3) > div > span'),
  ]);

  // get the list of events from tree view under open to check if the registered event is removed or not
  const treeViewContent = await elements.returnContent(page, '#TreeView > ul > li.t-item.t-first > ul > li > div > a');
  assert.isFalse(treeViewContent.includes(eventName), 'should not contain the registered event in the tree view of events');
}

/**
 * Filter event by an event name
 *
 * @param   {object}    page
 * @param   {string}    name
 */

async function filterEventByName(page, name){

  // wait for the events table to be loaded in view model
  await page.waitForSelector('#events', {visible: true});

  // wait for the Search input
  await page.waitForSelector('#events_filter', {visible: true});

  // type the event name in the search input
  await page.type('#events_filter > label > input[type=search]', name);
}