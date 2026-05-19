-- =============================================================================
-- Roofing Webapp — Reference Data Seed
-- Run this in the Supabase Studio SQL editor on a fresh project.
--
-- To re-seed a non-empty project, uncomment the TRUNCATE block below first:
-- TRUNCATE TABLE invoice_status, quote_status, quote_request_status,
--               customer_type, service RESTART IDENTITY CASCADE;
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. Invoice Statuses
-- -----------------------------------------------------------------------------
INSERT INTO invoice_status (name, description) VALUES
  ('Draft',   'The user wants to create a invoice but it is not full ready to be sent to the customer because certain information is yet to be obtained.'),
  ('Overdue', 'The customer has not paid and its past due.'),
  ('Paid',    'The customer has made complete payment for our service.'),
  ('Pending', 'The invoice has been sent to the customer and waiting for payments still owe on an invoice.');


-- -----------------------------------------------------------------------------
-- 2. Quote Statuses
-- -----------------------------------------------------------------------------
INSERT INTO quote_status (name, description) VALUES
  ('Accepted', 'The customer gave us a response back accepting the quote we sent to them. When accepted we take initiate the process of invoiced by grabbing the first down payment to begin job for big projects.'),
  ('Draft',    'Quote that is being made but finally details have not been obtained and will be created later.'),
  ('Pending',  'The quote has been sent to the customer and we are awaiting for their approval.'),
  ('Rejected', 'The customer responded back and did not accept the quote we sent to him.');


-- -----------------------------------------------------------------------------
-- 3. Quote Request Statuses
-- -----------------------------------------------------------------------------
INSERT INTO quote_request_status (name, description) VALUES
  ('Closed',  'Customer never responded after trying to reach them for the quote request they made.'),
  ('New',     'A new request submitted by the customer and has to be processed by the employee to move forward.'),
  ('Pending', 'The roofing company has contacted the requester and is waiting for response.'),
  ('Planned', 'Employee has contacted the customer and confirmed availability to analyze home to form and estimate.');


-- -----------------------------------------------------------------------------
-- 4. Customer Types
-- -----------------------------------------------------------------------------
INSERT INTO customer_type (name, description) VALUES
  ('Residential',        'These are homeowners who require roofing services for their houses, apartments, or condominiums. Residential customers often need roof repairs, replacements, or installations.'),
  ('Commercial',         'Commercial customers include businesses, organizations, and property management companies that need roofing services for their office buildings, retail stores, warehouses, factories, or other commercial properties.'),
  ('Industrial',         'Industrial customers typically operate in sectors such as manufacturing, logistics, or heavy industries. They may require roofing services for their industrial facilities, factories, or plants.'),
  ('Institutional',      'This category includes customers like schools, colleges, universities, hospitals, government buildings, and religious institutions. They often require roofing services for their large institutional structures.'),
  ('Property Developer', 'Roofing companies often collaborate with property developers and general contractors who are constructing new buildings or undertaking renovation projects. They provide roofing services as part of the overall construction process.'),
  ('Property Management','These companies specialize in managing multiple properties on behalf of the owners. Roofing companies may work with property management firms to provide maintenance, repairs, or replacements for the properties they manage.'),
  ('Insurance',          'Roofing companies may collaborate with insurance providers when customers need roof repairs or replacements covered by their insurance policies. They assess the damage, provide estimates, and carry out the necessary work.'),
  ('Real Estate',        'Roofing companies can work with real estate agents and home inspectors to assess the condition of roofs during property transactions. They may provide inspection reports or carry out necessary repairs before a sale.'),
  ('HOA',                'HOAs govern residential communities or neighborhoods with shared properties. Roofing companies may be hired by the HOA to handle roof repairs, maintenance, or replacements for the entire community.');


-- -----------------------------------------------------------------------------
-- 5. Services
-- -----------------------------------------------------------------------------
INSERT INTO service (name, description, default_price) VALUES
  (
    'Roof Installation',
    'Roof Installation includes: - 30 year rated roofing shingles - Synthetic Roofing Underlayment - Ridge vents & ridge caps - New 2x2 dripedge installation - All New base lead jacks. - New valley (if applicable) - Up to 3 sheets of new plywood ($85 per extra sheet) - Labor to install new shingles (6 nail for secure hold against storms) - Cleaning Debri',
    '$300 - $320 per sqft depending on roof pitch'
  ),
  (
    'Roof Repair',
    'Service includes: - Repairing a leak in the roof/walls or reparing damaged roof',
    '$500 per repair'
  ),
  (
    'Roof Maintenance',
    'A regular maintenance to find/fix small issues in the roof that can cause problems in the future. Service Includes: - Roof Inspection - Report of all issues found and resolved',
    '$500 per maintaince'
  ),
  (
    'Siding Replacement',
    'Service that will tear down and install new siding for a structure.',
    NULL
  ),
  (
    'Carpentry',
    'This a service to construct, repair, and install building frameworks and structures made from wood and other materials, work indoors and outdoors from installing kitchen cabinets to building highways and bridges.',
    NULL
  ),
  (
    'Roof Extention',
    'This service includes the labor & materials for extending the roof and installing shingles.',
    NULL
  ),
  (
    'New Gutter Installation',
    'This service includes the installation of gutter.',
    NULL
  ),
  (
    'Porch Renovation',
    'Service to renovate porch for better protection.',
    NULL
  ),
  (
    'Soffit & Fascia',
    'To install or repair soffit or fascia from your home.',
    NULL
  ),
  (
    'Porch Waterproofing',
    'Application of high-quality waterproof sealant to porch surfaces to prevent water infiltration, protect against moisture damage, and extend the lifespan of the structure. Includes surface preparation, cleaning, and sealing to ensure durable, weather-resistant protection.',
    NULL
  ),
  (
    'Roof Vent Installation',
    'Install or replace roof vents to improve attic airflow, prevent moisture buildup, and extend roof life. This can include both labor and materials or just labor.',
    '$300'
  ),
  (
    'Torch-Down Installation',
    'Professional installation of a durable, heat-applied modified bitumen (torch-down) roofing system. This service includes surface preparation, installation of base and cap sheets, proper flashing around penetrations, and thorough quality checks. Ideal for low-slope or flat roofing areas requiring strong waterproofing and long-term protection.',
    NULL
  ),
  (
    'Roof Flashing Installation',
    'Roof flashing is installed around vulnerable areas of your roof and porch—such as chimneys, vents, skylights, roof transitions, and edges—to prevent water from penetrating the structure. Properly installed flashing directs water away from seams and joints, reducing the risk of leaks, rot, and interior damage. Our flashing installation ensures a durable, watertight seal that protects your roof and porch while extending their lifespan.',
    NULL
  ),
  (
    'New Fence',
    'This service includes installation with labor and materials of fencing.',
    '$150.00'
  );
