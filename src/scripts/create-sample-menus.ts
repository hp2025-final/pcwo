/**
 * Sample script to create test menus for the navigation system
 * This helps demonstrate the menu functionality
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createSampleMenus() {
  console.log('Creating sample menus...')

  try {
    // Create Main Header Menu
    const mainMenu = await prisma.menu.create({
      data: {
        name: 'Main Menu',
        handle: 'main-menu',
        description: 'Primary navigation menu for the header',
        location: 'HEADER',
        isActive: true,
        items: {
          create: [
            {
              label: 'Home',
              linkType: 'HOME',
              sortOrder: 0,
              isActive: true,
              target: '_self'
            },
            {
              label: 'Products',
              linkType: 'CATEGORY',
              linkValue: 'all-products',
              sortOrder: 1,
              isActive: true,
              target: '_self'
            },
            {
              label: 'PC Builder',
              linkType: 'CUSTOM',
              url: '/build',
              sortOrder: 2,
              isActive: true,
              target: '_self'
            },
            {
              label: 'Shops',
              linkType: 'CUSTOM',
              url: '/shops',
              sortOrder: 3,
              isActive: true,
              target: '_self'
            },
            {
              label: 'About',
              linkType: 'ABOUT',
              sortOrder: 4,
              isActive: true,
              target: '_self'
            },
            {
              label: 'Contact',
              linkType: 'CONTACT',
              sortOrder: 5,
              isActive: true,
              target: '_self'
            }
          ]
        }
      }
    })

    // Create Footer Menu
    const footerMenu = await prisma.menu.create({
      data: {
        name: 'Footer Menu',
        handle: 'footer-menu',
        description: 'Navigation links for the footer',
        location: 'FOOTER',
        isActive: true,
        items: {
          create: [
            {
              label: 'Products',
              linkType: 'CUSTOM',
              url: '/products',
              sortOrder: 0,
              isActive: true,
              target: '_self'
            },
            {
              label: 'Categories',
              linkType: 'CUSTOM',
              url: '/categories',
              sortOrder: 1,
              isActive: true,
              target: '_self'
            },
            {
              label: 'PC Builder',
              linkType: 'CUSTOM',
              url: '/build',
              sortOrder: 2,
              isActive: true,
              target: '_self'
            },
            {
              label: 'Shops',
              linkType: 'CUSTOM',
              url: '/shops',
              sortOrder: 3,
              isActive: true,
              target: '_self'
            }
          ]
        }
      }
    })

    // Create Mobile Menu
    const mobileMenu = await prisma.menu.create({
      data: {
        name: 'Mobile Menu',
        handle: 'mobile-menu',
        description: 'Navigation menu for mobile devices',
        location: 'MOBILE',
        isActive: true,
        items: {
          create: [
            {
              label: 'Home',
              linkType: 'HOME',
              sortOrder: 0,
              isActive: true,
              target: '_self'
            },
            {
              label: 'Products',
              linkType: 'CUSTOM',
              url: '/products',
              sortOrder: 1,
              isActive: true,
              target: '_self'
            },
            {
              label: 'Categories',
              linkType: 'CUSTOM',
              url: '/categories',
              sortOrder: 2,
              isActive: true,
              target: '_self'
            },
            {
              label: 'PC Builder',
              linkType: 'CUSTOM',
              url: '/build',
              sortOrder: 3,
              isActive: true,
              target: '_self'
            },
            {
              label: 'Shops',
              linkType: 'CUSTOM',
              url: '/shops',
              sortOrder: 4,
              isActive: true,
              target: '_self'
            },
            {
              label: 'Contact',
              linkType: 'CONTACT',
              sortOrder: 5,
              isActive: true,
              target: '_self'
            }
          ]
        }
      }
    })

    // Create a nested menu example for categories
    const categoriesMenu = await prisma.menu.create({
      data: {
        name: 'Categories Menu',
        handle: 'categories-menu',
        description: 'Hierarchical menu for product categories',
        location: 'SIDEBAR',
        isActive: true
      }
    })

    // Add parent category items
    const componentsItem = await prisma.menuItem.create({
      data: {
        label: 'Components',
        linkType: 'CATEGORY',
        linkValue: 'components',
        sortOrder: 0,
        isActive: true,
        target: '_self',
        menuId: categoriesMenu.id
      }
    })

    const peripheralsItem = await prisma.menuItem.create({
      data: {
        label: 'Peripherals',
        linkType: 'CATEGORY',
        linkValue: 'peripherals',
        sortOrder: 1,
        isActive: true,
        target: '_self',
        menuId: categoriesMenu.id
      }
    })

    // Add child items to Components
    await prisma.menuItem.createMany({
      data: [
        {
          label: 'CPUs',
          linkType: 'CATEGORY',
          linkValue: 'cpus',
          sortOrder: 0,
          isActive: true,
          target: '_self',
          menuId: categoriesMenu.id,
          parentId: componentsItem.id
        },
        {
          label: 'GPUs',
          linkType: 'CATEGORY',
          linkValue: 'gpus',
          sortOrder: 1,
          isActive: true,
          target: '_self',
          menuId: categoriesMenu.id,
          parentId: componentsItem.id
        },
        {
          label: 'Motherboards',
          linkType: 'CATEGORY',
          linkValue: 'motherboards',
          sortOrder: 2,
          isActive: true,
          target: '_self',
          menuId: categoriesMenu.id,
          parentId: componentsItem.id
        }
      ]
    })

    // Add child items to Peripherals
    await prisma.menuItem.createMany({
      data: [
        {
          label: 'Keyboards',
          linkType: 'CATEGORY',
          linkValue: 'keyboards',
          sortOrder: 0,
          isActive: true,
          target: '_self',
          menuId: categoriesMenu.id,
          parentId: peripheralsItem.id
        },
        {
          label: 'Mice',
          linkType: 'CATEGORY',
          linkValue: 'mice',
          sortOrder: 1,
          isActive: true,
          target: '_self',
          menuId: categoriesMenu.id,
          parentId: peripheralsItem.id
        },
        {
          label: 'Monitors',
          linkType: 'CATEGORY',
          linkValue: 'monitors',
          sortOrder: 2,
          isActive: true,
          target: '_self',
          menuId: categoriesMenu.id,
          parentId: peripheralsItem.id
        }
      ]
    })

    console.log('✅ Sample menus created successfully!')
    console.log(`Main Menu ID: ${mainMenu.id}`)
    console.log(`Footer Menu ID: ${footerMenu.id}`)
    console.log(`Mobile Menu ID: ${mobileMenu.id}`)
    console.log(`Categories Menu ID: ${categoriesMenu.id}`)

  } catch (error) {
    console.error('❌ Error creating sample menus:', error)
    throw error
  }
}

async function main() {
  await createSampleMenus()
  await prisma.$disconnect()
}

if (require.main === module) {
  main()
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

export { createSampleMenus }
