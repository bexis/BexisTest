import Browser from '../../util/Browser';
import util from '../../util/common';
import { assert } from 'chai';

describe('Remove All', () => {

  it('should remove selected bookings from the resource cart', async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if (!(await util.login.isLoggedIn(page))) {
      await assert.isFulfilled(util.login.loginUser(page), 'should login');
    }

    // navigate to "Calendar"
    await assert.isFulfilled(util.menu.select(page, 'Calendar'), 'should navigate to calendar page');

    // wait for Book Resource button is loaded in view model
    await assert.isFulfilled(page.waitForSelector('#Content_Filter > a', { visible: true }), 'should wait for book resource button');

    // click Book Resource button
    await Promise.all([
      page.waitForNavigation(),
      page.click('#Content_Filter > a'),
    ]);

    // wait for the first Select Resource button is loaded in view model
    await assert.isFulfilled(page.waitForSelector('#resourcesTable > tbody > tr:nth-child(1) > td:nth-child(3) > span', {visible: true}), 'should wait for select resource button');

    // get a random Resource
    const resourceSelect = await page.$$('span[title="Select resource"]');

    // add randomly selected three resources to the resource cart
    for (let i = 1; i <= 3; i++) {

      const randomResourceSelector= Math.floor(Math.random() * resourceSelect.length) + 1;

      // click a random Resource
      await assert.isFulfilled(page.click(`#resourcesTable > tbody > tr:nth-child(${randomResourceSelector}) > td:nth-child(3) > span`), 'should click a random resource');
    }

    // wait for Resource cart to be completely filled
    await assert.isFulfilled(page.waitForTimeout(500));

    // get the selected resources count
    const resourceCountBeforeRemove = await page.$$('#ResourceCart > div > table > tbody > tr > td > b');

    // check if the number of selected resources equal to 3
    assert.equal(resourceCountBeforeRemove.length, 3, 'should equal 3');

    // wait for Remove All button
    await assert.isFulfilled(page.waitForSelector('#ResourceCart > button'), {visible: true}, 'should wait for remove all button');

    // click Remove All button
    await assert.isFulfilled(page.click('#ResourceCart > button'), 'should click remove all button');

    // wait for the text appear after removing the selected resources
    await assert.isFulfilled(page.waitForSelector('#ResourceCart > span', {visible: true}), 'should wait for the span text to appear after removing the selected resources');

    // remove the selected resources count
    const resourceCountAfterRemove = await page.$$('div#remove.bx.bx-grid-function.bx-trash');

    // check if the number of selected resources equal to 0 after clicking Remove all button
    assert.equal(resourceCountAfterRemove.length, 0, 'should equal to 3 after clicking Remove all button');
  });
});