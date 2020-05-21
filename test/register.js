import Browser    from '../util/Browser';
import util       from '../util/common';
import { assert } from 'chai';

describe( 'Registration', () => {

  it( 'should show an error when missing username', async () => {

    // get a tab
    const page = await Browser.openTab();

    // navigate to "Register"
    await assert.isFulfilled( util.menu.select( page, 'Register' ), 'should open the register page' );

    // fill all fields but the username
    await assert.isFulfilled( page.type( '#Email', 'someone@example.org' ), 'should enter an email' );
    await assert.isFulfilled( page.type( '#Password', '123' ),              'should enter an password' );
    await assert.isFulfilled( page.type( '#ConfirmPassword', '123' ),       'should enter an password confirmation' );
    await assert.isFulfilled( page.click( '#TermsAndConditions' ),          'should check terms&conditions' );
    await assert.isFulfilled( page.click( '#PrivacyPolicy' ),               'should check privacy policy' );

    // submit
    await assert.isFulfilled( page.click( 'input[value="Register"]' ), 'should click the register button' );

    // proper error message shown?
    await assert.isFulfilled( page.waitForSelector( '.validation-summary-errors', { visible: true }),
                              'should show warning messages' );
    const errorMsg = await page.$eval( '.validation-summary-errors', (el) => el.textContent );
    assert.equal( errorMsg, 'The Username field is required.', 'should only include the username error' );

  });

});
