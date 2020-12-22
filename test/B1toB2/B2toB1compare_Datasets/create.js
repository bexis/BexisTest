import Browser    from '../../../util/Browser';
import { assert, util } from 'chai';
import login from '../../../util/common/login';
import elements from '../../../util/common/elements';
import moment from '../../../node_modules/moment';
import Config     from '../../../config';
import ds_ids from '../B2toB1compare_Datasets/dataset_ids';
import bexis1 from '../../../util/common/bexis1';


var math = require('mathjs'),
precision  = require( './precision' );

/** @type {number} */
var count_b1 = 0;
var count_b2 = 0;

var datesB1 = [];

var dataset_ids = ds_ids.dataset_Ids();
var dataset_subset = dataset_ids.slice(0,1300);

var collectReplacements = [];

var unstructured_dataset_ids = ds_ids.unstructured_Ids();
var mat_view = [19147	,
                19168	,
                19434	,
                20030	,
                20346	,
                21047	,
                21048	,
                21386	,
                21449	,
                21566	,
                21766	,
                22006	,
                22471	,
                22547	,
                22627	,
                22628	,
                22906	,
                22968	,
                22969	,
                23288	,
                23289	,
                23686	,
                23746	,
                23946	,
                24247	,
                24406	,
                24407	,
                24426	,
                24466	,
                24607	,
                24691	,
                24692	,
                24728	,
                24786	,
                24866	,
                24868	,
                24946	,
                25066	,
                25067	,
                25086	,
                25607	,
                25626	,
                25886	,
                26446	,
                26466	,
                26487	,
                4661	,
                5680	,
                5682	,
                6060	,
                6280	,
                10042	,
                10160	,
                11500	,
                12806	,
                13149	,
                15246	,
                17766	,
                27007	,
                27026	,
                27066
];
var exclude_datasets = [
  15246	,
  17766	,
  19147	,
  19168	,
  21047	,
  21048	,
  21386	,
  21566	,
  21766	,
  22471	,
  22547	,
  22627	,
  22628	,
  22906	,
  22968	,
  22969	,
  23288	,
  23289	,
  23686	,
  23946	,
  24406	,
  24407	,
  24426	,
  24466	,
  24607	,
  24691	,
  24692	,
  24786	,
  24866	,
  24868	,
  24946	,
  25607	,
  25626
];

var rerun2 = [ 26466,
  27106	,
  25768	,
  12806	,
  13149	,
  15426	,
  21047	,
  25086	,
  21449	,
  6060	,
  11500	,
  27206	,
  27246	,
  27266	,
  27288	,
  27289	,
  27290	,
  27291	,
  3923	,
  4140	,
  4181	,
  4220	,
  2349	,
  2623	,
  2663	,
  3020	,
  3923	,
  4360	,
  12766	,
  2623	,
  2663	,
  12827	,
  3541	,
  5620	,
  5684	,
  6581	,
  12427	,
  16388	,
  2905	,
  13147	,
  5522	,
  6482	,
  22506	
];

var dataset_errors_test = [
  19906,
  17732,
]
var dataset_errors = [
  2480	,
2741	,
2760	,
4000	,
4002	,
4221	,
4222	,
4623	,
4823	,
5540	,
5541	,
5861	,
6040	,
6440	,
10600	,
10602	,
11502	,
11504	,
12526	,
14426	,
15126	,
15246	,
15566	,
15887	,
16187	,
16429	,
17587	,
17646	,
17647	,
17689	,
17727	,
17728	,
17732	,
17767	,
18067	,
18071	,
18072	,
19086	,
19226	,
19906	,
20686	,
20826	,
23166	,
24209	,
24506	,
24867	,
24966	,
26007	,
26566	,
26567	,
26766	,
]

