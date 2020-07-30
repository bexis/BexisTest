/**
 * handle BEXIS 1 related functions
 */

import Config     from '../../config';

export default {
  loginUserBEXIS1:  (page) => loginBEXIS1( page, 'normal' ),
  checkAndLoginUser_BEXIS1,
  countDS_BEXIS1,
  returnTable_unstructured_BEXIS1,
  returnTable_structured_BEXIS1,
  returnTable_metadata_BEXIS1,
};


/**
 * login
 *
 * @param   {Object}    page      page to work upon
 * @param   {String}    userType  type of user
 */
async function loginBEXIS1( page, userType = 'normal') {

  // wait for login page
  await page.waitForSelector ('#ctl00_ctl00_ContentPlaceHolder_Main_ContentPlaceHolder_Page_LoginView1_Login1_UserName');

  // fill user name and password
  if (userType == 'normal'){
    await page.type('#ctl00_ctl00_ContentPlaceHolder_Main_ContentPlaceHolder_Page_LoginView1_Login1_UserName'  , Config.browser2.userNormal.userName);
    await page.type('#ctl00_ctl00_ContentPlaceHolder_Main_ContentPlaceHolder_Page_LoginView1_Login1_Password'  , Config.browser2.userNormal.password);
  }
  else if (userType == 'admin'){
    await page.type('#ctl00_ctl00_ContentPlaceHolder_Main_ContentPlaceHolder_Page_LoginView1_Login1_UserName'  , Config.browser2.userAdmin.userName);
    await page.type('#ctl00_ctl00_ContentPlaceHolder_Main_ContentPlaceHolder_Page_LoginView1_Login1_Password'  , Config.browser2.userAdmin.password);
  }
  // submit
  await page.click( '#ctl00_ctl00_ContentPlaceHolder_Main_ContentPlaceHolder_Page_LoginView1_Login1_LoginButton' );

  // wait for landing page after login.
  await page.waitForSelector( '#ctl00_ctl00_LoginStatus1');
}


/**
 * Check if user is already logged in. Only login again, if logged out.
 *
 * @param {Object} page to work upon
 */
async function checkAndLoginUser_BEXIS1 (page) {

  // ensure user is logged in BEXIS 1
  const elem = await page.$x('//a[text()="Login"]');

  // ensure user is logged in BEXIS 2
  if (await elem[0] != null){
    await loginBEXIS1(page, 'normal');
  }

}

/**
 * Return total count of dataset in BEXIS 1
 *
 * @param {Object} page
 */
async function countDS_BEXIS1( page ) {
  const countDS = await page.$eval( '#ctl00_ContentPlaceHolder_Main_BlockDataControl2_Label_NumObs', (el) => el.textContent );

  return parseInt(countDS);
}

/**
   * Return table content from unstructured table in BEXIS 1
   *
   * @param {Object} page
   */
async function returnTable_unstructured_BEXIS1( page ) {
  return await returnTable_BEXIS1( page , 'ctl00_ContentPlaceHolder_Main_GridView1');
}

/**
   * Return table content from structured table in BEXIS 1
   *
   * @param {Object} page
   */
async function returnTable_structured_BEXIS1( page ) {
  return await returnTable_BEXIS1( page , 'ctl00_ContentPlaceHolder_Main_BlockDataControl2_GridView1', ':not(:first-child)');
}

/**
   * Return table content from structured table in BEXIS 1
   *
   * @param {Object} page
   */
async function returnTable_metadata_BEXIS1( page ) {
  return await returnTable_BEXIS1( page , 'ctl00_ContentPlaceHolder_Main_Label_metadataContent');
}

/**
   * Return result table in BEXIS 1
   *
   * @param {Object} page
   */
async function returnTable_BEXIS1( page , tableId, rowCondition = '') {
  const result = await page.evaluate((tableId, rowCondition) => {
    const rows = document.querySelectorAll(`#${tableId} tr`);
    return Array.from(rows, row => {
      const columns = row.querySelectorAll(`td${rowCondition}`);
      return Array.from(columns, column => column.textContent);
    });
  }, tableId, rowCondition);

  return result;
}
