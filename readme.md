# use-match-container

A React hook that provides a convenient way to use CSS Container Queries with JavaScript. This hook is a wrapper around the [match-container](https://github.com/teetotum/match-container) polyfill, making it easy to respond to container size and style changes in React components.

## Installation

```bash
bun add use-match-container
```

## Basic Usage

```tsx
import {useMatchContainer} from 'use-match-container';

export default function MyComponent() {
  const {
    ref,
    matches: [isSmall, isBlueTheme],
  } = useMatchContainer([
    '(width < 400px)',
    'style(--themeColor: blue)',
  ] as const);

  return (
    <div style={{containerType: 'inline-size'}}>
      <div ref={ref}>
        {isSmall ? 'Small container' : 'Large container'}
        {isBlueTheme ? 'Blue theme' : 'Other theme'}
      </div>
    </div>
  );
}
```

## API Reference

### `useMatchContainer(queries: T[])`

**Parameters:**

- `queries`: An array of container query strings. Each query should be a valid CSS container query condition.

**Returns:**

- `ref`: A React ref that should be attached to the element you want to observe
- `matches`: A tuple of boolean values corresponding to each query's match state

### Container Query Syntax

#### Size Queries

```tsx
// Width queries
'(width < 400px)';
'(width >= 600px)';
'(width = 800px)';

// Height queries
'(height < 300px)';
'(height > 500px)';

// Aspect ratio queries
'(aspect-ratio < 16/9)';
'(aspect-ratio > 4/3)';

// Combined queries
'(width < 400px) and (height > 300px)';
'(width < 400px) or (height < 300px)';
```

#### Style Queries

```tsx
// Check if a CSS custom property exists
'style(--my-property)';

// Check if a CSS custom property equals a specific value
'style(--themeColor: blue)';
'style(--spacing: 16px)';

// Check if a CSS custom property is within a range
'style(--fontSize: 14px to 18px)';

// Negation
'not style(--themeColor: blue)';

// Complex combinations
'style(--themeColor: blue) or style(--themeColor: purple)';
'style(--themeColor: blue) and (width < 400px)';
```

## Examples

### Responsive Card Component

```tsx
import {useMatchContainer} from 'use-match-container';

export default function ResponsiveCard() {
  const {
    ref,
    matches: [isCompact, isWide, isDarkTheme],
  } = useMatchContainer([
    '(width < 300px)',
    '(width > 600px)',
    'style(--theme: dark)',
  ] as const);

  return (
    <div
      style={{
        containerType: 'inline-size',
        '--theme': 'light',
      }}
    >
      <div
        ref={ref}
        className={`card ${isCompact ? 'compact' : ''} ${isWide ? 'wide' : ''}`}
        style={{
          padding: isCompact ? '8px' : '16px',
          fontSize: isWide ? '18px' : '14px',
          backgroundColor: isDarkTheme ? '#1f2937' : '#ffffff',
          color: isDarkTheme ? '#f9fafb' : '#111827',
        }}
      >
        <h3>Responsive Card</h3>
        <p>This card adapts to its container size and theme.</p>

        <div className='status'>
          <span>Compact: {isCompact ? 'Yes' : 'No'}</span>
          <span>Wide: {isWide ? 'Yes' : 'No'}</span>
          <span>Dark: {isDarkTheme ? 'Yes' : 'No'}</span>
        </div>
      </div>
    </div>
  );
}
```

### Dynamic Layout Component

```tsx
import {useMatchContainer} from 'use-match-container';

export default function DynamicLayout() {
  const {
    ref,
    matches: [isMobile, isTablet, isDesktop, isLandscape],
  } = useMatchContainer([
    '(width < 768px)',
    '(width >= 768px) and (width < 1024px)',
    '(width >= 1024px)',
    '(aspect-ratio > 1)',
  ] as const);

  return (
    <div style={{containerType: 'inline-size'}}>
      <div ref={ref} className='layout-content'>
        {isMobile && <div className='mobile-layout'>Mobile Layout</div>}
        {isTablet && <div className='tablet-layout'>Tablet Layout</div>}
        {isDesktop && <div className='desktop-layout'>Desktop Layout</div>}

        <div
          className={`orientation ${isLandscape ? 'landscape' : 'portrait'}`}
        >
          {isLandscape ? 'Landscape' : 'Portrait'} Mode
        </div>
      </div>
    </div>
  );
}
```

### Theme-Aware Component

```tsx
import {useMatchContainer} from 'use-match-container';

export default function ThemeAwareButton() {
  const {
    ref,
    matches: [isPrimary, isSecondary, isDanger],
  } = useMatchContainer([
    'style(--variant: primary)',
    'style(--variant: secondary)',
    'style(--variant: danger)',
  ] as const);

  const getButtonStyle = () => {
    if (isPrimary) {
      return {backgroundColor: '#3b82f6', color: 'white'};
    }
    if (isSecondary) {
      return {backgroundColor: '#6b7280', color: 'white'};
    }
    if (isDanger) {
      return {backgroundColor: '#ef4444', color: 'white'};
    }
    return {backgroundColor: '#e5e7eb', color: '#374151'};
  };

  return (
    <div
      style={{
        containerType: 'inline-size',
        '--variant': 'primary',
      }}
    >
      <button
        ref={ref}
        style={getButtonStyle()}
        className='px-4 py-2 rounded font-medium'
      >
        Dynamic Button
      </button>

      <div className='mt-2 text-sm'>
        Current variant:{' '}
        {isPrimary
          ? 'primary'
          : isSecondary
          ? 'secondary'
          : isDanger
          ? 'danger'
          : 'default'}
      </div>
    </div>
  );
}
```
