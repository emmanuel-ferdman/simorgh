import React from 'react';
import { render, waitFor } from '@testing-library/react';
import mergeDeepLeft from 'ramda/src/mergeDeepLeft';
import ArticlePage from './ArticlePage';
import { RequestContextProvider } from '#contexts/RequestContext';
import { ToggleContextProvider } from '#contexts/ToggleContext';
import { ServiceContextProvider } from '#contexts/ServiceContext';
import {
  articleDataNews,
  articleDataPersian,
  articleDataPidgin,
} from '#pages/ArticlePage/fixtureData';
import newsMostReadData from '#data/news/mostRead';
import persianMostReadData from '#data/persian/mostRead';
import pidginMostReadData from '#data/pidgin/mostRead';
import {
  textBlock,
  blockContainingText,
  singleTextBlock,
} from '#models/blocks/index';
import { ARTICLE_PAGE } from '#app/routes/utils/pageTypes';

// temporary: will be removed with https://github.com/bbc/simorgh/issues/836
const articleDataNewsNoHeadline = JSON.parse(JSON.stringify(articleDataNews));
articleDataNewsNoHeadline.content.model.blocks.shift();

jest.mock('#containers/ChartbeatAnalytics', () => {
  const ChartbeatAnalytics = () => <div>chartbeat</div>;
  return ChartbeatAnalytics;
});

// eslint-disable-next-line react/prop-types
const Context = ({ service, children }) => (
  <ToggleContextProvider>
    <ServiceContextProvider service={service}>
      <RequestContextProvider
        bbcOrigin="https://www.test.bbc.co.uk"
        id="c0000000000o"
        isAmp={false}
        pageType={ARTICLE_PAGE}
        pathname="/pathname"
        service={service}
        statusCode={200}
      >
        {children}
      </RequestContextProvider>
    </ServiceContextProvider>
  </ToggleContextProvider>
);

beforeEach(() => {
  fetch.resetMocks();
});

