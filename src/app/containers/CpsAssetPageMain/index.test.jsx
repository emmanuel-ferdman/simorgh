import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { matchSnapshotAsync } from '@bbc/psammead-test-helpers';
import dissocPath from 'ramda/src/dissocPath';
import { ServiceContextProvider } from '#contexts/ServiceContext';
import { RequestContextProvider } from '#contexts/RequestContext';
import { ToggleContext } from '#contexts/ToggleContext';
import CpsAssetPageMain from '.';
import preprocessor from '#lib/utilities/preprocessor';
import igboPageData from '#data/igbo/cpsAssets/afirika-23252735';
import pidginPageData from '#data/pidgin/cpsAssets/tori-49450859';
import { cpsAssetPreprocessorRules } from '#app/routes/getInitialData/utils/preprocessorRulesConfig';

const toggleState = {
  local: {
    mediaPlayer: {
      enabled: true,
    },
  },
  test: {
    mediaPlayer: {
      enabled: true,
    },
  },
  live: {
    mediaPlayer: {
      enabled: false,
    },
  },
};

// eslint-disable-next-line react/prop-types
const createMediaAssetPage = ({ pageData }) => (
  <StaticRouter>
    <ToggleContext.Provider value={{ toggleState, toggleDispatch: jest.fn() }}>
      <ServiceContextProvider service="igbo">
        <RequestContextProvider
          bbcOrigin="https://www.test.bbc.co.uk"
          isAmp={false}
          pageType="MAP"
          pathname="/pidgin/tori-49450859"
          service="pidgin"
          statusCode={200}
        >
          <CpsAssetPageMain service="pidgin" pageData={pageData} />
        </RequestContextProvider>
      </ServiceContextProvider>
    </ToggleContext.Provider>
  </StaticRouter>
);

describe('CpsAssetPageMain', () => {
  it('should match snapshot for STY', async () => {
    const pageData = await preprocessor(
      igboPageData,
      cpsAssetPreprocessorRules,
    );

    await matchSnapshotAsync(
      /*
        for the value it would bring, it is much simpler to wrap a react-router Link in a Router, rather than mock a Router or pass some mocked context.
      */
      <StaticRouter>
        <ToggleContext.Provider
          value={{ toggleState, toggleDispatch: jest.fn() }}
        >
          <ServiceContextProvider service="igbo">
            <RequestContextProvider
              bbcOrigin="https://www.test.bbc.co.uk"
              isAmp={false}
              pageType="STY"
              pathname="/igbo/afirika-23252735"
              service="igbo"
              statusCode={200}
            >
              <CpsAssetPageMain service="igbo" pageData={pageData} />
            </RequestContextProvider>
          </ServiceContextProvider>
        </ToggleContext.Provider>
      </StaticRouter>,
    );
  });

  it('should match snapshot for MAP', async () => {
    const pageData = await preprocessor(
      pidginPageData,
      cpsAssetPreprocessorRules,
    );

    await matchSnapshotAsync(createMediaAssetPage({ pageData }));
  });

  it('should match snapshot for MAP - hidden timestamp', async () => {
    const pageData = await preprocessor(
      pidginPageData,
      cpsAssetPreprocessorRules,
    );

    const pageDataWithHiddenTimestamp = dissocPath(
      ['metadata', 'options', 'allowDateStamp'],
      pageData,
    );

    await matchSnapshotAsync(
      createMediaAssetPage({
        pageData: pageDataWithHiddenTimestamp,
      }),
    );
  });
});
