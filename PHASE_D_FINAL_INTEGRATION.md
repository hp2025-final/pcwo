### 🚀 PHASE D: Final Integration & Deployment (Complete Last)

1.  **Integration Testing**
    *   **Objective**: Ensure all components of the Admin CMS and Public Website work together seamlessly and meet all functional requirements.
    *   **Sub-Tasks**:
        *   **1.1. End-to-End Admin Workflow Testing**:
            *   Verify admin login and authentication.
            *   Test creation, updating, and deletion of products, categories, brands.
            *   Validate product data scraper functionality (if implemented and stable).
            *   Test order management flow (manual order creation, status updates).
            *   Verify CMS content updates (menus, pages, theme settings) reflect on the public site.
            *   Test PC builder component management and compatibility rule application.
            *   Confirm admin settings (e.g., WhatsApp number, GTM ID) are correctly applied.
        *   **1.2. End-to-End Public Website Workflow Testing**:
            *   Test user navigation, product browsing, and filtering/sorting.
            *   Validate product page display, including all details and images.
            *   Thoroughly test the Custom PC Builder:
                *   Component selection based on compatibility rules.
                *   Real-time price updates.
                *   Adding configured PC to cart.
            *   Test shopping cart functionality (add, remove, update quantity).
            *   Verify WhatsApp checkout process (message generation with cart details).
            *   Test search functionality for products and content.
            *   Confirm analytics (GTM) and ads (Meta Pixel) are firing correctly on relevant pages/events.
            *   Test cookie consent mechanism and script blocking.
        *   **1.3. PC Builder Compatibility Logic Validation**:
            *   Create diverse test cases for PC builder compatibility rules (e.g., CPU-motherboard socket, RAM-motherboard type, PSU wattage, GPU-case clearance).
            *   Verify that only compatible components are shown/selectable.
            *   Test edge cases and invalid configurations.
        *   **1.4. CMS-Driven Content & Settings Validation**:
            *   Update various content elements via CMS (e.g., homepage banners, promotional text, contact info).
            *   Verify changes are immediately and correctly reflected on the public website.
            *   Test theme settings (if any beyond basic content) controlled by CMS.
        *   **1.5. Cross-Browser and Cross-Device Testing**:
            *   Test key public website pages and functionalities on major browsers (Chrome, Firefox, Safari, Edge).
            *   Verify responsive design on various screen sizes (desktop, tablet, mobile).
    *   **UI/UX Considerations**:
        *   Focus on the user experience during transitions between different parts of the site (e.g., adding a custom PC to cart and proceeding to checkout).
        *   Ensure error messages are clear and helpful during testing.
    *   **API Endpoints Involved**:
        *   Primarily involves testing existing APIs from Phase B and C by simulating full user flows. No new APIs specific to this sub-task.
    *   **Data Models Involved**:
        *   All existing data models (`Product`, `Category`, `Brand`, `Order`, `User`, `CustomPCBuild`, `CMSContent`, etc.) will be involved in data consistency checks.
    *   **Documentation Points**:
        *   Create a comprehensive Integration Test Plan document.
        *   Document all test cases with steps, expected results, and actual results.
        *   Log all identified bugs/issues with detailed reproduction steps.
        *   Prepare a Test Summary Report upon completion.
