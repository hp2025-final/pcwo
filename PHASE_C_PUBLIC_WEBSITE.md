### 🌐 PHASE C: Public Website (Complete Third)

1.  **Public Layout & Design**
    -   **Objective:** Create a visually appealing, user-friendly, high-performance, and responsive public-facing website based on a single, fixed theme. Content for key areas will be dynamically managed through the Admin CMS.
    -   **Key Characteristics:**
        -   **Responsive Design:** Ensure optimal viewing and interaction experience across a wide range of devices (desktops, tablets, mobile phones). Implement a mobile-first approach.
        -   **Performance Optimized:** Focus on fast load times (image optimization, minified CSS/JS, efficient data fetching, server-side rendering (SSR) or static site generation (SSG) for content-heavy pages if framework allows).
        -   **Single Fixed Theme:** The website will use one consistent visual theme. No theme switching for users or admins. The design should be modern, clean, and professional, reflecting the PC hardware niche.
        -   **CMS-Driven Content:** Key content areas of the theme (header, footer, navigation links, homepage sections like hero banners, featured product carousels, promotional blocks) will be populated by data from the Admin CMS. This allows admins to update content without code changes.
    -   **Structure & Components:**
        -   **Header:**
            -   Logo (from Admin Settings).
            -   Navigation Menu (managed in Admin CMS > Navigation).
            -   Search Bar (prominent).
            -   Link to PC Builder.
            -   Shopping Cart icon with item count.
            -   User account/login (deferred, not in initial scope).
        -   **Footer:**
            -   Navigation Links (e.g., About Us, Contact Us, Privacy Policy - managed in Admin CMS > Navigation).
            -   Contact Information (from Admin Settings).
            -   Social Media Links (if any, configurable in Admin Settings).
            -   Copyright notice (dynamic year).
        -   **Homepage (`/`):
            -   Composed of several predefined sections, content for which is managed in Admin CMS > Theme Content.
            -   Examples:
                -   Hero Banner (image, headline, CTA).
                -   Featured Products Carousel (selected products from CMS).
                -   Category Spotlights (links to key product categories with images/icons).
                -   Promotional Blocks (special offers, announcements).
                -   Brand Showcase (logos of key brands carried).
        -   **Navigation:**
            -   Primary navigation in the header, managed via Admin CMS.
            -   Should support dropdowns for categories/subcategories if defined in CMS.
            -   Breadcrumbs on sub-pages (e.g., Home > CPUs > Intel Core i5).
    -   **Technology & Styling:**
        -   Frontend framework (e.g., Next.js, Vue.js with Nuxt.js, or a modern PHP template engine if using Laravel/Symfony).
        -   CSS framework (e.g., Tailwind CSS for utility-first, or a component-based library like Bootstrap, customized heavily) or custom SASS/CSS.
        -   Ensure accessibility (WCAG AA compliance where feasible).
    -   **API Interaction (Data Fetching):**
        -   Public API endpoints to fetch theme content, navigation structure, product data for listings, etc. These are read-only for the public site.
        -   Example: `GET /api/public/theme-settings` (fetches logo, contact info, active theme content sections).
        -   Example: `GET /api/public/navigation/:menuHandle` (fetches items for 'main-menu', 'footer-menu').
        -   Example: `GET /api/public/homepage-sections` (fetches data for hero, featured products etc. as defined in CMS).
    -   **Documentation:**
        -   Document the overall layout structure (e.g., grid system, main containers).
        -   Detail how each part of the layout (header, footer, homepage sections) fetches and displays CMS-managed content.
        -   Specify key CSS classes or styling conventions.
        -   Outline responsive breakpoints and behavior.
        -   Document API endpoints used for fetching layout-related content.
