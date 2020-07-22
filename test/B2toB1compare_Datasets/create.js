import Browser    from '../../util/Browser';
import { assert } from 'chai';
import login from '../../util/common/login';
import elements from '../../util/common/elements';
import moment from '../../node_modules/moment';
import Config     from '../../config';
import ds_ids from '../B2toB1compare_Datasets/dataset_ids';


/** @type {number} */
var count_b1 = 0;
var count_b2 = 0;

var datesB1 = [];

var dataset_ids = ds_ids.dataset_Ids();
var dataset_subset = dataset_ids.slice(1130, 1200);



describe( 'Compare datasets', () => {

  for (let i = 0; i < dataset_subset.length; i++) {
    compare_datasets(dataset_subset[i]);
  }
  //compare_datasets(4302);

  it.only('print result for collected dates', async () => {
    console.log(datesB1);
  });

  // check only B1
  it('B1 get data', async () => {
    // open tab
    const page2 = await Browser.openTab(true);

    // ensure user is logged in BEXIS 1
    await login.loginUserBEXIS1(page2);

    // navigate to show data page
    await assert.isFulfilled( page2.goto( 'https://www.bexis.uni-jena.de/Data/ShowData.aspx?DatasetId=2320' ), 'should open show data page' );

    // get total number of datasets
    const count_b1 = await countDS_BEXIS1( page2);

    // get result table first page
    const resultTable = await returnTable_BEXIS1 (page2);
    console.log(resultTable);

    // compare with expected value total count
    assert.equal( count_b1, 1923, 'should have same result ');
  });

  // check only B2
  it('B2 get data', async () => {
    // open tab
    const page = await Browser.openTab();

    // ensure user is logged in BEXIS 2
    await login.loginUser(page);

    // navigate to dataset page
    await assert.isFulfilled( page.goto( Config.browser.baseURL + '/ddm/data/Showdata/2320' ), 'should dataset view' );

    // open primary data tab
    await assert.isFulfilled( page.click( '#primarydata' ), 'should select primary data' );

    // wait result table is shown
    await assert.isFulfilled( page.waitForSelector( '.t-status-text', { visible: true }), 'should wait for result table' );

    // get total number of datasets
    const count_b2 = await elements.itemNumber_Telerik ( page );

    // result table from first page
    const resultTable = await elements.returnTableContent_Telerik (page, 'PrimaryDataResultGrid');
    console.log(resultTable);

    // compare with expected value total count
    assert.equal( count_b2, 1923, 'should have same result ');
  });
});

/**
 * @param {string | number} id
 */
async function compare_datasets(id){
  // check only B1
  it.only(`${id} - compare data B1 & B2`, async () => {

    // unset count
    count_b1 = 0;
    count_b2 = 0;

    // open tab
    const page2 = await Browser.openTab(true);

    // ensure user is logged in BEXIS 1
    const element = await page2.$x('//a[text()="Logout"]');

    if (await element[0] == null){
      await login.loginUserBEXIS1(page2);
    }

    // navigate to show data page
    await assert.isFulfilled( page2.goto( Config.browser2.baseURL + '/Data/ShowData.aspx?DatasetId=' + id ), 'should open show data page' );

    // get total number of datasets
    count_b1 = await countDS_BEXIS1( page2);

    // get result table first page
    const resultTable_b1 = await returnTable_BEXIS1 (page2);
    //console.log(resultTable_b1);

    // open tab
    const page = await Browser.openTab();

    // ensure user is logged in BEXIS 1
    const elem = await page.$x('//a[text()="Login"]');

    // ensure user is logged in BEXIS 2
    if (await elem[0] != null){
      await login.loginUser(page);
    }

    // navigate to dataset page
    await assert.isFulfilled( page.goto( Config.browser.baseURL + '/ddm/data/Showdata/' + id ), 'should dataset view' );

    // open primary data tab
    await assert.isFulfilled( page.click( '#primarydata' ), 'should select primary data' );
    // wait result table is shown
    await assert.isFulfilled( page.waitForSelector( '.t-status-text', { visible: true }), 'should wait for result table' );

    // get total number of datasets
    count_b2 = await elements.itemNumber_Telerik ( page );

    // result table from first page
    const resultTable_b2 = await elements.returnTableContent_Telerik (page, 'PrimaryDataResultGrid');
    //console.log(resultTable_b2);

    // replace . by , for all number values
    for(var i=0; i < resultTable_b2.length; i++) {
      for(var j=0; j < resultTable_b2[i].length; j++) {
        resultTable_b2[i][j] = resultTable_b2[i][j].trim();
        if (parseFloat(resultTable_b2[i][j])){
          resultTable_b2[i][j] = resultTable_b2[i][j].replace('.',',');
        }
      }
    }

    console.log(resultTable_b1[3], resultTable_b2[3]);

    // search for date formates, convert and compare if equal or not. If equal replace one to avoid it is an error in the final check.
    const formatsb1 = [ 'DD.MM.YYYY HH:mm:ss',  'DD.MM.YYYY HH:mm:ss A', 'MM/DD/YYYY hh:mm:ss A', 'M/DD/YYYY hh:mm:ss A','M/D/YYYY hh:mm:ss A', 'MM/D/YYYY hh:mm:ss A', 'MM/DD/YYYY h:mm:ss A', 'DD.MM.YY','D.MM.YY','DD.M.YY','DD.MM.YYYY','DD/MM/YYYY', 'YYYY-MM-DD', 'DD.MM', 'hh:mm:ss'];
    const formatsb2 = [ 'YYYY-MM-DD', 'YYYY', 'HH:mm:ss', 'YYYY-MM-DD HH:mm:ss', 'DD.MM', 'hh:mm'];
    for(var a=0; a < resultTable_b1.length; a++) {
      for(var b=0; b < resultTable_b1[a].length; b++) {
        resultTable_b1[a][b] = resultTable_b1[a][b].trim();

        if (moment ( resultTable_b1[a][b], formatsb1, true).isValid()){
          const date1 = moment (resultTable_b1[a][b], formatsb1, true);
          const date2 = moment (resultTable_b2[a][b], formatsb2, true);

          datesB1[id + '_' + b] = resultTable_b1[a][b] + ', ' + resultTable_b2[a][b];

          // caluculate difference between the dates. If only time was stroed in BEXIS 1
          if (date2.diff(date1) == 0 || date2.diff(date1) == (moment ('00:00', 'HH:mm').diff(moment ('12/30/1899', 'MM/DD/YYYY')))){
            resultTable_b1[a][b] =  resultTable_b2[a][b];
            //console.log('Date match');
          }
        }

        else if (parseFloat(resultTable_b1[a][b])){
          resultTable_b1[a][b] = resultTable_b1[a][b].replace('.',',');
        }
      }
    }

    console.log(resultTable_b1[3], resultTable_b2[3]);

    assert.deepEqual (resultTable_b2[3], resultTable_b1[3], 'should have same reuslt');
  });

  it.only(`${id} - Compare count B1 & B2`, async () => {
    assert.equal( count_b2, count_b1, 'should have same result ');
  });

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
 * Return result table in BEXIS 1
 *
 * @param {import("puppeteer").Page} page
 */
async function returnTable_BEXIS1( page ) {
  const result = await page.evaluate(() => {
    const rows = document.querySelectorAll('#ctl00_ContentPlaceHolder_Main_BlockDataControl2_GridView1 tr');
    return Array.from(rows, row => {
      const columns = row.querySelectorAll('td:not(:first-child)');
      return Array.from(columns, column => column.innerText);
    });
  });

  return result;
}
