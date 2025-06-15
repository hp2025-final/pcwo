// Script to create sample categories for testing dynamic specifications
// Run this in the browser console or as a Node.js script

const sampleCategories = [
  {
    name: 'Processors',
    slug: 'processors',
    description: 'CPU processors for desktop computers',
    isActive: true,
    sortOrder: 1
  },
  {
    name: 'Graphics Cards',
    slug: 'graphics-cards',
    description: 'GPU graphics cards for gaming and professional work',
    isActive: true,
    sortOrder: 2
  },
  {
    name: 'Motherboards',
    slug: 'motherboards',
    description: 'Motherboards for desktop computers',
    isActive: true,
    sortOrder: 3
  },
  {
    name: 'Memory',
    slug: 'memory',
    description: 'RAM memory modules',
    isActive: true,
    sortOrder: 4
  },
  {
    name: 'Storage',
    slug: 'storage',
    description: 'SSD, HDD and NVMe storage devices',
    isActive: true,
    sortOrder: 5
  },
  {
    name: 'Power Supplies',
    slug: 'power-supplies',
    description: 'PSU power supply units',
    isActive: true,
    sortOrder: 6
  },
  {
    name: 'Cases',
    slug: 'cases',
    description: 'PC cases and chassis',
    isActive: true,
    sortOrder: 7
  },
  {
    name: 'Cooling',
    slug: 'cooling',
    description: 'CPU coolers, case fans and liquid cooling',
    isActive: true,
    sortOrder: 8
  }
]

// Function to create categories via API
async function createSampleCategories() {
  for (const category of sampleCategories) {
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category)
      })
      
      const result = await response.json()
      if (result.success) {
        console.log(`✅ Created category: ${category.name}`)
      } else {
        console.log(`❌ Failed to create category: ${category.name} - ${result.error}`)
      }
    } catch (error) {
      console.log(`❌ Error creating category: ${category.name} - ${error.message}`)
    }
  }
}

// Uncomment the line below to run the script
// createSampleCategories()

export { sampleCategories, createSampleCategories }
