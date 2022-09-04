import Browser    from '../../util/Browser';
import util       from '../../util/common';
import Config     from '../../config';
import { assert } from 'chai';
import login from '../../util/common/login';

describe( 'Login', () => {

  it( 'should show an error when login with user name was not successful', async () => {

    // get a tab
    const page = await Browser.openTab();

    // ensure no user is logged in
    await login.logoff (page);

    // navigate to "Login"
    await assert.isFulfilled( util.menu.select( page, 'Login' ), 'should open the register page' );

    // fill all fields
    await assert.isFulfilled( page.type( '#UserName', Config.browser.userNormal.userName ), 'should enter an email' );
    await assert.isFulfilled( page.type( '#Password', Config.browser.userNormal.password ),  'should enter an password' );


    // submit
    await assert.isFulfilled( page.click( 'input[value="Log in"]' ), 'should click the login button' );

    await assert.isFulfilled( page.waitForSelector( '#search_Components', { visible: true }), 'wait for search page' );

    await assert.isFulfilled( util.menu.select( page, 'Log Off' ), 'should click the log off button' );

  });

});