2.  **SEO Implementation**
    *   **Objective**: Optimize the public website for search engines to improve organic visibility and ranking.
    *   **Sub-Tasks**:
        *   **2.1. Schema.org Structured Data Implementation**:
            *   Implement `Product` schema for all product pages (name, description, image, offers, brand, SKU, etc.).
            *   Implement `BreadcrumbList` schema for navigation paths.
            *   Implement `WebSite` schema for site-wide information (name, URL, search box).
            *   Implement `Organization` schema for business details.
            *   Consider `CollectionPage` for category/listing pages.
            *   Validate structured data using Google's Rich Results Test.
        *   **2.2. Meta Tags, Open Graph, and Twitter Card Implementation**:
            *   Dynamically generate unique and descriptive `<title>` tags for all pages.
            *   Dynamically generate unique and relevant `<meta name="description">` for all pages.
            *   Implement Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`) for social sharing.
            *   Implement Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`) for Twitter sharing.
            *   Ensure images used for `og:image` and `twitter:image` are appropriately sized and accessible.
        *   **2.3. XML Sitemap & robots.txt Generation**:
            *   Generate a dynamic XML sitemap (`sitemap.xml`) including all public URLs (product pages, category pages, static pages).
            *   Ensure the sitemap is updated automatically when new content is added or removed.
            *   Create a `robots.txt` file to guide search engine crawlers, disallowing access to admin areas, cart, checkout, and other non-public or sensitive paths.
            *   Include the path to `sitemap.xml` in `robots.txt`.
        *   **2.4. URL Structure & Canonicalization**:
            *   Ensure all public URLs are SEO-friendly (readable, use hyphens, include keywords where appropriate).
            *   Implement `rel="canonical"` tags on all pages to prevent duplicate content issues, especially for pages with parameters (filters, sorting) or multiple access paths.
            *   Ensure consistent use of trailing slashes or no trailing slashes in URLs.
        *   **2.5. Internal Linking Strategy Review**:
            *   Ensure logical internal linking structure, with important pages receiving more internal links.
            *   Use descriptive anchor text for internal links.
        *   **2.6. Page Load Speed Considerations (Overlap with Performance Optimization)**:
            *   Ensure fast loading times as it's a key SEO factor. (Detailed in Performance Optimization section).
    *   **UI/UX Considerations**:
        *   While primarily technical, ensure that SEO implementations (like breadcrumbs) also enhance user navigation.
    *   **API Endpoints Involved**:
        *   No new APIs. Data for dynamic meta tags and sitemaps will be fetched using existing product/category/CMS content APIs.
    *   **Data Models Involved**:
        *   `Product`, `Category`, `CMSPage` data models will be used to generate SEO-relevant content.
    *   **Documentation Points**:
        *   Document the types of Schema.org markup implemented and where.
        *   Detail the logic for dynamic generation of meta tags.
        *   Provide the structure and update mechanism for `sitemap.xml`.
        *   Explain the rules in `robots.txt`.
        *   Document canonicalization strategy.
3.  **Performance Optimization**
    *   **Objective**: Ensure the website loads quickly and performs efficiently to provide a good user experience and improve SEO.
    *   **Sub-Tasks**:
        *   **3.1. Next.js SSR/SSG Strategy Implementation & Verification**:
            *   Verify that public pages (product listings, product details, static content pages) are using Server-Side Rendering (SSR) or Static Site Generation (SSG) appropriately.
            *   Use `getServerSideProps` for dynamic content that needs to be fresh on every request (e.g., potentially product stock/price if highly volatile, though usually SSG with revalidation is better).
            *   Use `getStaticProps` with `revalidate` for content that can be pre-rendered and updated periodically (e.g., product pages, category pages).
            *   Use `getStaticPaths` for dynamic routes that should be pre-rendered at build time or on demand.
        *   **3.2. Image Optimization**:
            *   Utilize Next.js built-in `next/image` component for automatic image optimization (resizing, format conversion like WebP, lazy loading).
            *   Ensure appropriate `width`, `height`, and `layout` props are used for `next/image`.
            *   Compress images uploaded via CMS before storing, if not handled by `next/image` on the fly for all cases.
        *   **3.3. Caching Strategies**:
            *   **Client-Side Caching**: Leverage browser caching for static assets (CSS, JS, fonts, images) using appropriate cache headers (e.g., `Cache-Control`).
            *   **CDN Caching**: If using a CDN (e.g., Vercel, Cloudflare), configure caching rules for static assets and potentially for SSG pages.
            *   **API Response Caching**: Implement caching for frequently accessed, non-user-specific API endpoints (e.g., product listings, categories). This can be done at the API level (e.g., using Redis or in-memory cache) or via HTTP cache headers.
            *   **Database Query Caching**: Optimize and cache common database queries.
        *   **3.4. Code Splitting & Minification**:
            *   Verify Next.js automatic code splitting is working effectively, loading only necessary JavaScript for each page.
            *   Ensure JavaScript, CSS, and HTML are minified for production builds.
        *   **3.5. Lazy Loading (Beyond Images)**:
            *   Lazy load non-critical components or sections of a page that are below the fold (e.g., using `next/dynamic` for components).
        *   **3.6. Font Optimization**:
            *   Use `next/font` for optimized web font loading, minimizing layout shift.
            *   Host fonts locally if possible, or use preconnect hints for third-party font providers.
        *   **3.7. Third-Party Script Optimization**:
            *   Load third-party scripts (analytics, ads, chat widgets) asynchronously or deferred to avoid blocking page rendering.
            *   Evaluate the performance impact of each third-party script.
        *   **3.8. Performance Monitoring & Profiling**:
            *   Use tools like Lighthouse, WebPageTest, and Next.js Analytics (if deployed on Vercel) to identify performance bottlenecks.
            *   Profile client-side and server-side code as needed.
    *   **UI/UX Considerations**:
        *   Perceived performance is key. Use loading indicators and skeleton screens where appropriate to improve user experience during data fetching or page transitions.
    *   **API Endpoints Involved**:
        *   Focus on optimizing existing API endpoints for speed and efficiency. May involve adding cache headers or server-side caching mechanisms.
    *   **Data Models Involved**:
        *   No new data models. Optimization might involve adding indexes to existing database tables based on query patterns.
    *   **Documentation Points**:
        *   Document the chosen SSR/SSG strategy for different page types.
        *   Detail image optimization techniques used.
        *   Describe caching mechanisms implemented at various levels (client, CDN, API, database).
        *   List any specific performance tuning applied (e.g., lazy loading strategies, third-party script handling).
        *   Record baseline performance metrics (Lighthouse scores, load times) and post-optimization improvements.
