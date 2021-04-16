/**
 * handle find certain elements
 */
import { assert } from 'chai';

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
  clickAnyElementByText,
  findTableRowByTableCellText,
  filterTable_Telerik,
  filterTable_Telerik2,
  extractFirstRowNthColumnValue_Telerik,
  returnSelectContent,
  returnSelectContentAndValue,
  returnContent,
  sortTable,
  clearInputField,
  typeInputField,
  hasEntry,
  hasErrors


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
 * Find label element by text and click on it
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
 * Find any element by text and click on it
 *
 * @param {Object} page
 * @param {string} text
 */
async function clickAnyElementByText(page, text){
  const element = await page.$x(`//*[contains(text(), '${text}')]`);
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

  await page.waitForSelector( '#divResultGrid > div > table > thead > tr > th:nth-child(1) > div', { visible: true });

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
  await assert.isFulfilled(page.click( '#' + id +' > div > table > thead > tr > th:nth-child(' + pos + ') > div' ), 'open filter');

  page.waitFor(2000);
  // wait until filter form is open
  await assert.isFulfilled( page.waitForSelector(  '#' + id + ' .t-clear-button', { visible: true }), 'wait for open filter');

  await assert.isFulfilled( page.click (id_text, { clickCount: 3}), 'delete previous filter text');
  // fill first text field with search string
  await assert.isFulfilled( page.type(id_text , filterText), 'add filter text');

  // filter
  await page.focus('#' + id + ' .t-filter-button' );
  await page.keyboard.type('\n');
  page.waitFor(2000);

  // wait for result table
  await assert.isFulfilled( page.waitForSelector( '.t-status-text', { visible: true }), 'wait table is loaded');

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
 * @param {Object} page page to work upon
 * @param {string} selectID id
 */
async function returnSelectContent( page, selectID) {
  const result =  await page.evaluate((selectID) => {
    const rows = document.querySelectorAll(`#${selectID} option`);
    return Array.from(rows, row => row.textContent);
  }, selectID);
  return result;
}

/**
 * @param {object} page page to work upon
 * @param {string} selectID id
 */
async function returnSelectContentAndValue( page, selectID ) {
  return  page.$eval('#' + selectID , (tab) => {
    const option = tab.querySelectorAll( 'option' );
    var result = [];
    for (let index = 0; index < option.length; index++) {
      result.push({
        name:   option[index].textContent,
        value:  option[index].value,
      });
    }
    return result;
  });
}

/**
 * Return content
 * @param {Object} page page to work upon
 * @param {string} selector
 */
async function returnContent( page, selector) {
  const result = await page.evaluate((selector) => {
    const rows = document.querySelectorAll(selector);
    return Array.from(rows, row => row.textContent);
  }, selector);
  return result;
}

/**
 * Clear an Input field
 *
 * @param {Object} page to work upon
 * @param {string} selector element selector
 */
async function clearInputField(page, selector) {
  await page.evaluate(selector => {
    document.querySelector(selector).value = '';
  }, selector);
}

/**
 * Type in Input field
 *
 * @param {Object} page
 * @param {string} selector
 * @param {string} text
 */

async function typeInputField(page, selector, text) {
  await page.evaluate((selector, text) => {
    document.querySelector(selector).value = text;
  }, selector, text);
}

/**
 * Type in Input field
 *
 * @param {Object} page
 * @param {string} table
 * @param {string} entry
 * @param {string} tdChild
 */

async function hasEntry(page, table, entry, tdChild){
  const result =  await page.$$eval(table, (rows, entry, tdChild) => {
    return rows.some((tr) => tr.querySelector(`td:nth-child(${tdChild})`).textContent.trim() == entry);
  }, entry, tdChild);
  return result;
}

/**
 * Checks error message fields for form windows
 *
 * @param {Object} page
 * @param {string} errMsgField
 */

async function hasErrors(page, errMsgField) {
  return await page.evaluate((errMsgField) => Array
    .from(document.querySelectorAll(errMsgField))
    .some((el) => el.textContent.trim()), errMsgField);
}

/**
 * Sort table by given row number
 *
 * @param {Object} page
 * @param {string} rowNumber
 */
async function sortTable ( page , rowNumber){

  // Add class to identify changed table content
  await page.evaluate(() => {
    document.querySelectorAll('#PrimaryDataResultGrid > table > tbody > tr:nth-child(1)')[0].classList.add('show_table');
  });

  // Filter by first column
  await assert.isFulfilled( page.click('#PrimaryDataResultGrid > table > thead > tr:nth-child(1) > th:nth-child('+rowNumber+') > a:nth-child(1)'), 'click first row to sort')
  ;

  // Wait until added class is removed -> replace by new content
  await assert.isFulfilled( page.waitForSelector( '.show_table', { hidden: true }), 'should wait for result table' );

}