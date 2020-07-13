/**
 * handle find certain elements
 */


export default {
  itemNumber_Telerik : itemNumber_Telerik,
  //itemNumber_DataTables : itemNumber_DataTables
};


/**
 * Return total number from telerik table
 *
 * @param {Object} page page to work upon
 */
async function itemNumber_Telerik( page ) {
  const itemNumberString = await page.$eval( '.t-status-text', (el) => el.textContent );
  const itemNumber = itemNumberString.split(' ');

  return parseInt(itemNumber[6]);
}
