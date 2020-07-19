/**
 * handle find certain elements
 */


export default {
  itemNumber_Telerik : itemNumber_Telerik,
  //itemNumber_DataTables : itemNumber_DataTables
  clickElementByLabelText : clickElementByLabelText,
  findTableRowByTableCellText : findTableRowByTableCellText,
  filterTable_Telerik : filterTable_Telerik,
  extractFirstRowNthColumnValue_Telerik : extractFirstRowNthColumnValue_Telerik
};


/**
 * Return total number from telerik table
 *
 * @param {Object} page page to work upon
 */
async function itemNumber_Telerik( page ) {
  const itemNumberString = /**
   * @param {{ textContent: any; }} el
   */
 await page.$eval( '.t-status-text', (el) => el.textContent );
  const itemNumber = itemNumberString.split(' ');

  return parseInt(itemNumber[6]);
}


/**
 * Find element by lable and click on it
 *
 * @param {{ $x: (arg0: string) => any; }} page
 * @param {string} text
 */
async function clickElementByLabelText(page, text){
  const element = await page.$x('//label[text() ="'+text+'"]');
  await (await element[0].asElement()).click();
}

/**
 * Return table row, which contains a certain value
 *
 * @param {Object} page
 * @param {string} text
 */
async function findTableRowByTableCellText(page, text){
  const element = await page.$x('//tr/td[text()="'+text+'"]/..');
  return  await element[0].asElement();
}

/**
 * Filter Telerik table
 *
 * @param {Object} page
 * @param {any} filterText
 */
async function filterTable_Telerik(page, filterText){

  await page.click( '#divResultGrid > div > table > thead > tr > th:nth-child(1) > div' );

  await  page.waitForSelector(  '.t-clear-button', { visible: true });

  await page.type('input[type=text]'  , filterText);

  await page.click( '.t-filter-button' );

  await page.waitForSelector( '.t-status-text', { visible: true });

}

/**
 * Extract the value from the nth column in the first row (Telerik)
 *
 * @param {Object} page
 * @param {string} tableId
 * @param {string} nthColumn
 */
async function extractFirstRowNthColumnValue_Telerik(page, tableId, nthColumn ){
  const result =  await page.evaluate(`(async() => {
    const result = document.querySelector('#`+ tableId +' tbody tr:nth-child(1) td:nth-child('+ nthColumn +`)').textContent;
    return result;
  })()`);

  return result;
}