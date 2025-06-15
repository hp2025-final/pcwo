export type LinkType = 'CUSTOM' | 'PAGE' | 'CATEGORY' | 'PRODUCT' | 'SHOP' | 'BRAND' | 'HOME' | 'CONTACT' | 'ABOUT'

export interface MenuItem {
  id: string
  label: string
  url: string | null
  linkType: LinkType
  linkValue: string | null
  target: string
  cssClass: string | null
  isActive: boolean
  sortOrder: number
  parentId: string | null
  children?: MenuItem[]
}

/**
 * Resolves a menu item's URL based on its link type and value
 */
export function resolveMenuItemUrl(item: MenuItem): string {
  switch (item.linkType) {
    case 'HOME':
      return '/'
    
    case 'CONTACT':
      return '/contact'
    
    case 'ABOUT':
      return '/about'
    
    case 'CATEGORY':
      return item.linkValue ? `/category/${item.linkValue}` : '#'
    
    case 'PRODUCT':
      return item.linkValue ? `/product/${item.linkValue}` : '#'
    
    case 'SHOP':
      return item.linkValue ? `/shop/${item.linkValue}` : '#'
    
    case 'BRAND':
      return item.linkValue ? `/brand/${item.linkValue}` : '#'
    
    case 'PAGE':
      return item.linkValue ? `/${item.linkValue}` : '#'
    
    case 'CUSTOM':
      return item.url || '#'
    
    default:
      return '#'
  }
}

/**
 * Builds a hierarchical menu structure from flat menu items
 */
export function buildMenuTree(items: MenuItem[]): MenuItem[] {
  const itemMap = new Map<string, MenuItem>()
  const topLevelItems: MenuItem[] = []

  // First pass: create a map of all items
  items.forEach(item => {
    itemMap.set(item.id, { ...item, children: [] })
  })

  // Second pass: build the tree structure
  items.forEach(item => {
    const menuItem = itemMap.get(item.id)!
    
    if (item.parentId) {
      const parent = itemMap.get(item.parentId)
      if (parent) {
        parent.children = parent.children || []
        parent.children.push(menuItem)
      }
    } else {
      topLevelItems.push(menuItem)
    }
  })

  // Sort items by sortOrder
  const sortItems = (items: MenuItem[]) => {
    items.sort((a, b) => a.sortOrder - b.sortOrder)
    items.forEach(item => {
      if (item.children && item.children.length > 0) {
        sortItems(item.children)
      }
    })
  }

  sortItems(topLevelItems)
  return topLevelItems
}

/**
 * Flattens a menu tree back to a flat array
 */
export function flattenMenuTree(items: MenuItem[]): MenuItem[] {
  const result: MenuItem[] = []
  
  const flatten = (items: MenuItem[], level: number = 0) => {
    items.forEach(item => {
      result.push({ ...item, children: undefined })
      if (item.children && item.children.length > 0) {
        flatten(item.children, level + 1)
      }
    })
  }
  
  flatten(items)
  return result
}

/**
 * Validates that a menu item's link value is appropriate for its link type
 */
export function validateMenuItemLinkValue(linkType: LinkType, linkValue: string | null): boolean {
  switch (linkType) {
    case 'HOME':
    case 'CONTACT':
    case 'ABOUT':
      return true // These don't need link values
    
    case 'CUSTOM':
      return true // URL is stored in the url field, not linkValue
    
    case 'CATEGORY':
    case 'PRODUCT':
    case 'SHOP':
    case 'BRAND':
    case 'PAGE':
      return !!linkValue && linkValue.trim().length > 0
    
    default:
      return false
  }
}

/**
 * Gets a user-friendly description of a menu item's link
 */
export function getMenuItemLinkDescription(item: MenuItem): string {
  switch (item.linkType) {
    case 'HOME':
      return 'Home Page'
    
    case 'CONTACT':
      return 'Contact Page'
    
    case 'ABOUT':
      return 'About Page'
    
    case 'CATEGORY':
      return `Category: ${item.linkValue || 'Not specified'}`
    
    case 'PRODUCT':
      return `Product: ${item.linkValue || 'Not specified'}`
    
    case 'SHOP':
      return `Shop: ${item.linkValue || 'Not specified'}`
    
    case 'BRAND':
      return `Brand: ${item.linkValue || 'Not specified'}`
    
    case 'PAGE':
      return `Page: ${item.linkValue || 'Not specified'}`
    
    case 'CUSTOM':
      return `Custom URL: ${item.url || 'Not specified'}`
    
    default:
      return 'Unknown link type'
  }
}
