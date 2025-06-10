import { state, mutations } from '../../../store/index';
import { Version, IframeData } from '../../../api/models/interface.model';

describe('Test Iframe Data Store', function () {
  const konviwCreatedVersion: Version = {
    versionNumber: 1,
    when: '',
    friendlyWhen: '',
    modificationBy: {
      displayName: '',
      email: '',
      profilePicture: '',
    },
  };
  const konviwLastVersion: Version = Object.create(konviwCreatedVersion);

  const iframeData: IframeData = {
    konviwFrameUrl: 'Url',
    konviwSpaceKey: 'SpaceKey',
    konviwPageId: 'PageId',
    konviwTitle: 'Title',
    konviwExcerpt: '',
    konviwCreatedVersion,
    konviwLastVersion,
    labels: [],
    readTime: 0,
  };

  const st = state();

  it('should return a init state', () => {
    mutations.drawer(st, true);
    mutations.feedback(st, false);
    mutations.search(st, false);
    mutations.iframeData(st, iframeData);
    expect(st.drawer).toBeTruthy();
    expect(st.feedback).toBeFalsy();
    expect(st.search).toBeFalsy();
    expect(st.iframeData.konviwFrameUrl).toEqual(iframeData.konviwFrameUrl);
    expect(st.iframeData.konviwSpaceKey).toEqual(iframeData.konviwSpaceKey);
    expect(st.iframeData.konviwPageId).toEqual(iframeData.konviwPageId);
    expect(st.iframeData.konviwTitle).toEqual(iframeData.konviwTitle);
  });

  it('should return 1 as version number value', () => {
    expect(st.iframeData.konviwCreatedVersion.versionNumber).toEqual(
      iframeData.konviwCreatedVersion.versionNumber,
    );
  });

  it('should return a last modification', () => {
    expect(st.iframeData.konviwLastVersion.when).toEqual(
      iframeData.konviwLastVersion.when,
    );
  });

  it('should enable a feedback', () => {
    mutations.feedback(st, true);
    expect(st.feedback).toBeTruthy();
  });

  it('should enable a search', () => {
    mutations.search(st, true);
    expect(st.search).toBeTruthy();
  });

  it('should set space keys', () => {
    mutations.spaceKeys(st, ['iadc', 'eoee']);
    expect(st.spaceKeys).toEqual(['iadc', 'eoee']);
  });

  it('should set space titles', () => {
    mutations.spaceTitles(st, ['IADC Program', 'GoGemba']);
    expect(st.spaceTitles).toEqual(['IADC Program', 'GoGemba']);
  });
});
