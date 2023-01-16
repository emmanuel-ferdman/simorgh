import React from 'react';
import styled from '@emotion/styled';
import { node, oneOf, string } from 'prop-types';
import { GEL_SPACING_SEXT } from '#psammead/gel-foundations/src/spacings';
import {
  GEL_GROUP_2_SCREEN_WIDTH_MIN,
  GEL_GROUP_2_SCREEN_WIDTH_MAX,
} from '#psammead/gel-foundations/src/breakpoints';
import { C_WHITE, C_BLACK } from '#psammead/psammead-styles/src/colours';

// Because IE11 can't handle 8-digit hex, need to convert to rgba
const hexToRGB = (hex, alpha = 1) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const focusIndicatorThickness = '0.1875rem'; // 3px

const StyledScrollableNav = styled.div`
  @media (max-width: ${GEL_GROUP_2_SCREEN_WIDTH_MAX}) {
    white-space: nowrap;
    overflow-x: scroll;

    /* Avoid using smooth scrolling as it causes accessibility issues */
    scroll-behavior: auto;
    -webkit-overflow-scrolling: touch;

    /* Hide scrollbar */
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }

  // Change default focus indicator on Firefox to be inline with new focus indicator styling.
  // Declarations ensure backwards compatibility.
  &:focus::after {
    outline: ${focusIndicatorThickness} solid ${C_BLACK};
    content: ' ';
    position: absolute;
    height: 100%;
    // for dropdown button.
    left: 2.75rem;
    width: 100%;
  }
  &:focus:not(:focus-visible)::after {
    outline: revert;
  }
  &:focus-visible::after {
    outline: ${focusIndicatorThickness} solid ${C_BLACK};
    content: ' ';
    position: absolute;
    height: 100%;
    // for dropdown button.
    left: 2.75rem;
    width: 100%;
  }

  &:after {
    content: ' ';
    height: 100%;
    width: ${GEL_SPACING_SEXT};
    @media (min-width: ${GEL_GROUP_2_SCREEN_WIDTH_MIN}) {
      width: 6rem;
    }
    position: absolute;
    ${({ dir }) => `
        ${dir === 'ltr' ? 'right' : 'left'}: 0;
      `}
    bottom: 0;
    z-index: 3;
    overflow: hidden;
    pointer-events: none;
    background: linear-gradient(
      ${({ dir }) => (dir === 'ltr' ? 'to right' : 'to left')},
      ${({ brandBackgroundColour }) => hexToRGB(brandBackgroundColour, 0)} 0%,
      ${({ brandBackgroundColour }) => hexToRGB(brandBackgroundColour, 1)} 100%
    );
  }
`;

export const ScrollableNavigation = ({
  children,
  dir,
  brandBackgroundColour,
  brandHighlightColour,
  ...props
}) => (
  <StyledScrollableNav
    data-e2e="scrollable-nav"
    dir={dir}
    brandBackgroundColour={C_WHITE}
    brandHighlightColour={brandHighlightColour}
    {...props}
  >
    {children}
  </StyledScrollableNav>
);

ScrollableNavigation.propTypes = {
  children: node.isRequired,
  dir: oneOf(['ltr', 'rtl']),
  brandBackgroundColour: string.isRequired,
  brandHighlightColour: string.isRequired,
};

ScrollableNavigation.defaultProps = {
  dir: 'ltr',
};

export default ScrollableNavigation;
