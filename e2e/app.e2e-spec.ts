import { DevoxxPage } from './app.po';

describe('devoxx App', () => {
  let page: DevoxxPage;

  beforeEach(() => {
    page = new DevoxxPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
