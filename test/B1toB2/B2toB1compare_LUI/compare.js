import Browser    from '../../../util/Browser';
import { assert } from 'chai';
import login from '../../../util/common/login';
import elements from '../../../util/common/elements';
import lui_calc from '../../BE/BE_LUI/check';
import bexis1 from '../../../util/common/bexis1';


describe( 'Compare LUI calculation', () => {

  // check only B1
  it('B1 Lui test', async () => {
    // open tab
    const page2 = await Browser.openTab(true);

    // ensure user is logged in BEXIS 1
    await bexis1.loginUserBEXIS1(page2);

    // LUI calculation. Returns value row for plot AEG1
    const result = await calculateLUIBEXIS1( page2, 'old components set', 'global', ['HAI', 'SCH'], ['2012', '2013'], 'overall', 'EPs');

    // extract value
    const value = await page2.evaluate(e => e.children[6].textContent, result);

    // compare with expected value for LUI
    assert.equal( value, '2,34', 'should have same result ');

  });

  it.skip('Compare', async () => {

    // open a new tab in BEXIS 2
    const page = await Browser.openTab();

    // ensure a normal user is logged in BEXIS 2
    await login.loginUser (page);

    // calculate LUI in BEXIS 2
    const valueB2 = await lui_calc.calculateLUI( page, 'old components set', 'global', ['HAI', 'SCH'], ['2012', '2013'], 'overall', 'EPs');

    // open new tab in BEXIS 1
    const page2 = await Browser.openTab(true);

    // ensure a normal user is logged in BEXIS 1
    await bexis1.loginUserBEXIS1(page2);

    // calculate LUI in Bexis 1
    const resultB1 = await calculateLUIBEXIS1( page2, 'old components set', 'global', ['HAI', 'SCH'], ['2012', '2013'], 'overall', 'EPs');
    const valueB1 = await page2.evaluate(e => e.children[6].textContent, resultB1);

    // compare LUI values between BEXIS 1 and BEXIS 2
    assert.equal ( valueB2.replace('.', ','), valueB1, 'should have same result ');

  });

});


/**
 * Calculate LUI in BEXIS 1
 *
 * @param {import("puppeteer").Page} page2
 * @param {String} type allowed values are: old components set, new components set
 * @param {String} regional_global allwoed values are; regional, global
 * @param {Array} exploratories allowed values are: ALB, HAI, SCH
 * @param {Array} years allowed values are: 2006 to (currently) 2018
 * @param {String} seperate_overall allowed values are: separately or overall
 * @param {String} vip_mip_ep allowed values are: VIPs, MIPs, EPs
 */
async function calculateLUIBEXIS1 ( page2, type, regional_global, exploratories, years, seperate_overall, vip_mip_ep){

  // navigate to LUI page
  await assert.isFulfilled( page2.goto( 'https://www.bexis.uni-jena.de/LuiTool/LuiTool.aspx?DatasetId=25086' ), 'should open LUI tool' );

  // replace by text in BEXIS 1
  if (type == 'new components set'){
    type = 'New components set';
  }
  if (type == 'old components set'){
    type = 'Old components set';
  }
  // select base data
  await assert.isFulfilled( elements.clickElementByLabelText(page2, type), 'should select input data (old / new)');

  // wait for form relaod after selection
  await assert.isFulfilled( page2.waitForSelector( '#ctl00_ctl00_ContentPlaceHolder_Main_ContentPlaceHolder_Page_RadioButtonList1_RawVsCalc_1', { visible: true }), 'should wait for form reload' );

  // select LUI calculation
  await assert.isFulfilled( elements.clickElementByLabelText(page2, 'standardized'), 'standardized');

  // wait for the selection for region or global
  await assert.isFulfilled( page2.waitForSelector( '#ctl00_ctl00_ContentPlaceHolder_Main_ContentPlaceHolder_Page_RadioButtonList2_Scale_1', { visible: true }), 'should wait for global / region' );

  // select region / global
  await assert.isFulfilled( elements.clickElementByLabelText(page2, regional_global), ' Select region or global');

  // wait to select explos
  await assert.isFulfilled( page2.waitForSelector( '#ctl00_ctl00_ContentPlaceHolder_Main_ContentPlaceHolder_Page_CheckBoxList_Explo_2', { visible: true }), 'should wait explo selection' );

  // select explos
  for (let i=0; i<exploratories.length; i++)
  {
    await assert.isFulfilled( elements.clickElementByLabelText(page2, exploratories[i]), 'select explo');
  }

  // select years
  for (let i=0; i<years.length; i++)
  {
    await assert.isFulfilled( elements.clickElementByLabelText(page2, years[i]), 'select a year');
  }

  // confirm selection
  await assert.isFulfilled( page2.click( '#ctl00_ctl00_ContentPlaceHolder_Main_ContentPlaceHolder_Page_btnConfirmExploYear' ), 'should confirm selection' );

  // if more than 1 years is selceted the output format (seperate or overall) needs to be selected
  if (years.length > 1){
    await assert.isFulfilled( page2.waitForSelector( '#ctl00_ctl00_ContentPlaceHolder_Main_ContentPlaceHolder_Page_RadioButtonList3_typeOfMean_1', { visible: true }), 'should wait for output format selection' );
    await assert.isFulfilled( elements.clickElementByLabelText(page2, seperate_overall), 'should select seperatly or overall');
  }

  // wait for plot selection
  await assert.isFulfilled( page2.waitForSelector( '#ctl00_ctl00_ContentPlaceHolder_Main_ContentPlaceHolder_Page_RadioButtonList4_SelectPlots_2', { visible: true }), 'should wait for plot selection' );

  // select plot aggregation
  await assert.isFulfilled( elements.clickElementByLabelText(page2, vip_mip_ep), 'select VIPs, MIPs or EPs');

  // wait start LUI calculation
  await assert.isFulfilled( page2.waitForSelector( '#ctl00_ctl00_ContentPlaceHolder_Main_ContentPlaceHolder_Page_btnCalculateLUI', { visible: true }), 'should wait to start LUI calculation' );

  // start LUI calculation
  await assert.isFulfilled( page2.click( '#ctl00_ctl00_ContentPlaceHolder_Main_ContentPlaceHolder_Page_btnCalculateLUI' ), 'should select new dataset as base input' );

  // wait result table is shown
  await assert.isFulfilled( page2.waitForSelector( '#ctl00_ctl00_ContentPlaceHolder_Main_ContentPlaceHolder_Page_PanelResultLui', { visible: true }), 'should wait for result table' );

  // return LUI value for AEG1
  return await elements.findTableRowByTableCellText(page2, 'AEG1');
}