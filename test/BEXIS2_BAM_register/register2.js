import Browser    from '../../util/Browser';
import util       from '../../util/common';
import { assert } from 'chai';

describe( 'Registration', () => {
  createRegistrationTest( 'username',             'The Username field is required.' );
  createRegistrationTest( 'email',                'The Email field is required.' );
  createRegistrationTest( 'password',             'The Password field is required.' );
  createRegistrationTest( 'passwordconfirmation', 'The Confirm password field is required.' );
  createRegistrationTest( 'terms',                'You must agree to the Terms and Conditions before register.' );
  createRegistrationTest( 'privacy',              'You must agree to the Privacy Policy before register.' );

});


/**
 * create a test for registration with one field not filled
 *
 * @param   {String}    skipped     field to be left empty
 * @param   {String}    expMsg      expected error message
 */
function createRegistrationTest( skipped, expMsg ) {

  it( `should show an error when missing ${skipped}`, async () => {

    // get a tab
    const page = await Browser.openTab();
    // login.loginNormalAdmin();
    // navigate to "Register"
    await assert.isFulfilled( util.menu.select( page, 'Register' ), 'should open the register page' );

    // fill all fields but the username
    if( !('username' == skipped) ){
      await assert.isFulfilled( page.type( '#UserName', 'someone' ),          'should enter an username' );
    }
    if( !('email' == skipped) ){
      await assert.isFulfilled( page.type( '#Email', 'someone@example.org' ), 'should enter an email' );
    }
    if( !('password' == skipped) ){
      await assert.isFulfilled( page.type( '#Password', '123' ),              'should enter an password' );
    }
    if( !('passwordconfirmation' == skipped) ){
      await assert.isFulfilled( page.type( '#ConfirmPassword', '123' ),       'should enter an password confirmation' );
    }
    if( !('terms' == skipped) ){
      await assert.isFulfilled( page.click( '#TermsAndConditions' ),          'should check terms&conditions' );
    }
    if( !('privacy' == skipped) ){
      await assert.isFulfilled( page.click( '#PrivacyPolicy' ),               'should check privacy policy' );
    }

    // submit
    await assert.isFulfilled( page.click( 'input[value="Register"]' ), 'should click the register button' );

    // proper error message shown?
    await assert.isFulfilled( page.waitForSelector( '.validation-summary-errors', { visible: true }),
                              'should show warning messages' );
    const errorMsg = await page.$eval( '.validation-summary-errors', (el) => el.textContent );
    assert.equal( errorMsg, expMsg, `should only include the ${skipped} error` );

  });

}