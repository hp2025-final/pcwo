// Script to populate categories with specification templates
import { PrismaClient } from '@prisma/client'
import { specificationTemplates } from '../lib/specification-templates'

const prisma = new PrismaClient()

async function populateCategoriesWithTemplates() {
  console.log('Starting to populate categories with specification templates...')

  for (const template of specificationTemplates) {
    try {
      // Check if category already exists
      const existingCategory = await prisma.category.findFirst({
        where: { 
          OR: [
            { name: template.categoryName },
            { slug: template.categorySlug }
          ]
        }
      })

      if (existingCategory) {
        // Update existing category with specification template
        await prisma.category.update({
          where: { id: existingCategory.id },
          data: {
            specificationTemplate: JSON.stringify(template.fields)
          }
        })
        console.log(`✅ Updated "${template.categoryName}" with specification template`)
      } else {
        // Create new category with specification template
        await prisma.category.create({
          data: {
            name: template.categoryName,
            slug: template.categorySlug,
            description: `High-performance ${template.categoryName.toLowerCase()} for PC builds`,
            isActive: true,
            sortOrder: 0,
            specificationTemplate: JSON.stringify(template.fields)
          }
        })
        console.log(`✅ Created "${template.categoryName}" with specification template`)
      }
    } catch (error) {
      console.error(`❌ Error processing "${template.categoryName}":`, error)
    }
  }

  console.log('✅ Finished populating categories with specification templates!')
}

populateCategoriesWithTemplates()
  .catch((error) => {
    console.error('Error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