2.  **Product Display & Browsing**
    -   **Objective:** Allow users to easily find, view, and understand products, including their specifications and compatibility, through intuitive listing and detail pages.
    -   **Product Listing Pages (PLP):**
        -   **Routes:**
            -   All Products: `/products`
            -   Category Pages: `/category/:categorySlug` (e.g., `/category/motherboards`)
            -   Brand Pages: `/brand/:brandSlug` (e.g., `/brand/asus`)
            -   Search Results Page: `/search?q=query`
        -   **UI/UX:**
            -   Grid or list view toggle (user preference stored in localStorage).
            -   Product Card: Image, Title, Price, (Optional: Short Description, Brand, Add to Cart button, Quick View button).
            -   **Filtering:** Sidebar or top bar with filters for: Price Range, Brand, Category (if on a general page), Specifications (e.g., CPU Socket, RAM Type, GPU Chipset - dynamic based on category), Stock Status.
            -   **Sorting:** Dropdown for sorting by: Price (Low to High, High to Low), Popularity (by sales/views - if tracked), Newest Arrivals, Name (A-Z, Z-A).
            -   **Pagination:** Numbered pagination or "Load More" button for large product sets.
            -   Display number of products found and current page.
            -   Breadcrumbs for navigation.
    -   **Product Detail Pages (PDP):**
        -   **Route:** `/product/:productSlug` (e.g., `/product/intel-core-i5-13600k`)
        -   **UI/UX:**
            -   **Main Product Information:**
                -   Product Title.
                -   Image Gallery: Multiple images with zoom/lightbox functionality.
                -   Price, Compare at Price (if applicable), Stock Status (In Stock, Out of Stock, Pre-order).
                -   Quantity Selector.
                -   "Add to Cart" button.
                -   (Optional: "Add to Wishlist" - deferred).
            -   **Detailed Information Tabs/Sections:**
                -   `Description`: Full product description (from CMS, supports rich text).
                -   `Specifications`: Key-value pairs of product specs (e.g., Clock Speed, Cores, Socket, Chipset, Capacity - from CMS `Product.specifications` and `Product.componentType` specific fields).
                -   `Compatibility Information`: If the product is a PC component, display relevant compatibility data. This is crucial.
                    -   Example for a CPU: Lists compatible motherboard sockets/chipsets, supported RAM types.
                    -   Example for a Motherboard: Lists compatible CPU sockets, RAM types, form factor, M.2 slots, etc.
                    -   This information is derived from the `Product.compatibility` field set in the Admin CMS.
                -   `Reviews`: (Deferred - not in initial scope, but plan for space if added later).
            -   **Related Products Section:**
                -   Carousel or grid of products often bought together or similar products (e.g., other CPUs if viewing a CPU, or components compatible with the current one).
                -   Logic for related products can be based on category, brand, or manual linking in CMS (if implemented).
            -   Breadcrumbs.
    -   **Category & Brand Pages:**
        -   Display category/brand name, description, and image/logo (from CMS).
        -   List products belonging to that category/brand, using the same PLP layout (filters, sorting, pagination).
        -   SEO-friendly URLs and content (meta title, description from CMS).
    -   **API Interaction (Data Fetching):**
        -   `GET /api/public/products?category=...&brand=...&sortBy=...&page=...&filter_spec_socket=LGA1700...`: Fetch products for PLPs with filtering, sorting, pagination.
        -   `GET /api/public/products/slug/:productSlug`: Fetch details for a single product for PDP.
        -   `GET /api/public/categories/:categorySlug`: Fetch category details and its products.
        -   `GET /api/public/brands/:brandSlug`: Fetch brand details and its products.
        -   `GET /api/public/filters?category=...`: Fetch available filter options (e.g., brands, spec values) for a given category to populate filter UI dynamically.
    -   **Documentation:**
        -   Document the structure of PLPs and PDPs.
        -   Explain how filtering, sorting, and pagination work, including relevant API query parameters.
        -   Detail how product specifications and compatibility information are displayed on PDPs, and how they link back to CMS data.
        -   Specify API endpoints for fetching product, category, and brand data.
