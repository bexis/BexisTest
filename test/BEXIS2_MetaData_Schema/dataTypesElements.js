/**
 * handle data types elements
 */


export default {
  createDataType,
  deleteDataType,
  editDataType,
  chooseOptionValue,
  filterDescription
};

/** Create a Data Type
 *
 * @param {Object} page
 * @param {Object} util
 * @param {Object} elements
 * @param {Object} dataElements
 * @param {Object} assert
 * @param {string} dataTypeName
 * @param {string} dataTypeDescName
 */

async function createDataType(page, util, elements, dataElements, assert, dataTypeName, dataTypeDescName) {

  // navigate to "Manage Data Types"
  await util.menu.select(page, 'Manage Data Types');

  // wait for button Create Data Type is loaded in view model
  await page.waitForSelector('body > div.main-content.container-fluid > table > tbody > tr > td > div > div.bx-rpm-buttons > a', { visible: true });

  // click Create Data Type button
  await page.click('body > div.main-content.container-fluid > table > tbody > tr > td > div > div.bx-rpm-buttons > a');

  // wait for Data Type Window is loaded in view model
  await page.waitForSelector('#DataTypeWindow', { visible: true });

  // find Name field and type a name for data type
  await elements.typeInputField(page, '#dataType_Name', dataTypeName);

  // find Description field and type a description for a data type
  await elements.typeInputField(page, '#dataType_Description', dataTypeDescName);

  // select a random value for System Type
  await dataElements.chooseOptionValue(page, '#systemType option', 'systemType');

  // screenshot of data type window
  await page.screenshot({path: './test/BEXIS2_Data_Type/dataTypeWindow.png'});

  // click Save button
  await page.click('#saveButton');

  // after saving a data type data type window shouldn't be in view model
  await page.waitForSelector('#DataTypeWindow', { visible: false });

  // check error messages of the data type window
  // should not be visible at all and should not contain any errors
  const checkErrMsg = await elements.hasErrors(page, '#name > td.bx-errorMsg');
  assert.isFalse(checkErrMsg, 'should not show any errors');

  // check for an entry by Description Name in the list of data types
  const checkEntry = await elements.hasEntry(page, '#bx-rpm-dataTypeGrid > table > tbody > tr', dataTypeDescName, '5');
  assert.isTrue(checkEntry, 'should contain the new data type in the table');
}

/** Delete a Data Type
 *
 * @param {Object} page
 * @param {Object} util
 * @param {Object} elements
 * @param {string} dataTypeName
 * @param {string} dataTypeDescName
 */

async function deleteDataType(page, util, assert, elements, dataTypeName, dataTypeDescName) {

  // navigate to "Manage Data Types"
  await util.menu.select(page, 'Manage Data Types');

  // wait for button Create Data Type is loaded in view model
  await page.waitForSelector('body > div.main-content.container-fluid > table > tbody > tr > td > div > div.bx-rpm-buttons > a', { visible: true });

  // after clicking delete icon alert box is shown -> click Ok
  page.on('dialog', async dialog => { await dialog.accept(); });

  // click Delete button
  const deleteButton = await page.$$((`a[title*="${dataTypeName}"]`));
  await deleteButton[1].click();

  // wait for button Create Data Type is loaded in view model
  await page.waitForSelector('body > div.main-content.container-fluid > table > tbody > tr > td > div > div.bx-rpm-buttons > a', { visible: true });

  // check for an entry by Description Name in the list of data types
  const checkEntry = await elements.hasEntry(page, '#bx-rpm-dataTypeGrid > table > tbody > tr', dataTypeDescName, '5');
  assert.isFalse(checkEntry, 'should not contain the new data type in the table');
}

/** Edit a Data Type
 *
 * @param {Object} page
 * @param {string} dataTypeName
 */

async function editDataType(page, dataTypeName) {

  // click edit button
  const editButton = await page.$$((`a[title*="${dataTypeName}"]`));
  await editButton[0].click();
}

/** Choose an option from a select element
 *
 * @param {Object} page
 * @param {string} selector
 * @param {string} selectName
 */

async function chooseOptionValue(page, selector, selectName) {

  // gets values from select element and selects an option
  const optionValues = await page.evaluate((selector) => Array.from(document.querySelectorAll(selector), (val) => val.value), selector);

  const randomOptionValue = Math.floor(Math.random() * optionValues.length);

  await page.select(`select[name="${selectName}"]`, optionValues[randomOptionValue]);

  // if DateTime is chosen, selects a value for Pattern field
  if (optionValues[randomOptionValue] === 'DateTime') {

    const patternValues = await page.evaluate(() => Array.from(document.querySelectorAll('#pettern option'), (val) => val.getAttribute('value')));

    const randomPatternValue = Math.floor(Math.random() * patternValues.length);

    await page.select('select[name="pattern"]', patternValues[randomPatternValue]);
  }
}

/** Choose an option from a select element
 *
 * @param {Object} page
 * @param {Object} elements
 * @param {string} dataTypeDescName
 */

async function filterDescription(page, elements, dataTypeDescName) {

  // click filter icon for Description header
  await page.click('#bx-rpm-dataTypeGrid > table > thead > tr > th:nth-child(5) > div');

  // type in first input field description name of the data type in dropdown
  await elements.typeInputField(page, '#bx-rpm-dataTypeGrid div.t-animation-container div input[type=text]:nth-child(4)', dataTypeDescName);

  // check description name text - in case of removal add waitFor()
  await page.screenshot({path: './test/BEXIS2_Data_Type/filterDescName.png'});

  // click Filter button and wait for navigation
  await Promise.all([
    page.waitForNavigation(),
    page.click('#bx-rpm-dataTypeGrid > div.t-animation-container > div > button.t-button.t-button-icontext.t-button-expand.t-filter-button'),
  ]);
}