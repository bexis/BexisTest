import Browser    from '../../../util/Browser';
import { assert } from 'chai';
import login from '../../../util/common/login';
import Config     from '../../../config';
import ds_ids from '../B2toB1compare_Datasets/dataset_ids';
import common from '../../../util/common';
import bexis1 from '../../../util/common/bexis1';
import elements from '../../../util/common/elements';


//var dataset_ids = ds_ids.dataset_Ids();
var unstructured_dataset_ids = ds_ids.unstructured_Ids();
var numberOfVersions = null;
var structured_dataset_ids = ds_ids.dataset_Ids();
var all_ids = [].concat(structured_dataset_ids,unstructured_dataset_ids);
/**
 * small things to check
*/
describe( 'Check after migration', () => {
  // select one random unstructured dataset
  //const randomIDpos = Math.floor(Math.random() * unstructured_dataset_ids.length);

  // check amount of created versions
  // checkVersions(unstructured_dataset_ids[randomIDpos]);
  //checkVersions ( 5000 );

  for (let index = 0; index < 1400; index++) {

    getMetadataB1andB2( all_ids[index] );
    //  getRelationshipsAndPermissions ( all_ids[index] );
    checkEntityLinks( all_ids[index] );
    // checkMetadata ( all_ids[index] ); // requires getMetadata
    // checkPermissions ( all_ids[index] ); // requires getMetadata and getRelationshipsAndPermissions
  }
  //  12161;
  //  25506;
  var test_id = 22346;
  // getMetadataB1andB2( test_id);
  //getRelationshipsAndPermissions ( 6320 );
  //checkEntityLinks (test_id);
  //checkMetadata ( test_id ); // requires getMetadata
  //checkPermissions ( 6320 ); // requires getMetadata and getRelationshipsAndPermissions

});


var paper = [];
var links_source = [];
var links_target= [];
var double_links = [];
var owner_b1 = [];
var owner_b2 = [];
var metadataCreator_b1 = [];
var metadataCreator_b2 = [];
var PI_b1 = [];
var PI_b2 = [];
var contactPerson_b1 = [];
var contactPerson_b2 = [];
var metadata_b1 = [];
var metadata_b2 = [];
var project_b1 = [];
var project_b2 = [];
var consortium_b1 = [];
var consortium_b2 = [];
var taxon_b1 = [];
var taxon_b2 = [];
var processOrService_b2 = [];
var processOrService_b1 = [];
var environmentalDescriptor_b2 = [];
var environmentalDescriptor_b1 = [];
var bioticDataType_b1 = [];
var bioticDataType_b2 = [];
var database_b1 = [];
var database_b2 = [];
var dataset_b1 = [];

var warning;
var permissons_per_dataset = [];

/**
 * Check amount of versions
 *
 * @param {string | number} id
 */
function checkVersions(id){

  it(id + 'check number of created versions for unstructured datasets', async () => {
    // open tab
    const page = await Browser.openTab();

    // ensure user is logged in BEXIS 2
    const elem = await page.$x('//a[text()="Login"]');
    if (await elem[0] != null){
      await login.loginUser(page);
    }

    // navigate to dataset page
    await assert.isFulfilled( page.goto( Config.browser.baseURL + '/ddm/data/Showdata/' + id ), 'should show dataset view' );

    // get options from selection list
    const result = await common.elements.returnSelectContent( page);

    // get number of versions to check later
    numberOfVersions = result.length;

    assert.equal( numberOfVersions, 3, 'should have only 3 version, but has ' + numberOfVersions);
  });
}