3.  **Custom PC Builder**
    -   **Objective:** Provide an intuitive, step-by-step interface for users to build a custom PC, ensuring component compatibility at each stage based on data managed in the Admin CMS.
    -   **Route:** `/pc-builder`
    -   **Workflow & UI/UX (Inspired by iBUYPOWER, PC Studio, pcbuilder.net):**
        -   **Step 1: Select Motherboard (Mandatory First Step)**
            -   User is presented with a list of available motherboards (product cards: image, name, key specs like socket, form factor, price).
            -   Filters for motherboard: Form Factor, Socket, Chipset, Brand, Price Range.
            -   User selects one motherboard to start the build. This choice dictates initial compatibility constraints.
        -   **Step 2: Select Power Supply (PSU) (Mandatory Second Step, filtered by Motherboard)**
            -   After selecting a motherboard, the user is shown a list of PSUs.
            -   PSUs are filtered based on compatibility with the selected motherboard (e.g., form factor match, sufficient wattage for typical builds with that board - though precise wattage calculation is complex and might be simplified to general compatibility initially).
            -   User selects one PSU.
        -   **Step 3 onwards: Select Other Components (CPU, RAM, GPU, Storage, Case, Cooler, etc.)**
            -   The builder interface will have clearly defined slots/sections for each component type (e.g., "CPU", "RAM (Memory)", "Video Card (GPU)", "Storage (SSD/HDD)", "PC Case", "CPU Cooler", "Operating System" (optional), "Accessories" (optional)).
            -   For each component slot, clicking "Select" or "Change" will show a list of available products of that type.
            -   **Dynamic Compatibility Filtering:** Crucially, the list of products shown for each component slot is dynamically filtered based on *all previously selected components*. This uses the compatibility rules defined in the Admin CMS (`Product.compatibility` and `Product.componentType`).
                -   Example: If an Intel LGA1700 socket motherboard is selected, only LGA1700 CPUs are shown.
                -   Example: If DDR5 RAM is selected, only motherboards supporting DDR5 are compatible (and vice-versa if motherboard selected first).
                -   Example: PC Case selection must be compatible with Motherboard form factor (e.g., ATX case for ATX motherboard).
                -   Example: CPU Cooler must be compatible with CPU socket and fit in the selected PC Case (height clearance).
                -   Example: PSU wattage should be sufficient for the sum of selected components (this can be a running estimate or a more general compatibility check).
            -   User selects one component per slot. They can change selections, and compatibility will be re-evaluated.
        -   **Live Build Summary & Validation:**
            -   A persistent sidebar or section displays the current list of selected components with their prices.
            -   Running subtotal of the build.
            -   **Compatibility Validation & Warnings:**
                -   If a user tries to select an incompatible part (though ideally, incompatible parts are filtered out), or if a combination becomes invalid, clear warnings are shown.
                -   Examples: "This CPU is not compatible with the selected motherboard socket.", "Selected RAM is not compatible with the motherboard.", "The chosen CPU cooler may not fit in the selected case.", "Warning: Selected PSU wattage might be insufficient for high-end GPU."
                -   The system should prevent adding fundamentally incompatible parts where possible by not showing them.
        -   **Completion & Actions:**
            -   Once all desired components are selected (or mandatory ones at least):
                -   "Add Build to Cart" button: Adds all selected components as individual items to the main shopping cart.
                -   "Generate WhatsApp Order": Prepares a formatted WhatsApp message listing all components and total price (similar to standard cart checkout).
                -   (Optional: "Save Build" for registered users - deferred).
                -   (Optional: "Share Build" link - deferred).
    -   **Compatibility Logic Engine:**
        -   The core of the builder. Resides on the backend, accessed via API.
        -   Takes the current set of selected product IDs as input.
        -   For a given component slot to be filled, it queries the database for products of that `componentType`.
        -   It then filters this list against the `compatibility` rules of *all already selected components*.
        -   Example `Product.compatibility` structure (from Admin CMS):
            -   Motherboard: `compatibleCpuSocket: ['LGA1700']`, `compatibleRamType: 'DDR5'`, `formFactor: 'ATX'`, `compatibleCaseFormFactors: ['ATX', 'E-ATX']`.
            -   CPU: `socket: 'LGA1700'`, `requiresCoolerSocket: ['LGA1700']`.
            -   RAM: `type: 'DDR5'`.
            -   Case: `supportedMotherboardFormFactors: ['ATX', 'Micro-ATX']`, `maxCpuCoolerHeight: 160` (mm).
            -   PSU: `wattage: 750`.
        -   The engine needs to handle various types of compatibility checks: direct ID matches, attribute matching (socket, form factor), range checks (wattage, cooler height), list intersections.
    -   **API Interaction:**
        -   `GET /api/public/pc-builder/components?type=motherboard&filters=...`: Get initial list of motherboards.
        -   `GET /api/public/pc-builder/compatible-components?type=cpu&currentBuild=[mb_id, psu_id,...]`: Get compatible CPUs based on current build state.
        -   `POST /api/public/pc-builder/validate-build`: Sends a list of component IDs, returns compatibility status, warnings, and total price.
    -   **Data Models (primarily uses existing `Product` model):**
        -   Relies heavily on `Product.componentType` and `Product.compatibility` fields.
        -   No new primary data models, but the logic for interpreting compatibility is key.
    -   **Documentation:**
        -   Document the entire PC builder workflow step-by-step from the user's perspective.
        -   Detail the compatibility logic: how rules are defined in CMS, how they are applied, and examples of checks (socket, form factor, RAM type, PSU wattage estimation, case clearance).
        -   Explain the UI for selecting components, displaying the summary, and showing warnings.
        -   Specify API endpoints used by the builder for fetching components and validating compatibility.
        -   Provide examples of how compatibility data in `Product.compatibility` is structured and used.
