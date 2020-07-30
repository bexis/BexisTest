/**
 * handle find certain elements
 */


export default {
  itemNumber_Telerik,
  //itemNumber_DataTables : itemNumber_DataTables
  returnTableContent_Telerik,
  returnTableContentPermission_Telerik,
  returnTableContent_MMM,
  returnMetadataValueContent,
  clickElementByLabelText,
  clickElementByLinkText,
  clickElementBySpanText,
  findTableRowByTableCellText,
  filterTable_Telerik,
  filterTable_Telerik2,
  extractFirstRowNthColumnValue_Telerik,
  returnSelectContent
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
 * Return table content from telerik table
 *
 * @param {Object} page page to work upon
 * @param {String} tableId table id
 */
async function returnTableContent_Telerik( page, tableId ) {
  const result = await page.evaluate((tableId) => {
    const rows = document.querySelectorAll(`#${tableId} tr`);
    return Array.from(rows, row => {
      const columns = row.querySelectorAll('td');
      return Array.from(columns, column => column.innerText);
    });
  }, tableId);
  return result;
}


/**
 * Return table content from permission table
 *
 * @param {Object} page page to work upon
 * @param {String} tableId table id
 */
async function returnTableContentPermission_Telerik( page, tableId ) {
  return  page.$eval('#' + tableId , (tab) => {
    const rows = tab.querySelectorAll( 'tbody tr' );
    var result = [];
    for (let index = 0; index < rows.length; index++) {
      const cells = rows[index].querySelectorAll( 'td' );
      result.push({
        name:   cells[0].textContent,
        type:   cells[1].textContent,
        read:   cells[2].querySelector( 'input' ).checked,
        write:  cells[3].querySelector( 'input' ).checked,
        delete: cells[4].querySelector( 'input' ).checked,
        grant:  cells[5].querySelector( 'input' ).checked,
      });
    }
    return result;
  });
}

/**
 * Return table content from telerik table
 *
 * @param {Object} page page to work upon
 */
async function returnTableContent_MMM( page) {
  const result = await page.evaluate(() => {
    const rows = document.querySelectorAll('.mmm-Container tr.hidden');
    return Array.from(rows, row => {
      const columns = row.querySelectorAll('td');
      return Array.from(columns, column => column.innerText);
    });
  });
  return result;
}

/**
 * Return metadata table content
 *
 * @param {Object} page page to work upon
 */
async function returnMetadataValueContent( page ) {
  const result = await page.evaluate(() => {
    const rows = document.querySelectorAll('#MetadataEditor tr');
    return Array.from(rows, row => {
      const columns = row.querySelectorAll('td');
      return Array.from(columns, column => column.innerText);
    });
  });
  return result;
}

/**
 * Find lable element by text and click on it
 *
 * @param {{ $x: (arg0: string) => any; }} page
 * @param {string} text
 */
async function clickElementByLabelText(page, text){
  const element = await page.$x('//label[text() ="'+text+'"]');
  await (await element[0].asElement()).click();
}

/**
 * Find link element by text and click on it
 *
 * @param {Object} page
 * @param {string} text
 */
async function clickElementByLinkText(page, text){
  const element = await page.$x('//a[text() ="'+text+'"]');
  await (await element[0].asElement()).click();
}

/**
 * Find span element by text and click on it
 *
 * @param {Object} page
 * @param {string} text
 */
async function clickElementBySpanText(page, text){
  const element = await page.$x('//span[text() ="'+text+'"]');
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

  await page.waitForSelector(  '.t-clear-button', { visible: true });

  await page.type('input[type=text]'  , filterText);

  await page.click( '.t-filter-button' );

  await page.waitForSelector( '.t-status-text', { visible: true });

}

/**
 * Filter Telerik table based on ids (more than one table on one page)
 *
 * @param {Object} page
 * @param {any} filterText  text string for filter
 * @param {string} pos  position of filter relted to all rows
 * @param {string} id table id
 * @param {any} id_text id or path to 1st text field in the filter view
 */
async function filterTable_Telerik2(page, filterText, pos, id, id_text){

  // search for filter and open
  await page.click( '#' + id +' > div > table > thead > tr > th:nth-child(' + pos + ') > div' );

  // wait until filter form is open
  await page.waitForSelector(  '#' + id + ' .t-clear-button', { visible: true });

  // fill first text field with search string
  await page.type(id_text , filterText);

  // filter
  await page.click(  '#' + id + ' .t-filter-button' );

  // wait for result table
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
  const result =  await page.evaluate( ( tableId, nthColumn) => {
    const result = document.querySelector(`#${tableId} tbody tr:nth-child(1) td:nth-child(${nthColumn})`).textContent;
    return result;
  }, tableId, nthColumn);

  return result;
}


/**
 * Return table content from telerik table
 *
 * @param {Object} page page to work upon
 */
async function returnSelectContent( page) {
  const result = await page.evaluate(() => {
    const rows = document.querySelectorAll('#VersionSelect option');
    return Array.from(rows, row => row.textContent);
  });
  return result;
}