async function checkMetadata(id){
  it(id + ' - check metadata is valid', async () => {
    // check if element was found - if yes it is an error
    assert.equal(warning, null, 'Metadata is invalid should be not shown');
  });

  it(id + ' - check paper and links', async () => {
    assert.deepEqual( paper, [], 'should be empty, if all paper are linked');
  });

  it(id + ' - check linked datasets', async () => {
    // check if element was found - if yes it is an error

    if (dataset_b1 != []){
      for (let index = 0; index < dataset_b1.length; index++) {
        let result = all_ids.filter(function (e) {
          return e == dataset_b1[index];
        });
        if (result){
          dataset_b1[index] = dataset_b1[index] + '_maybe_archived';
        }
      }
    }

    assert.deepEqual(dataset_b1, [], 'shows not found linked datasets');
  });

  it(id + ' - owner in metadata', async () => {
    assert.deepEqual( owner_b1, owner_b2, 'should be empty, if all owner are transferred to metadata');
  });

  it(id + ' - PI in metadata', async () => {
    assert.deepEqual( PI_b1, PI_b2, 'should be equal, if the correct PI is set');
  });

  it(id + ' - Contact in metadata', async () => {
    assert.deepEqual( contactPerson_b1, contactPerson_b2, 'should be equal, if the correct contact person is set');
  });

  it(id + ' - Metadata creator in metadata', async () => {
    assert.deepEqual( metadataCreator_b1, metadataCreator_b2, 'should be equal, if the correct metadata creator is set');
  });

  it(id + ' - Project', async () => {
    assert.deepEqual( project_b1, project_b2, 'should be , if the correct project is set');
  });

  it(id + ' - Consortium', async () => {
    assert.deepEqual( consortium_b1, consortium_b2, 'should be , if the correct project is set');
  });


  it(id + ' - Taxon', async () => {
    assert.equal(taxon_b1.length, taxon_b2.length, 'should have same amount of entries');
  });

  it(id + ' - Process Or Service', async () => {
    assert.equal( processOrService_b1.length, processOrService_b2.length, 'should have same amount of entries');
  });

  it(id + ' - Environmental Descriptor', async () => {
    assert.equal( environmentalDescriptor_b1.length, environmentalDescriptor_b2.length, 'should have same amount of entries');
  });

  it(id + ' - bioticDataType', async () => {
    assert.equal( bioticDataType_b1.length, bioticDataType_b2.length, 'should have same amount of entries');
  });

  it(id + ' - Database', async () => {
    assert.deepEqual( database_b1, database_b2, 'should have same database entries');
  });


  it(id + ' - Check capitalized', async () => {
    var all_entries = [].concat(taxon_b2, processOrService_b2, environmentalDescriptor_b2, bioticDataType_b2);
    var capitalized_entries = all_entries.map( (el) => el[0].toUpperCase() + el.slice(1) );
    assert.deepEqual( capitalized_entries, all_entries, 'should be equal, if all entries capitalized');
  });



}

async function checkEntityLinks(id){

  it(id + ' - check paper and links', async () => {
    assert.deepEqual( paper, [], 'should be empty, if all paper are linked');
  });

  it(id + ' - check linked datasets', async () => {
    if (dataset_b1 != []){
      for (let index = 0; index < dataset_b1.length; index++) {
        let result = all_ids.filter(function (e) {
          return e == dataset_b1[index];
        });
        if (result){
          dataset_b1[index] = dataset_b1[index] + '_maybe_archived';
        }
      }
    }

    double_links = [];
    var links = [];
    for (let index = 0; index < links_target.length; index++) {
      if (links_target[index][5] == 'Dataset' || links_target[index][5] == 'Publication' ){
        links.push([links_target[index][3], 'target', links_target[index][5]]);
      }
    }
    for (let index = 0; index < links_source.length; index++) {
      if (links_source[index][4] == 'Dataset' || links_source[index][4] == 'Publication' ){
        if (!links.find( (el) => el[0] == links_source[index][2])) {
          links.push([links_source[index][2], 'source', links_source[index][4]]);
        }
      }
    }

    // remove all found double references and collect
    for (let index = 0; index < links_target.length; index++) {
      for (let i = 0; i < links_source.length; i++) {
        if (links_source[i].includes(links_target[index][3])){
          for (let a = 0; a < links.length; a++) {
            if (links[a].includes(links_target[index][3]))
            {
              links.splice(a, 1);
            }
          }
          double_links.push(links_target[index][3]);
        }
      }
    }
    assert.deepEqual([dataset_b1, double_links, links], [], 'Archived & double links & diff' );

  });
}

