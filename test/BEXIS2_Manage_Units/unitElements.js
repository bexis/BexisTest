/**
 * handle manage units elements
 */


export default {
  createUnit,
  deleteUnit,
  filterDescription,
  chooseDimensionName,
  chooseDataType,
  returnTableContent,
  inputType,
};


/**
 * Create unit
 *
 * @param   {object}    Browser
 * @param   {object}    util
 * @param   {object}    units
 * @param   {object}    assert
 * @param   {string}    descName
 */

async function createUnit(page, util, units, assert, descName) {

  try {

    // navigate to "Manage Units"
    await util.menu.select(page, 'Manage Units');

    // wait until the container is loaded in view mode
    await page.waitForSelector('#information-container', { visible: true });

    // count the number of rows before a new entry
    const rowCountBefore = (await page.$$('#bx-rpm-unitGrid > table > tbody > tr')).length;

    // click Create Unit button
    await page.click('.bx-button');

    // wait until the unit window is loaded in view mode
    await page.waitForSelector('#UintWindow', { visible: true });

    // find Name field
    const unitName = 'unit.test.name';
    await inputType(page, '#Unit_Name', unitName);

    // find Abbreviation field
    await inputType(page, '#Unit_Abbreviation', 'unit.test.abv');

    // find Description field
    await inputType(page, '#Unit_Description', descName);

    await page.screenshot({path: 'create.png'});

    // choose a value for Dimension Name
    await units.chooseDimensionName(page);

    // choose a Data Type
    await units.chooseDataType(page);

    await page.screenshot({path: 'create2.png'});

    // click save button and wait for the navigation
    await Promise.all([
      page.waitForNavigation(),
      page.click('#saveButton'),
    ]);

    await page.screenshot({path: 'create3.png'});

    // wait until the table is loaded in view mode
    await page.waitForSelector('#bx-rpm-unitGrid > table > tbody > tr', { visible: true });

    // check error messages of the create unit window
    // should not be visible at all and should not contain any errors
    const hasErrors = await page.evaluate( () => Array.from( document.querySelectorAll('#createUnit .bx-errorMsg' ) ).some( (el) => el.textContent.trim() ) );
    assert.isFalse( hasErrors, 'should not show any errors' );

    // look for the new entry in the list of units
    const hasUnit = await page.$$eval( '#bx-rpm-unitGrid > table > tbody > tr', (rows, unitName) => {
      return rows.some( (tr) => tr.querySelector( 'td:nth-child(2)' ).textContent.trim() == unitName );
    }, unitName );
    assert.isTrue( hasUnit, 'should contain the new unit in the unit listing' );

    // count the number of rows after a new entry
    const rowCountAfter = (await page.$$('#bx-rpm-unitGrid > table > tbody > tr')).length;

    // checks if a new entry is added or not
    assert.notEqual(rowCountBefore, rowCountAfter, 'New entry is added');

  } catch(e) {
    await page.screenshot({path: 'error.png'});
    throw  e;
  }
}

/**
 * Delete unit
 *
 * @param {Object} Browser
 * @param {Object} units
 * @param {Object} util
 * @param {string} navigation
 * @param {string} containerId
 * @param {string} id
 * @param {string} descName
 */

async function deleteUnit(Browser, units, util, navigation, containerId, id, descName) {
  const page = await Browser.openTab();

  // filter unit description in the table
  await units.filterDescription(page, util, navigation, containerId, id, descName);

  // after clicking delete icon alert box is shown -> click Ok
  page.on('dialog', async dialog => { await dialog.accept(); });

  // click the Delete icon to delete the unit
  await page.click('#bx-rpm-unitGrid > table > tbody > tr > td:nth-child(8) > div > a.bx.bx-grid-function.bx-trash');
}


/**
 * Filter a unit by Description name
 *
 * @param {Object} page
 * @param {Object} util
 * @param {string} navigation
 * @param {string} containerId
 * @param {string} id
 * @param {string} descName
 */

async function filterDescription(page, util, navigation, containerId, id, descName) {

  // navigate to "Manage Units"
  await util.menu.select(page, navigation);

  // wait until the container is loaded in view mode
  await page.waitForSelector(containerId, { visible: true });

  // click the filter button in the Description column
  await page.click(`${id} > table > thead > tr > th:nth-child(7) > div`);

  // enter description of the unit into first input area on the dropdown
  await inputType(page, `${id} > div.t-animation-container > div > input[type=text]:nth-child(4)`, descName);

  // click the Filter button on the dropdown for finding the unit
  await page.click(`${id} > div.t-animation-container > div > button.t-button.t-button-icontext.t-button-expand.t-filter-button`);

  // wait until the container is loaded in view mode
  await page.waitForSelector(containerId, { visible: true });
}


/**
 * Choose a Dimension Name and a Measurement System
 *
 * @param {Object} page
 */

async function chooseDimensionName(page) {

  // random number generator for Dimension Name
  const randomDimName = Math.floor(Math.random() * 38) + 1;

  // random number generator for Measurement System
  // const randomMeasure = Math.floor(Math.random() * (6 - 2)) + 2;

  // click dropdown menu for Dimension Name menu
  await page.click('#createUnit > form > table > tbody > tr:nth-child(4) > td:nth-child(2) > div > div > span');

  await page.waitFor(2000);

  // choose a random Dimension Name value
  await page.click(`body > div.t-animation-container > div > ul > li:nth-child(${randomDimName})`);

  // // click dropdown menu for Measurement System menu
  // await page.click('#createUnit > form > table > tbody > tr:nth-child(6) > td:nth-child(2) > div > div');

  // // there are more than one of the same class name -> choose the first selector
  // const selectors = await page.$$(`body > div.t-animation-container > div > ul > li:nth-child(${randomMeasure})`);

  // // choose a random Measurement System value
  // await selectors[1].click();
}


/**
 * Choose a Data Type
 *
 * @param {Object} page
 */

async function chooseDataType(page) {

  // random number generator for Data Type
  const randomDataType = Math.floor(Math.random() * 7) + 1;

  // uncheck the chekboxes
  await page.$$eval('input[type="checkbox"]',
                    checkBoxes => checkBoxes
                      .forEach(checkBox => checkBox.checked = false));

  // choose a random Data Type
  await page.click(`#bx-rpm-selectDataTypeGrid > div.t-grid-content > table > tbody > tr:nth-child(${randomDataType}) > td:nth-child(1) > input`);
}


/**
 * Return table content
 *
 * @param {Object} page
 */
async function returnTableContent(page) {
  const result = await page.evaluate(() => {
    const rows = document.querySelectorAll('table tr td');
    return Array.from(rows, row => row.textContent);
  });
  return result;
}

async function inputType(page, selector, text) {
  await page.type( selector, text );
}