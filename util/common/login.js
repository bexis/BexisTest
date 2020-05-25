/**
 * handle login / log off
 */
import Config     from '../../config';
import util       from '../common';


export default {
  loginUser:  (page) => login( page, 'normal' ),
  loginAdmin:  (page) => login( page, 'admin' ),
  logoff: logoff,
};


/**
 * login
 *
 * @param   {Object}    page      page to work upon
 * @param   {String}    userType  type of user
 */
async function login( page, userType = 'normal') {

  if (await checkLogin( page )){logoff(page);}

  // navigate to "Login"
  await util.menu.select( page, 'Login' );
  // ensure page is open
  await page.waitForSelector ('#UserName');

  // fill user name and password
  if (userType == 'normal'){
    await page.type( '#UserName', Config.browser.userNormal.userName);
    await page.type( '#Password', Config.browser.userNormal.password);
  }
  else if (userType == 'admin'){
    await page.type( '#UserName', Config.browser.userAdmin.userName);
    await page.type( '#Password', Config.browser.userAdmin.password);
  }
  // submit
  await page.click( 'input[value="Log in"]' );

  // wait for landing page after login. Attension: This may differ according to instance settings!!!
  await page.waitForSelector ('#search_Components');
}

/**
 * Log off
 * @param {Object} page
 */
async function logoff( page ) {

  if (await checkLogin( page )){
    // navigate to "Log Off"
    await util.menu.select( page, 'Log Off' );
  }
}

/**
 *  Check if any user is logged in
 *
 * @param {Object} page
 * @returns {Promise<boolean>}
 */
async function checkLogin ( page ){
  const $el = await page.$( '#registerLink' );
  if ($el != null){
    return false;
  }
  else
    return true;
}