async function checkPermissions( id ){

  it(id + ' - check permission', async () => {
    var permission_ok = {};
    var permission_b1 = {};

    permission_b1['owner'] = owner_b1;
    permission_ok['owner'] = [];
    for (let index = 0; index < owner_b1.length; index++) {
      if ( permissons_per_dataset[id][owner_b1[index]] ){
        for (let i = 0; i < permissons_per_dataset[id][owner_b1[index]].length; i++) {
          if ( permissons_per_dataset[id][owner_b1[index]][i].type == 'dataCreator' && permissons_per_dataset[id][owner_b1[index]][i].write == true){
            permission_ok['owner'].push(owner_b1[index]);
          }
        }
      }
    }

    permission_b1['PI'] = PI_b1[0];

    if ( permissons_per_dataset[id][PI_b1[0]] ){
      for (let i = 0; i < permissons_per_dataset[id][PI_b1[0]].length; i++) {
        if ( permissons_per_dataset[id][PI_b1[0]][i].type == 'PI' && permissons_per_dataset[id][PI_b1[0]][i].write == true){
          permission_ok['PI'] = PI_b1[0];
        }
      }
    }

    permission_b1['metadataCreator'] = metadataCreator_b1[0];

    if ( permissons_per_dataset[id][metadataCreator_b1[0]] ){
      for (let i = 0; i < permissons_per_dataset[id][metadataCreator_b1[0]].length; i++) {
        if ( permissons_per_dataset[id][metadataCreator_b1[0]][i].type == 'metadataCreator' && permissons_per_dataset[id][metadataCreator_b1[0]][i].write == true){
          permission_ok['metadataCreator'] = metadataCreator_b1[0];
        }
      }
    }

    permission_b1['contactPerson'] = contactPerson_b1[0];
    permission_ok['contactPerson'] = '';
    if ( permissons_per_dataset[id][contactPerson_b1[0]] ){
      for (let i = 0; i < permissons_per_dataset[id][contactPerson_b1[0]].length; i++) {
        if ( permissons_per_dataset[id][contactPerson_b1[0]][i].type == 'contactPerson' && permissons_per_dataset[id][contactPerson_b1[0]][i].read == true){
          permission_ok['contactPerson'] = contactPerson_b1[0];
        }
      }
    }

    assert.deepEqual(permission_ok, permission_b1,  'should be the same');
  });

}


