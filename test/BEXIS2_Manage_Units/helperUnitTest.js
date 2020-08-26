import login from '../../util/common/login';
import Browser from '../../util/Browser';

before(() => {
  it('should login', async () => {
    // open a new tab
    const page = await Browser.openTab();

    // ensure a normal user is logged in
    await login.loginUser(page);
    await Browser.closeTabs();
  });
});