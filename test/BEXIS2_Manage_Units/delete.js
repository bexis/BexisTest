import Browser    from '../../util/Browser';
import util       from '../../util/common';
import { assert } from 'chai';

describe( 'Delete Unit', () => {
  it( 'delete the created unit', async () => {

    const page = await Browser.openTab();

    // navigate to "Manage Units"
    await assert.isFulfilled( util.menu.select( page, 'Manage Units' ), 'should open manage units page' );

    // wait until the container is loaded in view mode
    await assert.isFulfilled( page.waitForSelector( '#information-container', { visible: true }), 'wait for manage units page' );

    // click the filter button in the "Name" header
    await assert.isFulfilled( page.click( '#bx-rpm-unitGrid > table > thead > tr > th:nth-child(2) > div' ), 'should click the filter button for the "Name" column' );

    // enter name of the unit into first input area on the dropdown
    await assert.isFulfilled( page.type( '#bx-rpm-unitGrid > div.t-animation-container > div > input[type=text]:nth-child(4)', 'unit.test.name'), 'should enter the unit name into input area' );

    // click the "Filter" button on the dropdown for finding the new unit
    await assert.isFulfilled( page.click( '#bx-rpm-unitGrid > div.t-animation-container > div > button.t-button.t-button-icontext.t-button-expand.t-filter-button' ), 'should click the "Filter" button' );

    // after deleting alert box is shown -> click Ok
    page.on('dialog', async dialog => { await dialog.accept(); });

    // click the "Delete" icon to delete the unit
    await assert.isFulfilled( page.click( '#bx-rpm-unitGrid > table > tbody > tr > td:nth-child(8) > div > a.bx.bx-grid-function.bx-trash' ), 'should click the "Delete" icon' );
  });
});
