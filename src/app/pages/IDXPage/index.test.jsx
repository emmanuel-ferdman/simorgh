import React from 'react';
import { shouldMatchSnapshot } from '@bbc/psammead-test-helpers';
import IDXPage from '.';

describe('IDXPage', () => {
  shouldMatchSnapshot(
    'should correctly render a blank page with HOC components',
    <IDXPage />,
  );
});