async function getMetadataB1andB2(id){
  it(id + ' - get metadata from B1 and B2', async () => {
    paper = [];
    links_target = [];
    links_source = [];
    owner_b1 = [];
    owner_b2 = [];
    metadataCreator_b1 = [];
    metadataCreator_b2 = [];
    PI_b1 = [];
    PI_b2 = [];
    contactPerson_b1 = [];
    contactPerson_b2 = [];
    metadata_b1 = [];
    metadata_b2 = [];
    project_b1 = [];
    project_b2 = [];
    taxon_b1 = [];
    taxon_b2 = [];
    consortium_b1 =[];
    consortium_b2 = [];
    processOrService_b1 = [];
    processOrService_b2 = [];
    environmentalDescriptor_b1 = [];
    environmentalDescriptor_b2 = [];
    bioticDataType_b1 = [];
    bioticDataType_b2 = [];
    database_b1 = [];
    database_b2 = [];
    dataset_b1 = [];

    warning;
    permissons_per_dataset = [];


    // open tab in BEXIS 1
    const page2 = await Browser.openTab(true);

    // ensure user is logged in BEXIS 1
    await bexis1.checkAndLoginUser_BEXIS1 ( page2 );

    // navigate to show data page for unstructured data
    await assert.isFulfilled( page2.goto( Config.browser2.baseURL + '/Data/ShowXml.aspx?DatasetId=' + id ), 'should open show data page for metadata' );

    metadata_b1 = await bexis1.returnTable_metadata_BEXIS1 ( page2 );

    //var half_length = Math.ceil(result.length / 2);
    //metadata_b1 = result.splice(0,half_length);

    metadata_b1.forEach(element => {
      if (element[0] && element[0].includes('paper') && element[1].length > 2){
        paper.push(element[1]);
      }
      if (element[0] && element[0].includes('owner') && element[1].length > 2){
        owner_b1.push(element[1]);
      }
      if (element[0] && element[0].includes('originalDatasetManager') && element[1].length > 2){
        PI_b1.push(element[1]);
      }
      if (element[0] && element[0].includes('designatedDatasetManagerName') && element[1].length > 2){
        contactPerson_b1.push(element[1]);
      }
      if (element[0] && element[0].includes('metadataCreator') && element[1].length > 2){
        metadataCreator_b1.push(element[1]);
      }
      if (element[0] && element[0].includes('projectName') && element[1].length > 2){
        project_b1.push(element[1]);
      }
      if (element[0] && element[0].includes('consortia') && element[1].length > 2){
        consortium_b1.push(element[1]);
      }
      if (element[0] && element[0].includes('taxon') && element[1].length > 2){
        taxon_b1.push(element[1]);
      }
      if (element[0] && element[0].includes('processOrService') && element[1].length > 2){
        processOrService_b1.push(element[1]);
      }
      if (element[0] && element[0].includes('environmentalDescriptor') && element[1].length > 2){
        environmentalDescriptor_b1.push(element[1]);
      }
      if (element[0] && element[0].includes('bioticDataType') && element[1].length > 2){
        bioticDataType_b1.push(element[1]);
      }
      if (element[0] && element[0].includes('database') && element[1].length > 2){
        database_b1.push(element[1]);
        // console.log(database_b1);
      }
      if (element[0] && element[0].includes('dataset') && element[1].length > 2){
        if (!isNaN(element[0].slice(-1))){
          dataset_b1.push(element[1]);
        }

      }
    });


    // open tab in BEXIS 2
    const page = await Browser.openTab();

    // ensure user is logged in BEXIS 1
    await login.checkAndLoginUser ( page );

    // navigate to dataset page
    await assert.isFulfilled( page.goto( Config.browser.baseURL + '/ddm/data/Showdata/' + id ), 'should show dataset view' );

    // wait for the new result (ready, when the added class disappeared)
    await assert.isFulfilled( page.waitForSelector( '#MetadataEditor', { visible: true }), 'should wait for metadata' );

    // check warning is shown
    warning = await page.$('#view-warning');

    metadata_b2 = await elements.returnMetadataValueContent ( page );

    var literature_refs_b2 = [];
    metadata_b2.forEach(element => {
      if (element[0] && element[0].startsWith('Data creator') && element[1].length > 2){
        owner_b2.push(element[1]);
      }
      if (element[0] && element[0].startsWith('Project leader') && element[1].length > 2){
        PI_b2.push(element[1]);
      }
      if (element[0] && element[0] == 'Name' && element[1].length > 2){
        contactPerson_b2.push(element[1]);
      }
      if (element[0] && element[0].startsWith('Metadata creator') && element[1].length > 2){
        metadataCreator_b2.push(element[1]);
      }
      if (element[0] && element[0].startsWith('Project name') && element[1].length > 2){
        project_b2.push(element[1]);
      }
      if (element[0] && element[0].startsWith('Consortium') && element[1].length > 2){
        consortium_b2.push(element[1]);
      }
      if (element[0] && element[0].startsWith('Taxon') && element[1].length > 2){
        taxon_b2.push(element[1]);
      }
      if (element[0] && element[0].startsWith('Processe and service') && element[1].length > 2){
        processOrService_b2.push(element[1]);
      }
      if (element[0] && element[0].startsWith('Environmental descriptor') && element[1].length > 2){
        environmentalDescriptor_b2.push(element[1]);
      }
      if (element[0] && element[0].startsWith('Biotic data type') && element[1].length > 2){
        bioticDataType_b2.push(element[1]);
      }
      if (element[0] && element[0].startsWith('Name of') && element[1].length > 2){
        database_b2.push(element[1]);
        console.log(database_b2);
      }

      if (element[0] && element[0].startsWith('Literature references') && element[1].length > 2){
        literature_refs_b2 = element[1].split('\n');
        console.log(element);
      }
    });


    // console.log(literature_refs_b2);
    // console.log(paper);
    // remove all found literature references from the method section
    for (let index = 0; index < literature_refs_b2.length; index++) {
      for (let i = 0; i < paper.length; i++) {
        if (paper[i].includes(literature_refs_b2[index].replace(/(\r\n|\n|\r)/gm,''))){
          paper.splice(i, 1); // remove found paper

        }
      }
    }

    // open link tab
    await assert.isFulfilled( page.click( '#showreferences' ), 'should select links' );

    // wait for the new result (ready, when the added class disappeared)
    await assert.isFulfilled( page.waitForSelector( '#target_reference_table_wrapper', { visible: true }), 'should wait for table' );

    links_source = await elements.returnTableContent_Telerik (page, 'source_reference_table');
    links_target = await elements.returnTableContent_Telerik (page, 'target_reference_table');
    // console.log(links);
    var paper_lower = paper.map(v => v.toLowerCase());
    // remove all found literature references from links
    for (let index = 0; index < links_target.length; index++) {
      const element = links_target[index];
      if (element[5] == 'Publication'){
        for (let i = 0; i < paper_lower.length; i++) {
          if (paper_lower[i].includes(links_target[index][3].toLowerCase())){
            paper_lower.splice(i, 1); // remove found paper
          }
        }
      }
    }

    paper = paper_lower;
    // remove all found dataset from links
    for (let index = 0; index < links_target.length; index++) {
      const element = links_target[index];
      if (element[5] == 'Dataset'){
        for (let i = 0; i < dataset_b1.length; i++) {
          if (dataset_b1[i].includes(links_target[index][1])){ // look for id
            dataset_b1.splice(i, 1); // remove found dataset
          }
        }
      }
    }


  });

  assert.notDeepEqual (metadata_b2, [], 'check at least one var is filled');
}