4.  **Security**
    *   **Objective**: Implement robust security measures to protect user data, prevent unauthorized access, and ensure the integrity of the application.
    *   **Sub-Tasks**:
        *   **4.1. Input Validation (Zod)**:
            *   Ensure Zod (or a similar validation library) is consistently used for all incoming data on API routes (body, query parameters, route parameters).
            *   Validate data on the client-side as well for better UX, but always rely on server-side validation as the source of truth.
            *   Define strict schemas for all expected data structures.
        *   **4.2. API Rate Limiting**:
            *   Implement rate limiting on all API routes, especially authentication and sensitive operations, to prevent abuse and DoS attacks.
            *   Consider IP-based and/or user-based rate limiting.
            *   Choose an appropriate library or service for rate limiting (e.g., `express-rate-limit` if using Express.js with Next.js custom server, or Vercel/platform-level features).
        *   **4.3. Security Headers Implementation**:
            *   Set appropriate HTTP security headers:
                *   `Content-Security-Policy (CSP)`: Define allowed sources for scripts, styles, images, etc., to mitigate XSS attacks. Start with a strict policy and gradually open it as needed.
                *   `X-Frame-Options`: Set to `DENY` or `SAMEORIGIN` to prevent clickjacking.
                *   `X-Content-Type-Options`: Set to `nosniff` to prevent MIME-sniffing attacks.
                *   `Strict-Transport-Security (HSTS)`: Enforce HTTPS usage after the first secure visit.
                *   `Referrer-Policy`: Control how much referrer information is sent.
                *   `Permissions-Policy` (formerly Feature-Policy): Control access to browser features.
        *   **4.4. Authentication & Authorization Review**:
            *   Thoroughly review admin authentication (NextAuth.js) and authorization mechanisms.
            *   Ensure strong password policies and secure session management.
            *   Verify that API routes are properly protected and only accessible by authenticated and authorized users (e.g., admin roles for admin APIs).
        *   **4.5. Cross-Site Scripting (XSS) Prevention**:
            *   Ensure all user-generated content displayed on the site is properly sanitized or escaped (Next.js/React do this by default for JSX content, but be careful with `dangerouslySetInnerHTML` or when injecting data into non-React contexts).
            *   CSP (see 4.3) is a key defense here.
        *   **4.6. Cross-Site Request Forgery (CSRF) Prevention**:
            *   NextAuth.js typically provides CSRF protection for its routes. Verify this is active.
            *   For any custom API routes performing state-changing operations that are session-based, ensure CSRF tokens are used if not handled by NextAuth.js.
        *   **4.7. Dependency Security Auditing**:
            *   Regularly audit project dependencies for known vulnerabilities (e.g., using `npm audit` or GitHub Dependabot).
            *   Update vulnerable dependencies promptly.
        *   **4.8. Secure File Uploads (if applicable)**:
            *   If the CMS allows file uploads (e.g., product images), ensure they are handled securely:
                *   Validate file types and sizes.
                *   Scan for malware.
                *   Store uploaded files in a non-web-accessible location or use a dedicated asset storage service.
                *   Use non-guessable filenames.
        *   **4.9. Data Encryption**:
            *   Ensure sensitive data (e.g., API keys, database credentials) is encrypted at rest (e.g., using environment variables, secrets management services) and in transit (HTTPS).
    *   **UI/UX Considerations**:
        *   Security measures should be as transparent as possible to the user, but error messages for security-related issues (e.g., invalid input) should be generic and not reveal internal system details.
    *   **API Endpoints Involved**:
        *   All API endpoints need to be secured. Focus on authentication endpoints, data modification endpoints, and any endpoints handling sensitive information.
    *   **Data Models Involved**:
        *   `User` model (for authentication/authorization). Other models are involved in terms of data validation.
    *   **Documentation Points**:
        *   Document all security measures implemented, including input validation strategy, rate limiting setup, and security headers configured.
        *   Detail authentication and authorization mechanisms.
        *   Record procedures for handling security incidents and updating dependencies.
        *   List tools used for security auditing.