4.  **Shopping Cart**
    -   **Objective:** Allow users to collect products they intend to purchase, review their selection, and proceed to checkout via WhatsApp. The cart should be persistent on the user's device.
    -   **Key Features:**
        -   **Client-Side Persistence:** Utilize browser `localStorage` to store cart contents, allowing the cart to persist across browser sessions and page reloads for the same user on the same device.
        -   **Add to Cart:** Buttons on Product Listing Pages (PLPs) and Product Detail Pages (PDPs) to add items to the cart. For configurable products (e.g., from PC Builder), ensure all selected components are added.
        -   **View Cart:** A dedicated cart page (`/cart`) and potentially a mini-cart dropdown/sidebar accessible from the header.
        -   **Update Quantity:** Allow users to change the quantity of items in the cart.
        -   **Remove Item:** Allow users to remove individual items from the cart.
        -   **Clear Cart:** Option to empty the entire cart.
        -   **Price Summary:** Display subtotal for each item, and a running total for the entire cart.
        -   **No User Account Required:** Cart functionality is independent of user accounts.
    -   **UI/UX:**
        -   **Cart Page (`/cart`):**
            -   List of all items in the cart.
            -   For each item:
                -   Product Image.
                -   Product Title (linked to PDP).
                -   Selected specifications (e.g., RAM size, color, if applicable).
                -   For PC Builder items, a summary of key components or a link to view the full build configuration.
                -   Unit Price.
                -   Quantity selector (input field or +/- buttons).
                -   Line item subtotal.
                -   "Remove" button/icon.
            -   Order Summary section:
                -   Total number of items.
                -   Overall total price.
                -   "Proceed to WhatsApp Checkout" button.
                -   "Continue Shopping" link.
                -   "Clear Cart" button.
        -   **Mini-Cart (Header Dropdown/Sidebar):**
            -   Quick overview of cart items (image, title, quantity, price).
            -   Subtotal.
            -   Link to full cart page.
            -   Quick checkout button (optional, leads to cart page or directly to WhatsApp).
        -   **Visual Feedback:**
            -   Confirmation message when an item is added to the cart (e.g., toast notification).
            -   Cart icon in the header updates with the number of unique items or total quantity.
    -   **Data Structure (localStorage):**
        -   A JSON array of cart items. Each item could have a structure like:
            ```json
            {
              "productId": "uuid-product-123", // or slug
              "productType": "single_component", // or "custom_build"
              "title": "Intel Core i5-13600K",
              "image": "/path/to/image.jpg",
              "price": 299.99,
              "quantity": 1,
              "variantInfo": null, // For future use if products have variants
              "buildDetails": null // For custom_build type, array of component details
            }
            ```
        -   For `custom_build` items, `buildDetails` would be an array of selected component objects.
    -   **Functionality:**
        -   **Add:** Check if item (and specific variant/configuration) already exists. If yes, increment quantity. If no, add new item.
        -   **Update:** Change quantity for a specific item. If quantity becomes zero, consider removing the item or prompting user.
        -   **Remove:** Delete item from the array.
        -   **Clear:** Empty the array.
        -   All operations update `localStorage` and re-render relevant UI components.
    -   **API Interaction:**
        -   Primarily client-side logic.
        -   May need to fetch latest product prices/stock status if cart items are old, before proceeding to checkout, to inform the user of any changes. `GET /api/public/products/batch?ids=[id1,id2,...]` to get current details for items in cart.
    -   **Documentation:**
        -   Document the `localStorage` data structure for the cart.
        -   Explain the logic for adding, updating, removing, and clearing cart items.
        -   Detail the UI components of the cart page and mini-cart.
        -   Outline any API calls made (e.g., for price/stock validation before checkout).
        -   Describe how custom PC builds are represented and handled in the cart.
