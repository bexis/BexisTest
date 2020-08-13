/**
 * handle manage units elements
 */


export default {
  filterDescription,
  chooseDimensionName,
  chooseDataType
};


/**
 * Filter the unit by Description name
 *
 * @param {Object} page
 * @param {Object} util
 */
async function filterDescription(page, util) {

  // navigate to "Manage Units"
  await util.menu.select(page, 'Manage Units');

  // wait until the container is loaded in view mode
  await page.waitForSelector('#information-container', { visible: true });

  // click the filter button in the Description column
  await page.click('#bx-rpm-unitGrid > table > thead > tr > th:nth-child(7) > div');

  // enter description of the unit into first input area on the dropdown
  await page.type('#bx-rpm-unitGrid > div.t-animation-container > div > input[type=text]:nth-child(4)', 'unit.test.desc');

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