5.  **Testing & QA (Beyond Integration Testing)**
    *   **Objective**: Ensure the overall quality, stability, and correctness of the application through comprehensive testing methodologies before deployment.
    *   **Sub-Tasks**:
        *   **5.1. Unit Testing**: (Primarily done during development phases, but finalized here)
            *   Ensure sufficient unit test coverage for critical functions, components, and utilities (e.g., PC builder compatibility logic, API handlers, helper functions).
            *   Use a testing framework like Jest with React Testing Library for frontend components and Node.js testing utilities for backend logic.
            *   Review and augment existing unit tests based on integration findings.
        *   **5.2. Component Testing (for UI components)**:
            *   Test UI components in isolation to verify their appearance and behavior with different props and states.
            *   Use tools like Storybook for developing and testing UI components interactively.
        *   **5.3. End-to-End (E2E) Testing**:
            *   Develop E2E test scripts for key user flows using a framework like Cypress or Playwright.
            *   Cover flows such as: user registration/login (if applicable beyond admin), product search and navigation, adding items to cart, custom PC building, and WhatsApp checkout initiation.
            *   Run E2E tests in a staging or production-like environment.
        *   **5.4. Manual Quality Assurance (QA)**:
            *   Develop a comprehensive QA checklist covering all features and user stories.
            *   Perform exploratory testing to find edge cases and unexpected behavior.
            *   Test on various devices and browsers (as defined in Integration Testing, but with a QA focus).
            *   Verify UI consistency, usability, and accessibility (basic checks if full audit not in scope).
        *   **5.5. Accessibility Testing (Basic)**:
            *   Perform basic accessibility checks (e.g., keyboard navigation, color contrast, ARIA attributes where necessary).
            *   Use browser extensions or tools like Axe for automated checks.
            *   (Full WCAG compliance audit might be a separate, larger effort if required).
        *   **5.6. Usability Testing**:
            *   If possible, conduct informal usability testing with a few target users to gather feedback on ease of use and overall experience.
        *   **5.7. Test Data Management**:
            *   Prepare and manage test data sets for different testing scenarios (e.g., empty states, large data volumes, specific configurations for PC builder).
    *   **UI/UX Considerations**:
        *   QA process should validate that the UI/UX matches the design specifications and provides a positive user experience.
        *   Accessibility and usability are key quality attributes.
    *   **API Endpoints Involved**:
        *   E2E tests will interact with all public and potentially some admin APIs through the UI.
    *   **Data Models Involved**:
        *   All data models are implicitly involved as testing covers data creation, retrieval, update, and deletion through application workflows.
    *   **Documentation Points**:
        *   Document the overall testing strategy (unit, integration, E2E, manual QA).
        *   Maintain a test case repository or document for manual QA and E2E tests.
        *   Report on test coverage (e.g., unit test coverage percentage).
        *   Log all bugs found during QA with severity, priority, and steps to reproduce.
        *   Create a QA Sign-off report before deployment.
