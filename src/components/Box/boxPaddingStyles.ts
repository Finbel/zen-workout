import { css, SerializedStyles } from '@emotion/react'
import type { Responsive } from '../../utils/Responsive'
import { responsiveStyles } from '../../utils/responsiveStyles'
import { BoxPadding, paddingToCSS } from './Box'

/**
 * Generate Emotion styles for Box padding props
 * This utility can be shared between Box and components that extend BoxProps
 *
 * @param padding - Padding on all sides
 * @param paddingHorizontal - Horizontal padding (left and right)
 * @param paddingVertical - Vertical padding (top and bottom)
 * @returns Emotion SerializedStyles or undefined if no padding props are provided
 */
export function getPaddingEmotionStyles(
  padding?: Responsive<BoxPadding>,
  paddingHorizontal?: Responsive<BoxPadding>,
  paddingVertical?: Responsive<BoxPadding>,
): SerializedStyles | undefined {
  const paddingStyles = responsiveStyles('padding', padding, paddingToCSS)
  const paddingLeftStyles = responsiveStyles(
    'paddingLeft',
    paddingHorizontal,
    paddingToCSS,
  )
  const paddingRightStyles = responsiveStyles(
    'paddingRight',
    paddingHorizontal,
    paddingToCSS,
  )
  const paddingTopStyles = responsiveStyles(
    'paddingTop',
    paddingVertical,
    paddingToCSS,
  )
  const paddingBottomStyles = responsiveStyles(
    'paddingBottom',
    paddingVertical,
    paddingToCSS,
  )

  // Combine all padding styles
  if (
    !paddingStyles &&
    !paddingLeftStyles &&
    !paddingRightStyles &&
    !paddingTopStyles &&
    !paddingBottomStyles
  ) {
    return undefined
  }

  return css`
    ${paddingStyles}
    ${paddingLeftStyles}
    ${paddingRightStyles}
    ${paddingTopStyles}
    ${paddingBottomStyles}
  `
}
