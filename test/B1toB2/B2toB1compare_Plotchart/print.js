import Browser    from '../../../util/Browser';
import { assert } from 'chai';
import login from '../../../util/common/login';
import elements from '../../../util/common/elements';
import bexis1 from '../../../util/common/bexis1';

let plotlistB1 = [];
let plotlistExpB1 = [];
let plotlistB2;


describe( 'Plot charts', () => {

  getPLotLists();

});


async function getPLotLists(){
  it('get plotlist in B1% B2', async function() {
    this.timeout(0);

    // open tab
    const page2 = await Browser.openTab(true);

    // ensure user is logged in BEXIS 1
    await bexis1.loginUserBEXIS1(page2);

    await page2.goto('https://www.bexis.uni-jena.de/PlotChart/PlotchartExp.aspx');

    await assert.isFulfilled( page2.waitForSelector( '#ctl00_ctl00_ContentPlaceHolder_Main_ContentPlaceHolder_Page_DropDownList_Plotchart', { visible: true }), 'should wait for global / region' );

    plotlistExpB1 =  await elements.returnSelectContentAndValue(page2, 'ctl00_ctl00_ContentPlaceHolder_Main_ContentPlaceHolder_Page_DropDownList_Plotchart');



    await page2.goto('https://www.bexis.uni-jena.de/Plotchart/Plotchart.aspx');

    await assert.isFulfilled( page2.waitForSelector( '#ctl00_ctl00_ContentPlaceHolder_Main_ContentPlaceHolder_Page_DropDownList_Plotchart', { visible: true }), 'should wait for global / region' );

    plotlistB1 =  await elements.returnSelectContentAndValue(page2, 'ctl00_ctl00_ContentPlaceHolder_Main_ContentPlaceHolder_Page_DropDownList_Plotchart');

    // open a new tab in BEXIS 2
    const page = await Browser.openTab();

    // ensure a normal user is logged in BEXIS 2
    await login.loginUser (page);

    await page.goto('http://be2020-dev.inf-bb.uni-jena.de:2020/pmm/main/SubPlots', {'waitUntil' : 'networkidle0'});

    await assert.isFulfilled( page.waitForSelector( '#plotlist', { visible: true }), 'should wait for global / region' );

    plotlistB2 = await elements.returnSelectContentAndValue(page, 'plotlist');
    await page2.evaluate(() => {
      document.querySelectorAll('#ctl00_ctl00_ContentPlaceHolder_Main_ContentPlaceHolder_Page_Panel11')[0].classList.add('show_table');
    });
    await elements.clickElementByLabelText(page2, 'include former subplots');

    await assert.isFulfilled( page2.waitForSelector( '.show_table', { hidden: true }), 'should wait for result table' );

    await page2.evaluate(() => {
      document.querySelectorAll('#ctl00_ctl00_ContentPlaceHolder_Main_ContentPlaceHolder_Page_Panel11')[0].classList.add('show_table');
    });

    await elements.clickElementByLabelText(page2, 'Draw beyond plot borders');
    await assert.isFulfilled( page2.waitForSelector( '.show_table', { hidden: true }), 'should wait for result table' );

    assert.isFulfilled( page2.waitForSelector( 'ctl00_ctl00_ContentPlaceHolder_Main_ContentPlaceHolder_Page_Panel11', { visible: true }), 'should wait for global / region' );

    /**   for (let index = 0; index < plotlistB1.length; index++) {
      await page2.evaluate(() => {
        document.querySelectorAll('#ctl00_ctl00_ContentPlaceHolder_Main_ContentPlaceHolder_Page_Panel11')[0].classList.add('show_table');
      });

      await page2.select('select#ctl00_ctl00_ContentPlaceHolder_Main_ContentPlaceHolder_Page_DropDownList_Plotchart', plotlistB1[index].value);
      await assert.isFulfilled( page2.waitForSelector( '.show_table', { hidden: true }), 'should wait for result table' );
      await page2.waitFor(20);
      await page2.screenshot({path: 'results/plots/'+ plotlistB1[index].value +'_B1_former_beyond.png'});
    }*/

    console.log(plotlistB1);
    for (let index = 0; index < plotlistB1.length; index++) {
      const plot = plotlistB2.find(o => o.name ===  plotlistB1[index].value);
      if (plot){
        await page.select('select#plotlist', plot.value);
        await page.waitFor(3000);
        //  await page.waitForNavigation({'waitUntil' : 'networkidle0'});
        await page.screenshot({path: 'results/plots/'+ plotlistB1[index].value +'_B2.png'});
      }
    }

  });
}