5.  **WhatsApp Integration**
    -   **Objective:** Facilitate a seamless order placement process by redirecting users to WhatsApp with a pre-filled message containing their cart details. Capture order information in the admin panel for tracking.
    -   **Key Features:**
        -   **Pre-filled Message:** Automatically generate a detailed WhatsApp message with product names, quantities, prices, and the total amount from the user's cart.
        -   **Deep Linking:** Use WhatsApp's click-to-chat feature (`wa.me`) to open a conversation with the business's predefined WhatsApp number, with the pre-filled message.
        -   **Order Persistence (Admin Side):** Once the user is redirected to WhatsApp, the system should create a corresponding order record in the database with a status like "Pending WhatsApp Confirmation". This allows admins to track potential orders even before the user sends the message.
        -   **Clear Call to Action:** The "Proceed to WhatsApp Checkout" button on the cart page should clearly indicate the next step.
        -   **Business WhatsApp Number Configuration:** The target WhatsApp number should be configurable in the Admin CMS (e.g., under Admin Settings).
    -   **UI/UX Flow:**
        1.  User reviews items in their cart (`/cart`).
        2.  User clicks "Proceed to WhatsApp Checkout".
        3.  **Confirmation Step (Optional but Recommended):**
            -   A modal or intermediate page could appear:
                -   "You will be redirected to WhatsApp to finalize your order with [Business Name]."
                -   "Your order summary: [Brief summary of items and total]."
                -   "Click 'Confirm & Open WhatsApp' to continue."
            -   This step helps manage user expectations and allows the system to reliably create the pending order *before* redirecting.
        4.  Upon confirmation (or directly if no intermediate step), the browser attempts to open the WhatsApp deep link.
        5.  User is taken to WhatsApp (desktop or mobile app) with the message pre-filled, ready to send to the business number.
        6.  User manually sends the message in WhatsApp.
        7.  Admin receives the WhatsApp message and then manually updates the corresponding order's status in the Admin CMS (e.g., from "Pending WhatsApp Confirmation" to "Processing" or "Awaiting Payment").
    -   **Message Formatting:**
        -   The pre-filled message should be clear, concise, and easy for the business to parse.
        -   **Example Format (configurable/refinable):**
            ```
            PCWV2 Order Request:
            --------------------
            Items:
            - Product A (SKU: 123) x 1 - Rs. 5,000.00
            - Product B (SKU: 456) x 2 - Rs. 10,000.00 (Rs. 5,000.00 each)
            - Custom PC Build (Ref: XYZ):
              - CPU: Intel i7
              - GPU: RTX 4070
              - RAM: 16GB DDR5
              (Total for build: Rs. 150,000.00)
            --------------------
            Total Items: 3
            Grand Total: Rs. 165,000.00
            --------------------
            Please confirm availability and payment details.
            Cart ID (for reference): cart-uuid-timestamp
            ```
        -   Including a unique Cart ID or a temporary Order ID in the message can help admins match the WhatsApp message to the pending order in the CMS.
    -   **Technical Implementation:**
        -   **Frontend:**
            -   JavaScript to gather cart details.
            -   Construct the WhatsApp message string, URL-encoding it properly.
            -   Generate the `https://wa.me/[PhoneNumber]?text=[URLEncodedMessage]` link.
            -   Before redirecting, make an API call to the backend to create the pending order.
        -   **Backend:**
            -   API endpoint to receive cart data and create a pending order.
            -   Store the business's WhatsApp number (fetched from Admin Settings).
    -   **API Interaction:**
        -   `POST /api/public/orders/initiate-whatsapp-checkout`: 
            -   **Request Body:** Cart data (array of product IDs, quantities, prices, build details if any).
            -   **Response Body:** `{ "success": true, "pendingOrderId": "order-uuid-123", "whatsappUrl": "https://wa.me/..." }` or an error message.
            -   This endpoint creates an `Order` record in the database with a status like 'Pending WhatsApp Confirmation' and returns the WhatsApp URL for redirection.
        -   `GET /api/public/settings/contact`: (Could be part of a general public settings endpoint) To fetch the business WhatsApp number for the frontend if not hardcoded during build.
    -   **Data Models:**
        -   Uses the existing `Order` model (detailed in Phase B). The key is setting an initial appropriate `orderStatus` (e.g., 'Pending WhatsApp Confirmation') and `paymentStatus` (e.g., 'Pending').
        -   The `Order` model should store `customerWhatsapp` (which might be initially empty or a placeholder if not collected before redirect, relying on the admin to fill it from the actual WhatsApp chat).
    -   **Documentation:**
        -   Document the end-to-end WhatsApp checkout flow from the user's perspective.
        -   Detail the pre-filled message format and how it's generated.
        -   Explain the process of creating a pending order in the admin system upon initiating WhatsApp checkout.
        -   Specify the API endpoint for initiating the checkout and creating the pending order.
        -   Outline how admins are expected to handle incoming WhatsApp orders and update statuses in the CMS.
        -   Mention the configuration point for the business WhatsApp number.