6.  **Documentation & Deployment**
    *   **Objective**: Prepare comprehensive documentation for users and developers, and successfully deploy the application to a production environment.
    *   **Sub-Tasks**:
        *   **6.1. User Documentation (for Admin CMS)**:
            *   Create user guides for all Admin CMS features:
                *   Logging in and managing admin accounts.
                *   Product management (adding, editing, deleting products, managing inventory, using the scraper).
                *   Category and brand management.
                *   Order management (viewing orders, updating statuses).
                *   CMS content management (editing pages, menus, theme settings).
                *   Managing PC builder components and compatibility rules.
                *   Configuring site settings (WhatsApp number, GTM ID, etc.).
            *   Include screenshots and step-by-step instructions.
            *   Provide troubleshooting tips for common issues.
        *   **6.2. Developer Documentation**:
            *   **Project Setup**: Instructions for setting up the development environment, installing dependencies, and running the project locally.
            *   **Architecture Overview**: High-level description of the project structure (frontend, backend, database, key libraries/frameworks).
            *   **API Documentation**: Detailed documentation for all API endpoints (using Swagger/OpenAPI or similar tools if feasible, or markdown docs). Include request/response formats, authentication requirements, and example usage.
            *   **Data Models**: Description of database schemas and data relationships.
            *   **Key Features Implementation Details**: Notes on complex or critical parts of the system (e.g., PC builder logic, custom NextAuth.js configurations, integration points).
            *   **Deployment Process**: Step-by-step guide for deploying the application.
            *   **Coding Standards & Conventions**: Any project-specific coding guidelines.
        *   **6.3. Deployment Environment Preparation**:
            *   Choose a hosting provider/platform (e.g., Vercel for Next.js frontend, a separate Node.js hosting for backend if not serverless, database provider like PlanetScale/Supabase/AWS RDS).
            *   Set up production, staging (if used), and development environments.
            *   Configure environment variables for production (database credentials, API keys, NextAuth.js secret, GTM ID, Meta Pixel ID, etc.).
            *   Set up DNS records.
            *   Configure SSL/TLS certificate for HTTPS.
        *   **6.4. Deployment Scripts & CI/CD Pipeline (Optional but Recommended)**:
            *   Create build scripts for frontend and backend.
            *   Develop deployment scripts (e.g., shell scripts, serverless configuration files).
            *   Consider setting up a CI/CD pipeline (e.g., using GitHub Actions, Vercel integrations) for automated testing and deployment.
        *   **6.5. Pre-Deployment Checklist & Final Checks**:
            *   Ensure all tests (unit, integration, E2E) are passing.
            *   Confirm all QA sign-offs are complete.
            *   Backup database (if migrating existing data or as a precaution).
            *   Verify all environment variables are correctly set for production.
            *   Perform a final security review.
        *   **6.6. Production Deployment**:
            *   Execute deployment scripts/CI/CD pipeline to deploy the application to the production environment.
            *   Migrate database schema and any necessary seed data.
        *   **6.7. Post-Deployment Verification & Monitoring**:
            *   Thoroughly test all critical functionalities on the live production site.
            *   Monitor server logs and application performance for any immediate issues.
            *   Check analytics (GTM, Meta Pixel) are working correctly in production.
            *   Set up uptime monitoring and error tracking services (e.g., Sentry, New Relic).
        *   **6.8. Post-Launch Checklist Documentation**:
            *   Create a checklist of tasks to perform immediately after launch (e.g., submit sitemap to search consoles, announce launch, gather initial feedback).
    *   **UI/UX Considerations**:
        *   User documentation should be clear, concise, and easy to navigate for non-technical admin users.
        *   Developer documentation should be well-organized and enable new developers to quickly understand and contribute to the project.
    *   **API Endpoints Involved**:
        *   No new APIs. Deployment involves making existing APIs live.
    *   **Data Models Involved**:
        *   All data models are part of the deployed system. Database migration scripts might be needed.
    *   **Documentation Points**:
        *   The primary output of this section is the documentation itself (User Manual, Developer Guide).
        *   Document the chosen hosting solution and deployment architecture.
        *   Keep a record of deployment configurations and environment variables (securely stored).
        *   Maintain a deployment log for each release.
