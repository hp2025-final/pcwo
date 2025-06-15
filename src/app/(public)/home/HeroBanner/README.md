# HeroBanner Component Usage Examples

The HeroBanner component is now reusable and can be used in multiple ways:

## Basic Usage with Predefined Variants

```tsx
// Default banner (banner1)
<HeroBanner />

// Gaming banner
<HeroBanner variant="banner1" />

// Ultimate Gaming Experience banner
<HeroBanner variant="banner2" />

// Professional Workstations banner
<HeroBanner variant="banner3" />
```

## Custom Banner with Override Props

```tsx
// Custom banner overriding specific properties
<HeroBanner 
  variant="banner1"
  title="Custom Title"
  subtitle=" Custom Subtitle"
  description="Custom description for your specific page."
  primaryButtonText="Custom Button"
  height="700px"
/>

// Completely custom banner
<HeroBanner 
  title="Black Friday Sale"
  subtitle=" Up to 50% Off"
  description="Limited time offer on all gaming PCs and components."
  backgroundImage="/uploads/products/sale-banner.jpg"
  primaryButtonText="Shop Sale"
  primaryButtonLink="/sale"
  secondaryButtonText="View Deals"
  secondaryButtonLink="/deals"
  height="600px"
/>
```

## Usage in Different Pages

```tsx
// In a product category page
<HeroBanner 
  variant="banner2"
  title="Gaming Laptops"
  subtitle=" On Sale"
  primaryButtonText="Browse Laptops"
  primaryButtonLink="/laptops"
/>

// In a custom build page
<HeroBanner 
  variant="banner3"
  title="Build Your PC"
  subtitle=" Your Way"
  description="Start with our PC builder tool and create the perfect system."
  primaryButtonText="PC Builder"
  primaryButtonLink="/pc-builder"
/>
```

## Available Props

- `variant`: 'banner1' | 'banner2' | 'banner3' (predefined configurations)
- `title`: Main title text
- `subtitle`: Subtitle text (usually styled differently)
- `description`: Description paragraph
- `backgroundImage`: Background image path
- `primaryButtonText`: Text for the primary button
- `primaryButtonLink`: Link for the primary button
- `secondaryButtonText`: Text for the secondary button
- `secondaryButtonLink`: Link for the secondary button
- `height`: Custom height (e.g., '500px', '100vh')

All props are optional - if not provided, the component will use the values from the selected variant.