6.  **Search & Filter**
    -   **Objective:** Enable users to quickly and effectively find products across the catalog using keyword search, and refine product listings using various filters including compatibility, price, brand, and specifications.
    -   **Key Features:**
        -   **Global Search Bar:** Prominently placed in the header, allowing users to search from any page.
        -   **Dedicated Search Results Page (`/search?q=query`):** Displays results for products, and potentially categories or brands if relevant.
        -   **Full-Text Search:** Search should cover product titles, descriptions, SKUs, tags, and potentially key specifications.
        -   **Filter Persistence:** Selected filters on PLPs or search results should ideally persist if the user navigates away and returns (e.g., using URL query parameters).
        -   **Dynamic Filter Options:** Filter options (e.g., specific brands, spec values) should be dynamically generated based on the current product set or category being viewed.
        -   **Compatibility Filtering Integration:** Search results and PLP filters should incorporate compatibility aspects, especially when a user is searching within a specific component category (e.g., filtering CPUs by socket).
    -   **UI/UX:**
        -   **Search Bar (Header):**
            -   Input field with a clear placeholder (e.g., "Search products, brands, components...").
            -   As-you-type suggestions (autocomplete) showing top product matches, popular searches, or category suggestions (Advanced, could be deferred if too complex initially).
            -   Submitting the search redirects to the search results page (`/search`).
        -   **Search Results Page (`/search`):
            -   Displays the search query (e.g., "Results for 'gaming motherboard'").
            -   Number of results found.
            -   Uses the same Product Listing Page (PLP) layout for displaying product cards.
            -   **Filtering Sidebar/Top Bar:** Identical to PLP filters, allowing users to refine search results by:
                -   Category (if search spans multiple categories).
                -   Brand.
                -   Price Range.
                -   Specifications (dynamic based on the most relevant category in results, or common specs).
                -   Stock Status.
            -   **Sorting Options:** Identical to PLP sorting (Price, Popularity, Newest, Name).
            -   Pagination.
            -   "No results found" message with suggestions (e.g., check spelling, try different keywords, browse categories).
        -   **Filtering on PLPs (Category/Brand pages):**
            -   Filters are context-aware (e.g., on a CPU category page, filters will include CPU socket, core count, etc.).
            -   Applying filters updates the product list dynamically (ideally without a full page reload if using a JS framework).
            -   Selected filters are clearly indicated and can be easily removed individually or all at once.
    -   **Search Logic & Technology:**
        -   **Database Search:** Utilize the database's full-text search capabilities (e.g., MongoDB Atlas Search, PostgreSQL full-text search, MySQL full-text search). Requires indexing relevant fields.
        -   **Backend Query Construction:** The backend API will need to construct complex database queries based on search terms and selected filter parameters.
        -   **Ranking/Relevance:** Basic relevance can be based on database scores. More advanced ranking might consider sales, views, or manual boosting (deferred).
    -   **API Interaction:**
        -   `GET /api/public/search?q=query&category=...&brand=...&price_min=...&price_max=...&spec_socket=LGA1700&sortBy=...&page=...`:
            -   Powers both the dedicated search results page and filtered PLPs.
            -   `q`: The search query string.
            -   Other parameters are for filtering, sorting, and pagination, similar to `GET /api/public/products`.
        -   `GET /api/public/search/suggestions?q=query`:
            -   For autocomplete functionality. Returns a small list of top matching product names or relevant terms.
            -   (Advanced/Optional for initial scope).
        -   `GET /api/public/filters?category=...&q=...` (or extend existing `/api/public/filters`):
            -   Fetches available filter options (e.g., list of brands, spec values, price ranges) dynamically based on the current product set defined by a category or search query.
    -   **Data Models:**
        -   Relies on the `Product`, `Category`, and `Brand` models.
        -   Ensuring relevant fields in these models are indexed for efficient searching is critical (e.g., `title`, `description`, `sku`, `tags`, `specifications` in `Product`; `name` in `Category` and `Brand`).
    -   **Documentation:**
        -   Document the search functionality, including which fields are searched.
        -   Explain how filters are applied and how they interact with search queries.
        -   Detail the UI for the search bar, search results page, and filter components.
        -   Specify API endpoints for search, suggestions, and dynamic filter options.
        -   Outline database indexing strategy for search performance.
        -   Describe how sorting and pagination work on search results.
