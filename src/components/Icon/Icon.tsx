import { forwardRef, SVGAttributes } from 'react'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CaretDownIcon,
  CaretUpIcon,
  XIcon,
  ListIcon,
  PlusIcon,
  MinusIcon,
  CheckIcon,
  PencilSimpleIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  UserIcon,
  GearIcon,
  EnvelopeSimpleIcon,
  BellIcon,
  InfoIcon,
  WarningIcon,
  CheckCircleIcon,
  XCircleIcon,
  type Icon as PhosphorIcon,
} from '@phosphor-icons/react'
import type { Responsive } from '../../utils/Responsive'
import { isResponsiveObject } from '../../utils/Responsive'
import { processResponsiveProps } from '../../utils/responsiveProps'
import { generateResponsiveDataAttributes } from '../../utils/responsiveDataAttributes'
import './Icon.scss'

/**
 * Supported icon names for the Icon component.
 *
 * These are kebab-case names that map to Phosphor icons.
 * To add a new icon:
 * 1. Import the icon from '@phosphor-icons/react'
 * 2. Add the kebab-case name to the IconName type
 * 3. Add the mapping in the ICON_MAP object below
 *
 * @example
 * // To add a "heart" icon:
 * // 1. Import: import { HeartIcon } from '@phosphor-icons/react'
 * // 2. Add to type: | 'heart'
 * // 3. Add to map: 'heart': HeartIcon
 */
export type IconName =
  | 'arrow-left'
  | 'arrow-right'
  | 'caret-down'
  | 'caret-up'
  | 'x'
  | 'list'
  | 'plus'
  | 'minus'
  | 'check'
  | 'pencil'
  | 'trash'
  | 'search'
  | 'user'
  | 'gear'
  | 'envelope'
  | 'bell'
  | 'info'
  | 'warning'
  | 'check-circle'
  | 'x-circle'

/**
 * Map of icon names to Phosphor icon components.
 *
 * HOW TO ADD NEW ICONS:
 * ---------------------
 * 1. Visit https://phosphoricons.com/ to browse available icons
 * 2. Find the icon you want and note its name (e.g., "Heart")
 * 3. Import it at the top of this file:
 *    import { HeartIcon } from '@phosphor-icons/react'
 * 4. Add a kebab-case entry to the IconName type above:
 *    | 'heart'
 * 5. Add the mapping here:
 *    'heart': HeartIcon,
 * 6. The icon is now available: <Icon name="heart" />
 */
const ICON_MAP: Record<IconName, PhosphorIcon> = {
  'arrow-left': ArrowLeftIcon,
  'arrow-right': ArrowRightIcon,
  'caret-down': CaretDownIcon,
  'caret-up': CaretUpIcon,
  x: XIcon,
  list: ListIcon,
  plus: PlusIcon,
  minus: MinusIcon,
  check: CheckIcon,
  pencil: PencilSimpleIcon,
  trash: TrashIcon,
  search: MagnifyingGlassIcon,
  user: UserIcon,
  gear: GearIcon,
  envelope: EnvelopeSimpleIcon,
  bell: BellIcon,
  info: InfoIcon,
  warning: WarningIcon,
  'check-circle': CheckCircleIcon,
  'x-circle': XCircleIcon,
}

export interface IconProps
  extends Omit<SVGAttributes<SVGSVGElement>, 'ref' | 'size' | 'color'> {
  /** The name of the icon to display */
  name: IconName
  /** The size of the icon (number for pixels, or string like "1.5rem") */
  size?: Responsive<number | string>
  /** The color of the icon (defaults to currentColor) */
  color?: Responsive<string>
  /** Additional CSS class names */
  className?: string
  /** Accessible label for the icon (adds aria-label) */
  alt?: string
}

/**
 * Get the base value from a responsive prop for use in calculations
 */
function getBaseValue<T>(value: Responsive<T> | undefined, defaultValue: T): T {
  if (!value) return defaultValue
  if (isResponsiveObject(value)) {
    return value.base !== undefined ? value.base : defaultValue
  }
  return value
}

/**
 * Icon component that wraps Phosphor icons with a typed interface.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Icon name="check" />
 *
 * // With size
 * <Icon name="arrow-right" size={24} />
 *
 * // With responsive size
 * <Icon name="arrow-right" size={{ base: 20, md: 24 }} />
 *
 * // With custom color
 * <Icon name="warning" color="var(--color-warning)" />
 *
 * // With responsive color
 * <Icon name="warning" color={{ base: 'currentColor', md: 'var(--color-warning)' }} />
 *
 * // With accessibility label
 * <Icon name="x" alt="Close" />
 * ```
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(
  (
    {
      name,
      size = 20,
      color = 'currentColor',
      className = '',
      alt,
      style,
      ...props
    },
    ref,
  ) => {
    const IconComponent = ICON_MAP[name]

    if (!IconComponent) {
      console.warn(`Icon "${name}" not found in ICON_MAP`)
      return null
    }

    // Process responsive props to CSS custom properties
    const responsiveStyles = processResponsiveProps('icon', {
      size,
      color,
    })

    // Get base values for Phosphor icon props (Phosphor icons don't support responsive props directly)
    const baseSize = getBaseValue(size, 20)
    const baseColor = getBaseValue(color, 'currentColor')

    // Generate data attributes for responsive props
    const dataAttributes = generateResponsiveDataAttributes(
      {
        size,
        color,
      },
      { includeBreakpointValues: true },
    )

    const classNames = ['zen-icon', className].filter(Boolean).join(' ')

    return (
      <IconComponent
        ref={ref}
        size={baseSize}
        weight="light"
        color={baseColor}
        className={classNames}
        style={{ ...responsiveStyles, ...style }}
        aria-label={alt}
        aria-hidden={!alt}
        {...dataAttributes}
        {...props}
      />
    )
  },
)

Icon.displayName = 'Icon'

/** List of all available icon names for iteration */
export const ICON_NAMES: IconName[] = Object.keys(ICON_MAP) as IconName[]