describe( 'Compare structured datasets', () => {

  for (let i = 0; i < dataset_ids.length; i++) {
    compare_datasets(dataset_ids[i]);
  }
 // compare_datasets(4444);

  it('print result for collected dates', async () => {
    console.log(datesB1);
  });

  it('print result for collected dates', async () => {
    console.log(collectReplacements);
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

describe.skip('Compare unstructured ', () => {

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



    // get total number of datasets
    count_b1 = await bexis1.countDS_BEXIS1( page2);

    // get result table first page
    var resultTable_b1 = await bexis1.returnTable_structured_BEXIS1( page2 );
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
    var resultTable_b2 = await elements.returnTableContent_Telerik (page, 'PrimaryDataResultGrid');

    const formatsb1 = [ 'DD.MM.YYYY HH:mm:ss',  'DD.MM.YYYY HH:mm:ss A', 'MM/DD/YYYY hh:mm:ss A', 'M/DD/YYYY hh:mm:ss A','M/D/YYYY hh:mm:ss A', 'MM/D/YYYY hh:mm:ss A', 'MM/DD/YYYY h:mm:ss A', 'DD.MM.YY','D.MM.YY','DD.M.YY','DD.MM.YYYY','DD/MM/YYYY', 'YYYY-MM-DD', 'DD.MM', 'hh:mm:ss'];
    const formatsb2 = [ 'YYYY-MM-DD', 'YYYY', 'HH:mm:ss', 'YYYY-MM-DD HH:mm:ss', 'DD.MM', 'hh:mm'];



    if (resultTable_b1[3][0] != resultTable_b2[3][0] || resultTable_b1[3][1] != resultTable_b2[3][1] && !moment ( resultTable_b1[3][1], formatsb1, true).isValid()){

      // sort by first column
      await elements.sortTable ( page, '1');

      // result table from first page
      resultTable_b2 = await elements.returnTableContent_Telerik (page, 'PrimaryDataResultGrid');

      // check if it fits now
      if (resultTable_b1[3][0] != resultTable_b2[3][0]  || resultTable_b1[3][1] != resultTable_b2[3][1]){

        // sort by obdId
        await page2.evaluate(() => {
          document.querySelectorAll('#ctl00_ContentPlaceHolder_Main_BlockDataControl2_GridView1')[0].classList.add('show_table');
        });
        await assert.isFulfilled( elements.clickElementByLinkText(page2, 'obsId'), ' Should click on obsId to sort by obsId');
        await assert.isFulfilled( page2.waitForSelector( '.show_table', { hidden: true }), 'should wait for result table' );

        resultTable_b1 = await bexis1.returnTable_structured_BEXIS1( page2 );

        // check if it fits now
        if (resultTable_b1[3][0] != resultTable_b2[3][0]  || resultTable_b1[3][1] != resultTable_b2[3][1]){
          await elements.sortTable ( page, '1');
          resultTable_b2 = await elements.returnTableContent_Telerik (page, 'PrimaryDataResultGrid');

          // check if it fits now
          if (resultTable_b1[3][0] != resultTable_b2[3][0]  || resultTable_b1[3][1] != resultTable_b2[3][1]){
            await elements.sortTable ( page, '1');
            resultTable_b2 = await elements.returnTableContent_Telerik (page, 'PrimaryDataResultGrid');
          }
        }
      }
    }

    // replace . by , for all number values
    for(var i=0; i < resultTable_b2.length; i++) {
      for(var j=0; j < resultTable_b2[i].length; j++) {
        resultTable_b2[i][j] = resultTable_b2[i][j].trim();
        if (parseFloat(resultTable_b2[i][j])){
          resultTable_b2[i][j] = resultTable_b2[i][j].replace('.',',');
        }
      }
    }

    //   console.log(resultTable_b1[3], resultTable_b2[3]);

    // search for date formates, convert and compare if equal or not. If equal replace one to avoid it is an error in the final check.
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
          else {
            resultTable_b1[a][b] = resultTable_b1[a][b].replace('.',',');
          }
        }

        else if (parseFloat(resultTable_b1[a][b].replace(',','.'))){
 

          if ( checkEqualValues(resultTable_b1[a][b], resultTable_b2[a][b]) == true){
            resultTable_b1[a][b] = resultTable_b2[a][b]
            collectReplacements[id + "_" + resultTable_b1[a][b] + "_" + resultTable_b2[a][b]]
          }
          resultTable_b1[a][b] = resultTable_b1[a][b].replace('.',',');
        }



      }
    }

    // console.log(resultTable_b1[3], resultTable_b2[3]);

  //  assert.deepEqual (resultTable_b2[3], resultTable_b1[3], 'should have same reuslt');
    if (count_b2 == count_b1){
      assert.deepEqual ([resultTable_b2[5],resultTable_b2[15], resultTable_b2[20]], [resultTable_b1[5],resultTable_b1[15],resultTable_b1[20]], 'should have same reuslt');
    }
    else{
      assert.equal( 1, 1, 'excluded');
    }
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
/**
 * Check if rounded value equals original value
 * 
 * Source: https://github.com/fusion-jena/unit-ontology-review/blob/master/analysis/util/roundEqual.js
 * 
 * @param {*} x 
 * @param {*} y 
 * @param {*} precisionMin 
 * @param {*} digitsMin 
 */
function checkEqualValues( x, y, precisionMin, digitsMin){

    // use bignumbers from mathjs
    try{ // added FZ
    x = math.bignumber(x.replace(',','.'));
    y = math.bignumber(y.replace(',','.'));
    }
    catch{  // added FZ
      return false;
    }
    
    //set precisionMin
    precisionMin = math.bignumber(precisionMin || 2);
    digitsMin = math.bignumber(digitsMin || 6);
    // calculate precision of the leading digits
    var leadingDigitPrecisionX = math.chain(x).abs().log10().round().multiply(-1).done();
    var leadingDigitPrecisionY = math.chain(y).abs().log10().round().multiply(-1).done();
    // get max precision of leading digits (= leading digit precision of the smaller number)
    var leadingDigitPrecisionMax = math.max(leadingDigitPrecisionX,leadingDigitPrecisionY);
    // calculate min precision using min number of digits
    var digitsMinPrecision = math.chain(leadingDigitPrecisionMax).add(digitsMin).done();
    // use the lower min precisions (= "smaller obstacle" / only one criteria has to be met)
    precisionMin = math.min(precisionMin,digitsMinPrecision);
    
    // get precision
    var precisionX = math.max(precision(x),precisionMin);
    var precisionY = math.max(precision(y),precisionMin);
    var precisionMax = math.max(precisionX,precisionY);
      
    // calculate bounds
    /* 
     * bound: the smallest number greater and the greatest number
     * smaller as all possible original values without assuming a 
     * specific rounding method
     */
    var bigTen = math.bignumber(10);
    var lowerBoundX = math.subtract(x, math.pow(bigTen, -precisionX));
    var upperBoundX = math.add(x, math.pow(bigTen, -precisionX));
    var lowerBoundY = math.subtract(y, math.pow(bigTen, -precisionY));
    var upperBoundY = math.add(y, math.pow(bigTen, -precisionY));
    
    // check if ranges of original values are not distinct
    return ( math.equal(x, y)
          || lowerBoundX <= lowerBoundY && lowerBoundY <  upperBoundX // lower bound of y in range of x
          || lowerBoundX <  upperBoundY && upperBoundY <= upperBoundX // upper bound of y in range of x
          || lowerBoundY <= lowerBoundX && lowerBoundX <  upperBoundY // lower bound of x in range of y
          || lowerBoundY <  upperBoundX && upperBoundX <= upperBoundY // upper bound of x in range of y
          ); 
  
}
