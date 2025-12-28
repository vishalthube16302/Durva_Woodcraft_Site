/*
  # Insert Sample Categories

  1. Delete existing categories and reset sequence
  2. Insert 15 furniture categories with descriptions
  3. Set appropriate display order

  Categories:
  - Coffee Table
  - Chair
  - Stool
  - Sam Maloof Furniture
  - Antique Furniture
  - Rocking Chair
  - Lace Stool
  - Intarsia Patterns
  - Wooden Planter Stand
  - Sofa
  - Dining Table
  - Wooden Ceiling
  - Wooden Lamps
  - Wood Signs
  - Driftwood Craft
*/

DELETE FROM products;
DELETE FROM categories;

INSERT INTO categories (name, description, display_order) VALUES
  ('Coffee Table', 'Handcrafted wooden coffee tables with elegant designs', 1),
  ('Chair', 'Premium wooden chairs for dining and living spaces', 2),
  ('Stool', 'Comfortable and stylish wooden stools for various uses', 3),
  ('Sam Maloof Furniture', 'Contemporary designs inspired by master craftsman Sam Maloof', 4),
  ('Antique Furniture', 'Vintage wooden furniture pieces with traditional craftsmanship', 5),
  ('Rocking Chair', 'Classic rocking chairs with smooth motion and comfort', 6),
  ('Lace Stool', 'Decorative stools with intricate lace patterns', 7),
  ('Intarsia Patterns', 'Furniture featuring beautiful intarsia wood inlay designs', 8),
  ('Wooden Planter Stand', 'Elegant stands for displaying indoor and outdoor plants', 9),
  ('Sofa', 'Spacious and comfortable wooden sofas for living areas', 10),
  ('Dining Table', 'Large wooden dining tables for family gatherings', 11),
  ('Wooden Ceiling', 'Custom wooden ceiling panels and decorative elements', 12),
  ('Wooden Lamps', 'Ambient lighting solutions with wooden bases and designs', 13),
  ('Wood Signs', 'Custom engraved wood signs and wall décor', 14),
  ('Driftwood Craft', 'Unique pieces crafted from beautiful driftwood materials', 15);
