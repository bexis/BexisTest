/**
 * handle the main menu interactions
 */

export default {
  select: selectMenu,
};


/**
 * select an entry from the main menu
 *
 * @param   {Object}    page      page to work upon
 * @param   {String}    entry     label of the menu entry to select; upper/lower case is respected!
 */
async function selectMenu( page, entry ) {

  // try to find the respective menu entry
  const $targetHandle = await page.evaluateHandle( (label) => {
    const entries = document.querySelectorAll( '#navbarCollapse a' );
    for( const entry of Array.from( entries ) ) {
      if( entry.textContent.trim() == label ) {
        return entry;
      }
    }
  }, entry );
  if( !$targetHandle.asElement() ) {
    throw new Error( `Could not find menu entry for label "${entry}"` );
  }

  // get all menu entries need to be clicked
  // need to include parents, so all entries are actually visible
  // https://github.com/puppeteer/puppeteer/issues/4852#issuecomment-524965833
  const $elementArr = await $targetHandle.evaluateHandle( ( node ) => {
    const entries = [];
    while( !node.classList.contains( 'nav' ) && (node.tagName != 'BODY') ) {
      node = node.parentNode;
      if( node.tagName == 'LI' ) {
        entries.push( node.querySelector( 'a' ) );
      }
    }
    return entries.reverse();
  });
  const $elements = [];
  for( const $handle of (await $elementArr.getProperties()).values() ) {
    const $el = $handle.asElement();
    if( $el ) {
      $elements.push( $el );
    }
  }

  // click all elements one after another
  for( const $el of $elements ) {
    await $el.click();
  }

  // wait for the page to finish loading
  await page.waitForNavigation();

}
