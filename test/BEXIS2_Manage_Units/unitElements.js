/**
 * handle manage units elements
 */


export default {
  createUnit,
  deleteUnit,
  editUnit,
  filterDescription,
  chooseDimensionName,
  chooseDataType,
  returnTableContent
};


/**
 * Create unit
 *
 * @param   {object}    page
 * @param   {object}    util
 * @param   {object}    units
 * @param   {object}    assert
 * @param   {object}    elements
 * @param   {string}    unitDescName
 */

async function createUnit(page, util, units, assert, elements, unitDescName) {

  try {
    // navigate to "Manage Units"
    await util.menu.select(page, 'Manage Units');

    // wait until the container is loaded in view mode
    await page.waitForSelector('#information-container', { visible: true });

    // click Create Unit button
    await page.click('.bx-button');

    // wait until the unit window is loaded in view mode
    await page.waitForSelector('#UintWindow', { visible: true });

    // find Name field
    await page.type('#Unit_Name', 'unit.test.name');

    // find Abbreviation field
    await page.type('#Unit_Abbreviation', 'unit.test.abv');

    // find Description field
    await page.type('#Unit_Description', unitDescName);

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

    // check error messages of the create unit window
    // should not be visible at all and should not contain any errors
    const checkErrMsg = await elements.hasErrors(page, '#createUnit .bx-errorMsg');
    assert.isFalse(checkErrMsg, 'should not show any errors');

    // check for an entry by Description Name in the list of units
    const checkEntry = await elements.hasEntry(page, '#bx-rpm-unitGrid  > table > tbody > tr', 'unit.test.desc', '7');
    assert.isTrue(checkEntry, 'should contain the unit in the table');

  } catch(e) {
    await page.screenshot({path: './test/BEXIS2_Manage_Units/errorCreateUnit.png'});
    throw e;
  }
}


/**
 * Delete unit
 *
 * @param {Object} page
 * @param {Object} util
 * @param {Object} assert
 * @param {Object} elements
 * @param {string} unitName
 * @param {string} unitDescName
 */

async function deleteUnit(page, util, assert, elements, unitName, unitDescName) {

  // navigate to "Manage Units"
  await util.menu.select(page, 'Manage Units');

  // wait until the container is loaded in view mode
  await page.waitForSelector('#information-container', { visible: true });

  // after clicking delete icon alert box is shown -> click Ok
  page.on('dialog', async dialog => { await dialog.accept(); });

  // click Delete button
  const deleteButton = await page.$$((`a[title*="${unitName}"]`));
  await deleteButton[1].click();

  // wait until the container is loaded in view mode
  await page.waitForSelector('#information-container', { visible: true });

  // check for an entry by Description Name in the list of units
  const checkEntry = await elements.hasEntry(page, '#bx-rpm-unitGrid  > table > tbody > tr', unitDescName, '7');
  assert.isFalse(checkEntry, 'should not contain the unit in the table');
}


/** Edit unit
 *
 * @param {Object} page
 * @param {string} unitName
 */

async function editUnit(page, unitName) {

  // click edit button
  const editButton = await page.$$((`a[title*="${unitName}"]`));
  await editButton[0].click();
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
  await page.type(`${id} > div.t-animation-container > div > input[type=text]:nth-child(4)`, descName);

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

  // click dropdown menu for Dimension Name menu
  await page.click('#createUnit > form > table > tbody > tr:nth-child(4) > td:nth-child(2) > div > div > span');

  // random number generator for Dimension Name -> (Math.floor(Math.random() * (max - min + 1) + min))
  // set max from length of list
  const maxLength = await page.evaluate(() => {
    const rows = document.querySelectorAll('body > div.t-animation-container > div > ul > li');
    return rows.length;
  });
  const randomDimName = Math.floor(Math.random() * (maxLength - 2 + 1) + 2); // todo

  await page.screenshot({path: './test/BEXIS2_Manage_Units/chooseDimName.png'});

  // choose a random Dimension Name value
  await page.click(`body > div.t-animation-container > div > ul > li:nth-child(${randomDimName})`);
}


/**
 * Choose a Data Type
 *
 * @param {Object} page
 */

async function chooseDataType(page) {

  // random number generator for Data Type
  const randomDataType = Math.floor(Math.random() * 7) + 1;

  // uncheck the checkboxes
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