it('should use headline for meta description if summary does not exist', async () => {
  const articleDataNewsWithSummary = mergeDeepLeft(
    {
      promo: {
        summary: textBlock(''),
      },
    },
    articleDataNews,
  );

  render(
    <Context service="news">
      <ArticlePage pageData={articleDataNewsWithSummary} />
    </Context>,
  );

  await waitFor(() => {
    expect(
      document
        .querySelector('meta[name="description"]')
        .getAttribute('content'),
    ).toEqual('Article Headline for SEO');
  });
});
describe('ArticleMetadata get branded image', () => {
  beforeEach(() => {
    process.env.SIMORGH_ICHEF_BASE_URL = 'https://ichef.test.bbci.co.uk';
    process.env.SIMORGH_APP_ENV = 'test';
  });

  afterEach(() => {
    delete process.env.SIMORGH_APP_ENV;
    delete process.env.SIMORGH_ICHEF_BASE_URL;
  });

  it('should use default images for opengraph if promo image does not exist', async () => {
    render(
      <Context service="news">
        <ArticlePage pageData={articleDataNews} />
      </Context>,
    );

    await waitFor(() => {
      expect(
        document
          .querySelector('meta[property="og:image"]')
          .getAttribute('content'),
      ).toEqual(
        'https://static.files.bbci.co.uk/ws/simorgh-assets/public/news/images/metadata/poster-1024x576.png',
      );
    });
  });

  it('should use branded images for opengraph if promo image exists', async () => {
    const articleDataNewsWithPromoImage = mergeDeepLeft(
      {
        promo: {
          images: {
            defaultPromoImage: {
              blocks: [
                {
                  type: 'altText',
                  model: {
                    blocks: [
                      {
                        type: 'text',
                        model: {
                          blocks: [
                            {
                              type: 'paragraph',
                              model: {
                                text: 'Шайлоо 2020',
                                blocks: [
                                  {
                                    type: 'fragment',
                                    model: {
                                      text: 'Шайлоо 2020',
                                      attributes: [],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  type: 'rawImage',
                  model: {
                    width: 749,
                    height: 421,
                    locator:
                      'c34e/live/fea48140-27e5-11eb-a689-1f68cd2c5502.jpg',
                    originCode: 'cpsprodpb',
                    copyrightHolder: 'BBC',
                    suitableForSyndication: true,
                  },
                },
              ],
            },
          },
        },
      },
      articleDataNews,
    );

    render(
      <Context service="news">
        <ArticlePage pageData={articleDataNewsWithPromoImage} />
      </Context>,
    );

    await waitFor(() => {
      expect(
        document
          .querySelector('meta[property="og:image"]')
          .getAttribute('content'),
      ).toEqual(
        'https://ichef.test.bbci.co.uk/news/1024/branded_news/c34e/live/fea48140-27e5-11eb-a689-1f68cd2c5502.jpg',
      );
    });
  });
});

it('should render a news article correctly', async () => {
  fetch.mockResponse(JSON.stringify(newsMostReadData));

  const { container } = render(
    <Context service="news">
      <ArticlePage pageData={articleDataNews} />
    </Context>,
  );

  await waitFor(() => {
    expect(container).toMatchSnapshot();
  });
});

it('should render a rtl article (persian) with most read correctly', async () => {
  fetch.mockResponse(JSON.stringify(persianMostReadData));

  const { container } = render(
    <Context service="persian">
      <ArticlePage pageData={articleDataPersian} />
    </Context>,
  );

  await waitFor(() => container.querySelector('#Most-Read'));
  const mostReadSection = container.querySelector('#Most-Read');

  expect(mostReadSection).not.toBeNull();
  expect(container).toMatchSnapshot();
});

it('should render a ltr article (pidgin) with most read correctly', async () => {
  fetch.mockResponse(JSON.stringify(pidginMostReadData));

  const { container } = render(
    <Context service="pidgin">
      <ArticlePage pageData={articleDataPidgin} />
    </Context>,
  );

  await waitFor(() => container.querySelector('#Most-Read'));
  const mostReadSection = container.querySelector('#Most-Read');

  expect(mostReadSection).not.toBeNull();
  expect(container).toMatchSnapshot();
});

it('should render a news article with headline in the middle correctly', async () => {
  const headline = blockContainingText('headline', 'Article Headline', 1);

  const articleWithSummaryHeadlineInTheMiddle = {
    ...articleDataNews,
    content: {
      model: {
        blocks: [
          singleTextBlock('Paragraph above headline', 2),
          {
            ...headline,
            model: {
              ...headline.model,
              blocks: [
                {
                  ...headline.model.blocks[0],
                  position: [2, 1],
                },
              ],
            },
          },
          singleTextBlock('Paragraph below headline', 3),
        ],
      },
    },
    promo: {
      ...articleDataNews.promo,
      headlines: {
        seoHeadline: 'SEO Headline',
        promoHeadline: 'Promo Headline',
      },
    },
  };

  const { container } = render(
    <Context service="news">
      <ArticlePage pageData={articleWithSummaryHeadlineInTheMiddle} />
    </Context>,
  );

  await waitFor(() => {
    expect(container).toMatchSnapshot();
  });
});

it('should render a news article without promo headline correctly', async () => {
  const articleWithoutHeadline = {
    ...articleDataNews,
    content: {
      model: {
        blocks: [singleTextBlock('Paragraph 1', 2)],
      },
    },
    promo: {
      ...articleDataNews.promo,
      headlines: {
        seoHeadline: 'SEO Headline',
        promoHeadline: 'Promo Headline',
      },
    },
  };

  const { container } = render(
    <Context service="news">
      <ArticlePage pageData={articleWithoutHeadline} />
    </Context>,
  );

  await waitFor(() => {
    expect(container).toMatchSnapshot();
  });
});