/**
 * Get relationshsips and permission for a dataset
 *
 * @param {string | number} id
 */
function getRelationshipsAndPermissions( id ){

  it(id + ' - get permissions and owner', async function() {
    permissons_per_dataset[id] = [];
    var all_persons = [].concat(owner_b1, metadataCreator_b1, PI_b1, contactPerson_b1);

    this.timeout(100000 * all_persons.length);
    // open tab
    const page = await Browser.openTab();

    // ensure user is logged in BEXIS 2
    await login.checkAndLoginUser( page );

    // navigate to dataset page
    await assert.isFulfilled( page.goto( Config.browser.baseURL + '/sam/entitypermissions/index' ), 'should show entity permission page' );

    // wait for entity permission page
    await assert.isFulfilled( page.waitForSelector( '.main-content', { visible: true }), 'should wait for content' );

    // open dataset
    await assert.isFulfilled( elements.clickElementBySpanText( page, 'Dataset') , 'should show entity permission page' );

    // wait table is displayed
    await assert.isFulfilled( page.waitForSelector( 'input[name="selectedInstances"]', { visible: true }), 'wait for telerik table' );

    // filter table
    //await assert.isFulfilled( elements.filterTable_Telerik2( page, id.toString(), '2', 'content_instances', '#grid_instancesIdfirst'), 'should filter table');


    // wait table is displayed
    //  await assert.isFulfilled( page.waitForSelector( '#content_subjects', { visible: true }), 'wait for telerik table' );

    //  await assert.isFulfilled( page.waitForFunction('document.querySelector("#content_instances > div > table > tbody > tr").children.length == 3'), 'wait for telerik table' );

    //page.waitFor(2000);
    // await assert.isFulfilled( elements.findTableRowByTableCellText( page , id.toString()), 'sfd');
    const element = await page.$x('//tr/td[text()="'+id+'"]');
    await element[0].asElement().click();

    // await assert.isFulfilled( page.click( '#content_instances > div > table > tbody > tr:nth-child(1) > td:nth-child(3)' ), 'click on first row' );

    // await assert.isFulfilled( page.waitForFunction('document.querySelector("#grid_subjects > table > tbody > tr").children.length > 3'), 'wait for telerik table' );
    await assert.isFulfilled( page.waitForSelector( '#grid_subjects', { visible: true }), 'wait for telerik table' );




    var all_persons_unique = all_persons.filter(function(item, pos, self) {
      return self.indexOf(item) == pos;
    });
    //console.log(all_persons_unique);
    await assert.isFulfilled( page.waitForSelector(  'td[title="Group"]', { visible: true }), 'wait for tablecontent' );

    for (let index = 0; index < all_persons_unique.length; index++) {
      // console.log(all_persons_unique[index]);

      // await assert.isFulfilled( elements.filterTable_Telerik2( page, all_persons_unique[index], '2', 'content_subjects', '#content_subjects .t-animation-container > div > input'), 'should filter table');


      const element = await page.$x('//tr/td[text()="'+all_persons_unique[index]+'"]');
      if (element[0] != null){
        await element[0].asElement().click();

        // await assert.isFulfilled( page.waitForSelector(  'td[title="'+ all_persons_unique[index] + '"]', { visible: true }), 'wait for telerik table' );

        //  await page.click( '#content_subjects > div > table > tbody > tr:nth-child(1)' );

        // wait table is displayed
        await assert.isFulfilled( page.waitForSelector( '#content_permissions', { visible: true }), 'wait for telerik table' );
        await assert.isFulfilled( page.waitForSelector(  '#content_permissions td[title="Group"]', { visible: true }), 'wait for table content' );

        page.waitFor(2000);
        permissons_per_dataset[id][all_persons_unique[index]] = await elements.returnTableContentPermission_Telerik (page, 'content_permissions');

        //user_permissions = await elements.returnTableContent_Telerik (page, 'content_subjects');
        elements.clickElementBySpanText (page, 'Close');
        await assert.isFulfilled( page.waitForSelector( '#grid_subjects', { visible: true }), 'wait for telerik table' );
      }
    }
  });
}