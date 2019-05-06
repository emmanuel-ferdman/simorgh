import applyTimestampRules from './timestamp';
import deepClone from '../../../../helpers/json/deepClone';

const paragraphBlock = {
  type: 'text',
  model: {
    blocks: [
      {
        type: 'paragraph',
        model: {
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
          blocks: [
            {
              type: 'fragment',
              model: {
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
                attributes: [],
              },
            },
          ],
        },
      },
    ],
  },
};

const imageBlock = {
  type: 'image',
  model: {
    blocks: [
      {
        type: 'image',
        model: {
          text: 'some image URL',
          blocks: [
            {
              type: 'fragment',
              model: {
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
                attributes: [],
              },
            },
          ],
        },
      },
    ],
  },
};

const headlineBlock = {
  type: 'headline',
  model: {
    blocks: [
      {
        type: 'text',
        model: {
          blocks: [
            {
              type: 'paragraph',
              model: {
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
                blocks: [
                  {
                    type: 'fragment',
                    model: {
                      text:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
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
};

const aresMediaBlock = {
  type: 'aresMedia',
  model: {
    blocks: [
      {
        type: 'video',
        model: {
          blocks: [
            {
              type: 'video',
              model: {
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
                blocks: [
                  {
                    type: 'fragment',
                    model: {
                      text:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
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
};

describe('Timestamp rules', () => {
  it('should put Timestamp block after headline and image, if headline exists with image immedeately after it', () => {
    const fixtureData = {
      metadata: {
        firstPublished: 1514808060000,
        lastPublished: 1514811600000,
        blockTypes: ['headline', 'text', 'paragraph', 'fragment', 'image'],
      },
      content: {
        model: {
          blocks: [paragraphBlock, headlineBlock, imageBlock],
        },
      },
    };
    const expectedTransform = Object.assign(deepClone(fixtureData), {
      content: {
        model: {
          blocks: [
            paragraphBlock,
            headlineBlock,
            imageBlock,
            {
              type: 'timestamp',
              model: {
                firstPublished: 1514808060000,
                lastPublished: 1514811600000,
              },
            },
          ],
        },
      },
    });
    expect(applyTimestampRules(fixtureData)).toEqual(expectedTransform);
  });

  it('should put Timestamp block after headline and type aresMedia, if headline exists with type aresMedia immedeately after it', () => {
    const fixtureData = {
      metadata: {
        firstPublished: 1514808060000,
        lastPublished: 1514811600000,
        blockTypes: ['headline', 'text', 'paragraph', 'fragment', 'aresMedia'],
      },
      content: {
        model: {
          blocks: [paragraphBlock, headlineBlock, aresMediaBlock],
        },
      },
    };
    const expectedTransform = Object.assign(deepClone(fixtureData), {
      content: {
        model: {
          blocks: [
            paragraphBlock,
            headlineBlock,
            aresMediaBlock,
            {
              type: 'timestamp',
              model: {
                firstPublished: 1514808060000,
                lastPublished: 1514811600000,
              },
            },
          ],
        },
      },
    });
    expect(applyTimestampRules(fixtureData)).toEqual(expectedTransform);
  });

  it('should put Timestamp block first if no headline', () => {
    const fixtureData = {
      metadata: {
        firstPublished: 1514808060000,
        lastPublished: 1514811600000,
        blockTypes: ['text', 'paragraph', 'fragment'],
      },
      content: {
        model: {
          blocks: [paragraphBlock],
        },
      },
    };
    const expectedTransform = Object.assign(deepClone(fixtureData), {
      content: {
        model: {
          blocks: [
            {
              type: 'timestamp',
              model: {
                firstPublished: 1514808060000,
                lastPublished: 1514811600000,
              },
            },
            paragraphBlock,
          ],
        },
      },
    });
    expect(applyTimestampRules(fixtureData)).toEqual(expectedTransform);
  });

  it('should put Timestamp block after Headline if headline exists, with no image or aresMedia immediately after it', () => {
    const fixtureData = {
      metadata: {
        firstPublished: 1514808060000,
        lastPublished: 1514811600000,
        blockTypes: ['headline', 'text', 'fragment', 'paragraph'],
      },
      content: {
        model: {
          blocks: [headlineBlock, paragraphBlock],
        },
      },
    };
    const expectedTransform = Object.assign(deepClone(fixtureData), {
      content: {
        model: {
          blocks: [
            headlineBlock,
            {
              type: 'timestamp',
              model: {
                firstPublished: 1514808060000,
                lastPublished: 1514811600000,
              },
            },
            paragraphBlock,
          ],
        },
      },
    });
    expect(applyTimestampRules(fixtureData)).toEqual(expectedTransform);
  });
});