7.  **Analytics & Ads Integration**
    -   **Objective:** Implement comprehensive analytics and ad tracking using Google Tag Manager (GTM) and Meta Pixel to monitor site traffic, user behavior, and advertising campaign performance.
    -   **Key Features:**
        -   **Google Tag Manager (GTM) Setup:** GTM will serve as the central hub for managing all tracking tags (Google Analytics, Meta Pixel, etc.). This simplifies tag management and reduces the need for direct code changes for future tracking additions.
        -   **Meta Pixel Setup:** Integrate Meta Pixel for tracking conversions, optimizing ads, and building targeted audiences for Facebook and Instagram advertising campaigns.
        -   **Event Tracking:** Track key user interactions beyond page views, such as:
            -   Product views (PDP).
            -   Category views (PLP).
            -   Add to Cart actions (standard products and PC Builder).
            -   Initiate WhatsApp Checkout (conversion event).
            -   PC Builder interactions (e.g., component selections, reaching summary step).
            -   Site search usage.
        -   **E-commerce Tracking (via GTM Data Layer):** For relevant events (especially Add to Cart, Initiate Checkout), push e-commerce data to the GTM data layer. This includes product ID, name, price, quantity, currency, etc. This data can then be picked up by Google Analytics and Meta Pixel for enhanced e-commerce reporting.
        -   **Configuration:** GTM Container ID and Meta Pixel ID should be configurable via Admin CMS settings.
    -   **Implementation Details:**
        -   **GTM Container Snippet:** Add the GTM container snippet (JavaScript code provided by Google) to the `<head>` and `<body>` of all public-facing pages. This should be loaded asynchronously.
        -   **Meta Pixel Base Code:** Deploy the Meta Pixel base code via GTM. This ensures it loads on all pages.
        -   **Data Layer Implementation:**
            -   On page load for PDPs, push product detail data to `dataLayer`.
            -   On PLP/category page loads, push category information.
            -   When a user performs a key action (e.g., clicks "Add to Cart"), push an event to `dataLayer` along with relevant event parameters and e-commerce data.
            -   Example `dataLayer.push` for Add to Cart:
                ```javascript
                dataLayer.push({
                  'event': 'addToCart',
                  'ecommerce': {
                    'currencyCode': 'PKR', // Or your site's currency
                    'add': { 
                      'products': [{
                        'name': 'Product Name',
                        'id': 'SKU123',
                        'price': '150.00',
                        'brand': 'Brand Name',
                        'category': 'Category Name',
                        'variant': 'Variant Info',
                        'quantity': 1
                       }]
                    }
                  }
                });
                ```
        -   **GTM Configuration:**
            -   Set up Tags in GTM for Google Analytics (e.g., GA4 Configuration Tag) and Meta Pixel (Base Code Tag).
            -   Create Triggers in GTM that fire based on custom events pushed to the `dataLayer` (e.g., a trigger for `event: 'addToCart'`).
            -   Create Variables in GTM to capture data from the `dataLayer` (e.g., product details, transaction totals).
            -   Configure Event Tags (e.g., GA4 Event Tag, Meta Pixel Event Tag) to send specific event data to Google Analytics and Meta Pixel, using the defined triggers and variables.
                -   Meta Pixel Standard Events: `ViewContent` (for PDPs), `AddToCart`, `InitiateCheckout`, `Search`.
    -   **API Interaction:**
        -   `GET /api/public/settings/integrations` (or similar): To fetch GTM Container ID and Meta Pixel ID from admin settings to inject into the page templates if not hardcoded during build or managed by a CMS plugin.
    -   **Testing & Validation:**
        -   Use GTM's Preview mode to test tag firing and data layer pushes.
        -   Use Google Analytics Realtime reports to verify events.
        -   Use the Meta Pixel Helper browser extension to debug Pixel events.
    -   **Documentation:**
        -   Document the GTM and Meta Pixel setup process.
        -   List all custom events being tracked and the data layer structure for each.
        -   Explain how to configure GTM Container ID and Meta Pixel ID in the Admin CMS.
        -   Provide guidance on testing and validating the tracking implementation.
        -   Detail the specific Meta Pixel standard events being used and for which actions.

