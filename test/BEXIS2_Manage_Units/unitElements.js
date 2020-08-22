/**
 * handle manage units elements
 */


export default {
  filterDescription,
  chooseDimensionName,
  chooseDataType,
  createUnit,
  deleteUnit,
  returnTableContent,
  clearInputField
};


/**
 * Filter the unit by Description name
 *
 * @param {Object} page
 * @param {Object} util
 * @param {string} descName
 */
async function filterDescription(page, util, descName) {

  // navigate to "Manage Units"
  await util.menu.select(page, 'Manage Units');

  // wait until the container is loaded in view mode
  await page.waitForSelector('#information-container', { visible: true });

  // click the filter button in the Description column
  await page.click('#bx-rpm-unitGrid > table > thead > tr > th:nth-child(7) > div');

  // enter description of the unit into first input area on the dropdown
  await page.type('#bx-rpm-unitGrid > div.t-animation-container > div > input[type=text]:nth-child(4)', descName);

  // click the Filter button on the dropdown for finding the unit
  await page.click('#bx-rpm-unitGrid > div.t-animation-container > div > button.t-button.t-button-icontext.t-button-expand.t-filter-button');

  // wait until the container is loaded in view mode
  await page.waitForSelector('#information-container', { visible: true });
}

/**
 * Choose a Dimension Name and a Measurement System
 *
 * @param {Object} page
 */
async function chooseDimensionName(page) {

  // random number gerenerator for Dimension Name
  const randomDimName = Math.floor(Math.random() * 38) + 1;

  // random number gerenerator for Measurment System
  const randomMeasure = Math.floor(Math.random() * (6 - 2)) + 2;

  // click dropdown menu for Dimension Name menu
  await page.click('#createUnit > form > table > tbody > tr:nth-child(4) > td:nth-child(2) > div > div > span');

  // choose a random Dimension Name value
  await page.click(`body > div.t-animation-container > div > ul > li:nth-child(${randomDimName})`);

  // click dropdown menu for Measurement System menu
  await page.click('#createUnit > form > table > tbody > tr:nth-child(6) > td:nth-child(2) > div > div');

  // there are more than one of the same class name -> choose the first selector
  const selectors = await page.$$(`body > div.t-animation-container > div > ul > li:nth-child(${randomMeasure})`);

  // choose a random Measurement System value
  await selectors[1].click();
}

/**
 * Choose a Data Type
 *
 * @param {Object} page
 */
async function chooseDataType(page) {

  // random number gerenerator for Data Type
  const randomDataType = Math.floor(Math.random() * 7) + 1;

  // uncheck the chekboxes
  await page.$$eval('input[type="checkbox"]',
                    checkBoxes => checkBoxes
                      .forEach(checkBox => checkBox.checked = false));

  // choose a random Data Type
  await page.click(`#bx-rpm-selectDataTypeGrid > div.t-grid-content > table > tbody > tr:nth-child(${randomDataType}) > td:nth-child(1) > input`);
}


/**
 * create a test for Manage Units with required field not filled until all fields filled
 *
 * @param   {object}    Browser
 * @param   {object}    util
 * @param   {object}    units
 * @param   {object}    assert
 * @param   {string}    descName
 */

async function createUnit(Browser, util, units, assert, descName) {

  const page = await Browser.openTab();

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
  await page.type('#Unit_Name', 'unit.test.name');

  // find Abbreviation field
  await page.type('#Unit_Abbreviation', 'unit.test.abv');

  // find Description field
  await page.type('#Unit_Description', descName);

  // choose a value for Dimension Name
  await units.chooseDimensionName(page);

  // choose a Data Type
  await units.chooseDataType(page);

  // click save button and wait for the navigation
  await Promise.all([
    page.waitForNavigation(),
    page.click('#saveButton'),
  ]);

  // wait until the table is loaded in view mode
  await page.waitForSelector('#bx-rpm-unitGrid > table > tbody > tr', { visible: true });

  // count the number of rows after a new entry
  const rowCountAfter = (await page.$$('#bx-rpm-unitGrid > table > tbody > tr')).length;

  // find difference between rows
  const diffRows = rowCountAfter - rowCountBefore;

  // checks if a new entry is added or not
  if (diffRows === 0) {
    assert.equal(rowCountBefore, rowCountAfter, 'No new entry is added');
  } else if (diffRows === 1) {
    assert.notEqual(rowCountBefore, rowCountAfter, 'New entry is added');
  }
}

/**
 * Delete unit
 *
 * @param {Object} Browser
 * @param {Object} units
 * @param {Object} util
 * @param {string} descName
 */
async function deleteUnit(Browser, units, util, descName) {
  const page = await Browser.openTab();

  // filter unit description in the table
  await units.filterDescription(page, util, descName);

  // after clicking delete icon alert box is shown -> click Ok
  page.on('dialog', async dialog => { await dialog.accept(); });

  // click the Delete icon to delete the unit
  await page.click('#bx-rpm-unitGrid > table > tbody > tr > td:nth-child(8) > div > a.bx.bx-grid-function.bx-trash');
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

/**
 * Clear an Input field
 *
 * @param {Object} page
 * @param {string} selector
 */
async function clearInputField(page, selector) {
  await page.evaluate(selector => {
    document.querySelector(selector).value = '';
  }, selector);
}