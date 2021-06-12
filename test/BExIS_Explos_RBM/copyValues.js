import Browser from '../../util/Browser';
import util from '../../util/common';
import { assert } from 'chai';
import elements from '../../util/common/elements';
import RBMElements from '../BExIS_Explos_RBM/RBMElements';

describe('Copy filled values to all other', () => {

  before(async () => {

    // book a resource with an activity
    let checkActivity = true;
    do {
      const page = await Browser.openTab();

      // make sure we are logged in
      if( !(await util.login.isLoggedIn(page)) ) {
        await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
      }

      // books a resource
      await assert.isFulfilled(RBMElements.createBooking(page, util, elements, assert), 'should book a new resource');

      // navigate to list view
      await assert.isFulfilled(RBMElements.navigationToList(page, util), 'should navigate to the list view');

      // check for an entry by Description Name in the list of bookings
      checkActivity = await elements.hasEntry(page, '#resources_table > tbody > tr', '', '9');

      // delete a booking if it doesn't have an activity
      if (checkActivity) {

        const page = await Browser.openTab();

        // make sure we are logged in
        if( !(await util.login.isLoggedIn(page)) ) {
          await assert.isFulfilled(util.login.loginUser(page), 'should log in');
        }

        // deletes a booking
        await assert.isFulfilled(RBMElements.deleteBooking(page, util, elements, assert), 'should delete the new booking');
      }
    }
    while (checkActivity);
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


  it('should copy filled values to all other', async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
    }

    // navigate to list view
    await assert.isFulfilled(RBMElements.navigationToList(page, util), 'should navigate to the list view');

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

    // wait for add more resources button is loaded in view model
    await assert.isFulfilled(page.waitForSelector('#Content_Event > a'), 'should wait for add more resources button');

    // click Add more resources button
    await Promise.all([
      page.waitForNavigation(),
      page.click('#Content_Event > a'),
    ]);

    // wait for the first Select Resource button is loaded in view model
    await assert.isFulfilled(page.waitForSelector('#Grid_Resource > table > tbody > tr:nth-child(1) > td:nth-child(3) > span', {visible: true}), 'should wait for select resource button');

    // click to add the first two resources from the Available Resources table
    for (let index = 1; index < 3; index++) {
      await assert.isFulfilled(page.click(`#Grid_Resource > table > tbody > tr:nth-child(${index}) > td:nth-child(3) > span`), 'should add a second resource to the resource cart');
    }

    // wait for the third resource to appear on Selected Resources cart
    await assert.isFulfilled(page.waitForSelector('#ResourceCart > div > table > tbody > tr:nth-child(5) > td', {visible: true}), 'should wait for the second resource to appear on the resources cart');

    // wait for Continue booking button to be loaded in view model
    await assert.isFulfilled(page.waitForSelector('#ResourceCart > a', {visible: true}), 'should wait for continue booking button');

    // click Continue booking button
    await Promise.all([
      page.waitForNavigation(),
      page.click('#ResourceCart > a'),
    ]);

    // wait for Open Calendar icon is loaded in view model
    await assert.isFulfilled(page.waitForSelector('#Content_Event > div.bx-footer.right > a:nth-child(3)', {visible:true}), 'should wait for open calendar icon');

    // click Copy filled values to other from the first resource
    const copyFilled = await page.$$('span[title="Use filled values for all other schedules"]');
    await assert.isFulfilled(copyFilled[0].click(), 'should click copy filled values to other');

    // wait for save button to be loaded in the view model
    await assert.isFulfilled(page.waitForSelector('#Content_Event > div.bx-footer.right > a:nth-child(2)'), {visible:true}, 'should wait for the Save button');

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

    // make a new array from Start date, End Date and Activities and leave the other info
    let copiedContent = [];
    for(let index = 0; index < filterTableContent.length; index++){

      // Start date index starts from 6 (it can change if the table layout changes)
      copiedContent.push(filterTableContent[index].splice(6));
    }

    // check if Start Date, End Date and Activities of the three resources are equal
    assert.equal(JSON.stringify(copiedContent[0]), JSON.stringify(copiedContent[1]), 'Start Date, End Date and Activities of the first and the second resource should be equal');
    assert.equal(JSON.stringify(copiedContent[1]), JSON.stringify(copiedContent[2]), 'Start Date, End Date and Activities of the second and the third resource should be equal');
  });
});
