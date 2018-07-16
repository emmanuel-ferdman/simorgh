import React from 'react';
import Image from './index';
import { shouldMatchSnapshot } from '../../helpers/tests/testHelpers';

describe('Image', () => {
  shouldMatchSnapshot('should render correctly', <Image />);

  const image = Image({ alt: 'kittens', src: 'path/kittens.jpg' });

  it('should be an img', () => {
    expect(image.type).toBe('img');
  });

  it('should have alt text and src', () => {
    expect(image.props.alt).toBe('kittens');
    expect(image.props.src).toBe('path/kittens.jpg');
  });
});
