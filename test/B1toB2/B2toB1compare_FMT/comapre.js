import Browser    from '../../../util/Browser';
import { assert } from 'chai';
import login from '../../../util/common/login';
import elements from '../../../util/common/elements';
import bexis1 from '../../../util/common/bexis1';


var linkList = [];


describe( 'Compare exploratory files (FMT)', () => {

  compareFlies();

  for (let index = 0; index < 100; index++) {
    checkLink(index);
  }


});
async function checkLink (index){
  it(index + ' - check link ', async function() {
    const page = await Browser.openTab();
    console.log(linkList[index]);
    const response = await page.goto( linkList[index]);

    page.waitFor(2000);
    assert.equal(response.status(), 200, '' );
  });


}

async function compareFlies(){
  it('compare ', async function() {

    // open tab
    const page2 = await Browser.openTab(true);

    // ensure user is logged in BEXIS 1
    await bexis1.loginUserBEXIS1(page2);

    await page2.goto('https://www.bexis.uni-jena.de/BeoInformation/GeneralInformation.aspx');

    await assert.isFulfilled( page2.waitForSelector( '#pageContent', { visible: true }), 'should wait for page content' );

    let linksB1 = await elements.returnContent(page2, '#pageContent a');
    console.log(linksB1);

    // open a new tab in BEXIS 2
    const page = await Browser.openTab();

    // ensure a normal user is logged in BEXIS 2
    await login.loginUser (page);

    await page.goto('http://be2020-dev.inf-bb.uni-jena.de:2020/FMT/GeneralFiles/Show?viewName=GeneralFiles&rootMenu=BeoInformation');

    await assert.isFulfilled( page.waitForSelector( '#information-container', { visible: true }), 'should wait page content');

    // click #FMT__BeoInformation__GeneralInformation

    let linksB2 = await elements.returnContent(page, '#exploinfo li');
    const selector = '#exploinfo a';

    linkList = await page.evaluate((selector) => {
      const rows = document.querySelectorAll(selector);
      return Array.from(rows, row => row.href);
    }, selector);



    console.log(linksB1, linksB2);
    let linkDiff = linksB1;
    for (let index = 0; index < linksB1.length; index++) {
      for (let a = 0; a < linksB2.length; a++) {
        if (linksB2[a].includes(linksB1[index].trim())){
          linkDiff.splice(index, 1);
        }
      }
    }
    assert.deepEqual(linkDiff, [], 'Archived & double links & diff' );

  });
}