import { buildUserPhotoUrl } from './buildUserPhotoUrl';

describe('buildUserPhotoUrl', () => {
  it('builds a userphoto.aspx url for the given email', () => {
    expect(buildUserPhotoUrl('jeerasakso@fusionsoft.co.th')).toEqual(
      'https://fusionsoftcompany.sharepoint.com/_layouts/15/userphoto.aspx?size=M&accountname=jeerasakso%40fusionsoft.co.th'
    );
  });

  it('supports a custom size', () => {
    expect(buildUserPhotoUrl('jeerasakso@fusionsoft.co.th', 'L')).toEqual(
      'https://fusionsoftcompany.sharepoint.com/_layouts/15/userphoto.aspx?size=L&accountname=jeerasakso%40fusionsoft.co.th'
    );
  });

  it('returns an empty string when there is no email', () => {
    expect(buildUserPhotoUrl(undefined)).toEqual('');
  });
});
