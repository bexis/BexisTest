import Browser    from '../../../util/Browser';
import { assert, util } from 'chai';
import login from '../../../util/common/login';
import elements from '../../../util/common/elements';
import moment from '../../../node_modules/moment';
import Config     from '../../../config';
import ds_ids from '../B2toB1compare_Datasets/dataset_ids';
import bexis1 from '../../../util/common/bexis1';


/** @type {number} */
var count_b1 = 0;
var count_b2 = 0;

var datesB1 = [];

var dataset_ids = ds_ids.dataset_Ids();
var dataset_subset = dataset_ids.slice(0, 50);

var unstructured_dataset_ids = ds_ids.unstructured_Ids();


describe.skip( 'Compare structured datasets', () => {

  for (let i = 0; i < dataset_subset.length; i++) {
    //compare_datasets(dataset_subset[i]);
  }
  //compare_datasets(25086);

  it('print result for collected dates', async () => {
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
    const count_b1 = await bexis1.countDS_BEXIS1( page2);

    // get result table first page
    const resultTable = await bexis1.returnTable_structured_BEXIS1 (page2);
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

describe.only('Compare unstructured ', () => {

  for (let i = 0; i < unstructured_dataset_ids.length; i++) {
    compare_unstructured_datasets(unstructured_dataset_ids[i]);
  }
  // compare_unstructured_datasets(18726);

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
    await bexis1.checkAndLoginUser_BEXIS1(page2);

    // navigate to show data page
    await assert.isFulfilled( page2.goto( Config.browser2.baseURL + '/Data/ShowData.aspx?DatasetId=' + id ), 'should open show data page' );

    // sort by obdId

    // await page2.evaluate(() => {
    //   document.querySelectorAll('#ctl00_ContentPlaceHolder_Main_BlockDataControl2_GridView1')[0].classList.add('show_table');
    // });
    // await assert.isFulfilled( elements.clickElementByLinkText(page2, 'obsId'), ' Should click on obsId to sort by obsId');
    // await assert.isFulfilled( page2.waitForSelector( '.show_table', { hidden: true }), 'should wait for result table' );

    // get total number of datasets
    count_b1 = await bexis1.countDS_BEXIS1( page2);

    // get result table first page
    const resultTable_b1 = await bexis1.returnTable_structured_BEXIS1( page2 );
    //console.log(resultTable_b1);

    // open tab
    const page = await Browser.openTab();

    // ensure user is logged in BEXIS 2
    await login.checkAndLoginUser( page );


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
 * Compare total count of unstructured datasets in BEXIS 1 and BEXIS 2
 *
 * @param { string | number} id
 */
async function compare_unstructured_datasets( id ){

  // check total count
  it(`${id} - compare data B1 & B2`, async () => {
    var countFilesb1 = null;
    var countFilesb2 = null;

    // open tab in BEXIS 1
    const page2 = await Browser.openTab(true);

    // ensure user is logged in BEXIS 1
    await bexis1.checkAndLoginUser_BEXIS1(page2);

    // navigate to show data page for unstructured data
    await assert.isFulfilled( page2.goto( Config.browser2.baseURL + '/Data/ShowUnstructuredData.aspx?DatasetId=' + id ), 'should open show data page for unstructured data' );

    // get result table for first page
    const resultTable_b1 = await bexis1.returnTable_unstructured_BEXIS1(page2);

    // check, if more then 10 files are shwon (indicated by the paging entries in the last line)
    if (resultTable_b1[resultTable_b1.length -1][0] == '1'){

      // calculate count for all fully filled pages (10 each)
      countFilesb1 = (resultTable_b1[resultTable_b1.length -1].length -1)*10;

      // add class to table to have something to check, if the table was replaced by new content
      await page2.evaluate(() => {
        document.querySelectorAll('#ctl00_ContentPlaceHolder_Main_GridView1')[0].classList.add('show_table');
      });

      // click in the last page
      await assert.isFulfilled( elements.clickElementByLinkText(page2, resultTable_b1[resultTable_b1.length -1].length.toString()), ' Should click on last page');

      // wait for the new result (ready, when the added class disappeared)
      await assert.isFulfilled( page2.waitForSelector( '.show_table', { hidden: true }), 'should wait for result table' );

      // get file list from last page
      const last_page = await bexis1.returnTable_unstructured_BEXIS1(page2);

      // calculate total count
      countFilesb1 = countFilesb1 + last_page.length-3;

    }
    else{
      // use count from dirst page
      countFilesb1 = resultTable_b1.length -1;
    }

    console.log(resultTable_b1);

    // check if files uploaded in BEXIS 1. Only check in BEXIS 2 if files are uploaded.
    if (resultTable_b1[0][0] != 'No files in dataset.'){

      // open tab
      const page = await Browser.openTab();

      // ensure user is logged in BEXIS 2
      await login.checkAndLoginUser( page );

      // navigate to dataset page
      await assert.isFulfilled( page.goto( Config.browser.baseURL + '/ddm/data/Showdata/' + id ), 'should dataset view' );

      // open primary data tab
      await assert.isFulfilled( page.click( '#primarydata' ), 'should select primary data' );

      // wait table is shown
      await assert.isFulfilled( page.waitForSelector( '.mmm-media' ), 'should select primary data' );

      // get shown files
      const resultTable_b2 = await elements.returnTableContent_MMM (page );
      console.log(resultTable_b2);

      // set totel count
      countFilesb2 = resultTable_b2.length;
    }
    // if not files uploaded in BEXIS 1, do not check in BEXIS 2 and seit both counts to 0.
    else {
      countFilesb1 = 0;
      countFilesb2 = 0;
    }

    // compare number of files in BEXIS 1 and BEXIS 2
    assert.equal (countFilesb2, countFilesb1, 'should have same reuslt');
  });
}
