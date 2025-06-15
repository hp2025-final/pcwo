// Quick API test to create a sample category with specification template
async function createSampleCategory() {
  const categoryData = {
    name: "Gaming Monitors",
    slug: "gaming-monitors",
    description: "High-performance gaming monitors for competitive gaming",
    isActive: true,
    sortOrder: 0,
    specificationTemplate: JSON.stringify([
      {
        key: "screenSize",
        label: "Screen Size",
        type: "number",
        required: true,
        unit: "inches",
        placeholder: "27"
      },
      {
        key: "resolution",
        label: "Resolution",
        type: "select",
        required: true,
        options: ["1920x1080 (Full HD)", "2560x1440 (QHD)", "3840x2160 (4K UHD)"]
      },
      {
        key: "refreshRate",
        label: "Refresh Rate",
        type: "number",
        required: true,
        unit: "Hz",
        placeholder: "144"
      },
      {
        key: "panelType",
        label: "Panel Type",
        type: "select",
        options: ["IPS", "VA", "TN", "OLED"]
      },
      {
        key: "responseTime",
        label: "Response Time",
        type: "number",
        unit: "ms",
        placeholder: "1"
      },
      {
        key: "hdrSupport",
        label: "HDR Support",
        type: "boolean"
      },
      {
        key: "adaptiveSync",
        label: "Adaptive Sync Technology",
        type: "select",
        options: ["G-Sync", "FreeSync", "G-Sync Compatible", "None"]
      },
      {
        key: "connectivity",
        label: "Connectivity Options",
        type: "textarea",
        placeholder: "HDMI 2.1, DisplayPort 1.4, USB-C..."
      }
    ])
  };

  console.log('Sample category data:', JSON.stringify(categoryData, null, 2));
}

createSampleCategory();