8.  **Cookie Consent Management**
    -   **Objective:** Implement a clear and compliant cookie consent mechanism to inform users about cookie usage (especially for analytics and advertising) and allow them to manage their preferences.
    -   **Key Features:**
        -   **Consent Banner/Modal:** Display a prominent banner or modal on the user's first visit, informing them about cookie usage.
        -   **Granular Consent (Optional but Recommended):** Allow users to accept all cookies, reject non-essential cookies, or customize preferences for different categories of cookies (e.g., Necessary, Analytics, Advertising).
            -   For PCWV2 initial scope, a simpler "Accept All / Reject Non-Essential" or just "Accept" (with clear info in Privacy Policy) might be sufficient, depending on local regulations and desired user experience. Default to a simpler approach if not strictly required otherwise.
        -   **Cookie Policy Link:** Provide a clear link to the website's Cookie Policy / Privacy Policy page for detailed information.
        -   **Persistence of Choice:** User's consent choice should be stored (e.g., in `localStorage` or a persistent cookie) to avoid showing the banner on every page load or subsequent visits.
        -   **Conditional Tag Firing:** Analytics and advertising tags (managed via GTM) should only fire *after* the user has given appropriate consent for those categories of cookies.
    -   **UI/UX:**
        -   **Initial Banner/Modal:**
            -   Typically appears at the bottom or top of the screen, or as a centered modal.
            -   Clear message: e.g., "This website uses cookies to enhance user experience, analyze site traffic, and personalize content/ads. By clicking 'Accept', you consent to our use of cookies. Read our [Cookie Policy](link) for more information."
            -   Buttons: "Accept" (or "Accept All"), "Decline" (or "Reject Non-Essential"), and optionally "Customize Preferences".
        -   **Preference Center (if granular consent is implemented):**
            -   Accessible via the initial banner or a persistent link (e.g., in the footer "Cookie Settings").
            -   Toggles or checkboxes for different cookie categories (e.g., Analytics Cookies, Marketing Cookies).
            -   "Save Preferences" button.
    -   **Technical Implementation:**
        -   **Consent Management Script:** Use a lightweight open-source JavaScript library for cookie consent (e.g., CookieConsent.js, Osano Cookie Consent, Klaro!) or build a custom solution.
        -   **GTM Integration:** Crucially, configure GTM to respect consent choices.
            -   GTM has built-in consent mode features. When a user makes a choice, update GTM's consent state (e.g., `analytics_storage: 'granted'` or `'denied'`, `ad_storage: 'granted'` or `'denied'`).
            -   Tags in GTM (like Google Analytics, Meta Pixel) can then be configured to respect these consent states, firing only when the necessary consent is granted.
        -   **Storage of Consent:** Store the user's consent status (e.g., `{'analytics_allowed': true, 'ads_allowed': false}`) in `localStorage` or a first-party cookie.
        -   **Default State:** Determine the default behavior before consent is given (e.g., are all tags blocked, or do essential ones fire?). This depends on privacy regulations (e.g., GDPR requires explicit opt-in).
    -   **Documentation:**
        -   Document the chosen cookie consent solution and its configuration.
        -   Explain how user consent is obtained, stored, and respected by tracking tags.
        -   Detail how to update the Cookie Policy link and banner text if needed (potentially via CMS for some parts).
        -   Outline the GTM consent mode setup and how it interacts with the consent management script.
        -   Specify the default consent state and behavior for different regions if applicable.
