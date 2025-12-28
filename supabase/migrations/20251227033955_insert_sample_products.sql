/*
  # Insert Sample Products

  1. Insert 40+ sample products across 15 categories
  2. Include pricing, descriptions, images, features, and specifications
  3. Set some products as featured
  4. Include display order for sorting
*/

-- Coffee Table
INSERT INTO products (name, description, category_id, price, images, features, specifications, is_featured, is_active, display_order) VALUES
  (
    'Modern Minimalist Coffee Table',
    'A sleek contemporary coffee table with clean lines and minimalist design. Perfect for modern living spaces.',
    (SELECT id FROM categories WHERE name = 'Coffee Table'),
    45000,
    '["https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg", "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg"]'::jsonb,
    '["Handcrafted teak wood", "Smooth surface finish", "Sturdy construction", "Easy to maintain"]'::jsonb,
    '{"Material":"Teak Wood","Dimensions":"120cm x 60cm x 45cm","Weight":"35kg","Finish":"Natural Polish"}'::jsonb,
    true,
    true,
    1
  ),
  (
    'Heritage Carved Coffee Table',
    'Traditional coffee table featuring hand-carved details and ornamental designs inspired by classical furniture.',
    (SELECT id FROM categories WHERE name = 'Coffee Table'),
    62000,
    '["https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg", "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg"]'::jsonb,
    '["Traditional carving", "Premium rosewood", "Decorative elements", "Timeless design"]'::jsonb,
    '{"Material":"Rosewood","Dimensions":"130cm x 70cm x 50cm","Weight":"42kg","Finish":"Dark Stain"}'::jsonb,
    false,
    true,
    2
  ),
  (
    'Glass Top Coffee Table',
    'Contemporary design with a sturdy wooden base and elegant glass top for a modern aesthetic.',
    (SELECT id FROM categories WHERE name = 'Coffee Table'),
    55000,
    '["https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg"]'::jsonb,
    '["Glass and wood combination", "Easy to clean", "Modern style", "Perfect centerpiece"]'::jsonb,
    '{"Material":"Sheesham Wood & Glass","Dimensions":"100cm x 50cm x 40cm","Weight":"25kg","Finish":"Walnut"}'::jsonb,
    false,
    true,
    3
  );

-- Chair
INSERT INTO products (name, description, category_id, price, images, features, specifications, is_featured, is_active, display_order) VALUES
  (
    'Elegant Dining Chair',
    'Classic wooden dining chair with ergonomic design and comfortable seating. Perfect for dining tables.',
    (SELECT id FROM categories WHERE name = 'Chair'),
    18000,
    '["https://images.pexels.com/photos/6480705/pexels-photo-6480705.jpeg"]'::jsonb,
    '["Ergonomic design", "Solid wood construction", "Comfortable backrest", "Durable finish"]'::jsonb,
    '{"Material":"Teak Wood","Dimensions":"45cm W x 50cm D x 85cm H","Weight":"8kg","Finish":"Natural Stain"}'::jsonb,
    true,
    true,
    1
  ),
  (
    'Carved Wooden Chair',
    'Ornamental dining chair with intricate hand-carved details and traditional craftsmanship.',
    (SELECT id FROM categories WHERE name = 'Chair'),
    22000,
    '["https://images.pexels.com/photos/5974071/pexels-photo-5974071.jpeg"]'::jsonb,
    '["Hand-carved details", "Premium wood", "Traditional design", "Stackable option"]'::jsonb,
    '{"Material":"Rosewood","Dimensions":"48cm W x 52cm D x 90cm H","Weight":"9kg","Finish":"Polished"}'::jsonb,
    false,
    true,
    2
  );

-- Stool
INSERT INTO products (name, description, category_id, price, images, features, specifications, is_featured, is_active, display_order) VALUES
  (
    'Low Wooden Stool',
    'Simple and versatile wooden stool suitable for kitchen, bathroom, or general use.',
    (SELECT id FROM categories WHERE name = 'Stool'),
    8000,
    '["https://images.pexels.com/photos/4207707/pexels-photo-4207707.jpeg"]'::jsonb,
    '["Lightweight design", "Solid construction", "Easy to move", "Compact size"]'::jsonb,
    '{"Material":"Teak Wood","Dimensions":"30cm W x 30cm D x 45cm H","Weight":"4kg","Finish":"Natural Polish"}'::jsonb,
    false,
    true,
    1
  ),
  (
    'Bar Height Stool',
    'Tall wooden stool perfect for bar counters and high dining tables with comfortable footrest.',
    (SELECT id FROM categories WHERE name = 'Stool'),
    12000,
    '["https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg"]'::jsonb,
    '["Adjustable footrest", "Counter height", "Sturdy design", "Ergonomic seat"]'::jsonb,
    '{"Material":"Sheesham Wood","Dimensions":"38cm W x 38cm D x 70cm H","Weight":"6kg","Finish":"Walnut Stain"}'::jsonb,
    true,
    true,
    2
  ),
  (
    'Decorative Carved Stool',
    'Artistic stool with traditional carved patterns, serving as both functional seating and décor.',
    (SELECT id FROM categories WHERE name = 'Stool'),
    15000,
    '["https://images.pexels.com/photos/6129067/pexels-photo-6129067.jpeg"]'::jsonb,
    '["Artistic design", "Carved details", "Premium finish", "Statement piece"]'::jsonb,
    '{"Material":"Rosewood","Dimensions":"35cm W x 35cm D x 50cm H","Weight":"7kg","Finish":"Dark Polish"}'::jsonb,
    false,
    true,
    3
  );

-- Sam Maloof Furniture
INSERT INTO products (name, description, category_id, price, images, features, specifications, is_featured, is_active, display_order) VALUES
  (
    'Maloof-Inspired Lounge Chair',
    'Contemporary curved design inspired by master craftsman Sam Maloof, featuring smooth flowing lines.',
    (SELECT id FROM categories WHERE name = 'Sam Maloof Furniture'),
    95000,
    '["https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg"]'::jsonb,
    '["Curved design", "Contemporary style", "Premium craftsmanship", "Comfortable seating"]'::jsonb,
    '{"Material":"Walnut Wood","Dimensions":"75cm W x 85cm D x 90cm H","Weight":"22kg","Finish":"Oil Finish"}'::jsonb,
    true,
    true,
    1
  ),
  (
    'Modern Rocking Chair',
    'Contemporary rocking chair with smooth curves and modern aesthetic in the Maloof style.',
    (SELECT id FROM categories WHERE name = 'Sam Maloof Furniture'),
    85000,
    '["https://images.pexels.com/photos/6129070/pexels-photo-6129070.jpeg"]'::jsonb,
    '["Smooth rocking motion", "Curved arms", "Comfortable backrest", "Modern lines"]'::jsonb,
    '{"Material":"Cherry Wood","Dimensions":"70cm W x 80cm D x 100cm H","Weight":"20kg","Finish":"Natural Oil"}'::jsonb,
    false,
    true,
    2
  );

-- Antique Furniture
INSERT INTO products (name, description, category_id, price, images, features, specifications, is_featured, is_active, display_order) VALUES
  (
    'Victorian Side Table',
    'Authentic vintage side table with ornate legs and classical details from the Victorian era.',
    (SELECT id FROM categories WHERE name = 'Antique Furniture'),
    48000,
    '["https://images.pexels.com/photos/6480714/pexels-photo-6480714.jpeg"]'::jsonb,
    '["Victorian design", "Ornate legs", "Vintage appeal", "Solid construction"]'::jsonb,
    '{"Material":"Mahogany","Dimensions":"60cm W x 45cm D x 75cm H","Weight":"18kg","Finish":"Aged Patina"}'::jsonb,
    false,
    true,
    1
  ),
  (
    'Colonial Era Cabinet',
    'Beautiful antique cabinet with traditional paneling and brass hardware from the colonial period.',
    (SELECT id FROM categories WHERE name = 'Antique Furniture'),
    72000,
    '["https://images.pexels.com/photos/6129082/pexels-photo-6129082.jpeg"]'::jsonb,
    '["Colonial style", "Brass hardware", "Storage space", "Historical design"]'::jsonb,
    '{"Material":"Teak Wood","Dimensions":"90cm W x 50cm D x 150cm H","Weight":"45kg","Finish":"Traditional Stain"}'::jsonb,
    true,
    true,
    2
  );

-- Rocking Chair
INSERT INTO products (name, description, category_id, price, images, features, specifications, is_featured, is_active, display_order) VALUES
  (
    'Classic Wooden Rocker',
    'Traditional rocking chair with smooth curved rockers and comfortable seating for relaxation.',
    (SELECT id FROM categories WHERE name = 'Rocking Chair'),
    38000,
    '["https://images.pexels.com/photos/1957474/pexels-photo-1957474.jpeg"]'::jsonb,
    '["Smooth rocking motion", "Curved rockers", "Comfortable seat", "Timeless design"]'::jsonb,
    '{"Material":"Teak Wood","Dimensions":"65cm W x 75cm D x 95cm H","Weight":"16kg","Finish":"Natural Polish"}'::jsonb,
    true,
    true,
    1
  ),
  (
    'Upholstered Rocking Chair',
    'Elegant rocking chair with cushioned seat and backrest for added comfort and luxury.',
    (SELECT id FROM categories WHERE name = 'Rocking Chair'),
    52000,
    '["https://images.pexels.com/photos/6480711/pexels-photo-6480711.jpeg"]'::jsonb,
    '["Upholstered seat", "Padded backrest", "Smooth motion", "Elegant design"]'::jsonb,
    '{"Material":"Rosewood Frame","Dimensions":"70cm W x 80cm D x 100cm H","Weight":"20kg","Finish":"Polished with Upholstery"}'::jsonb,
    false,
    true,
    2
  ),
  (
    'Carved Heritage Rocker',
    'Traditional rocking chair with intricate hand-carved details and heritage craftsmanship.',
    (SELECT id FROM categories WHERE name = 'Rocking Chair'),
    58000,
    '["https://images.pexels.com/photos/5974062/pexels-photo-5974062.jpeg"]'::jsonb,
    '["Hand-carved details", "Heritage style", "Smooth rockers", "Premium wood"]'::jsonb,
    '{"Material":"Sheesham Wood","Dimensions":"68cm W x 78cm D x 98cm H","Weight":"19kg","Finish":"Dark Stain"}'::jsonb,
    false,
    true,
    3
  );

-- Lace Stool
INSERT INTO products (name, description, category_id, price, images, features, specifications, is_featured, is_active, display_order) VALUES
  (
    'Delicate Lace Pattern Stool',
    'Ornamental stool featuring intricate lace-like patterns carved into the wooden surface.',
    (SELECT id FROM categories WHERE name = 'Lace Stool'),
    18000,
    '["https://images.pexels.com/photos/6129076/pexels-photo-6129076.jpeg"]'::jsonb,
    '["Intricate lace patterns", "Detailed carving", "Decorative art", "Statement piece"]'::jsonb,
    '{"Material":"Rosewood","Dimensions":"40cm W x 40cm D x 55cm H","Weight":"8kg","Finish":"Polished"}'::jsonb,
    true,
    true,
    1
  ),
  (
    'Fine Lace Work Footstool',
    'Beautiful footstool with elaborate lace patterns throughout, combining function with artistry.',
    (SELECT id FROM categories WHERE name = 'Lace Stool'),
    22000,
    '["https://images.pexels.com/photos/6129080/pexels-photo-6129080.jpeg"]'::jsonb,
    '["Fine lacework", "Artistic design", "Comfortable height", "Decorative appeal"]'::jsonb,
    '{"Material":"Teak Wood","Dimensions":"45cm W x 35cm D x 42cm H","Weight":"9kg","Finish":"Natural Polish"}'::jsonb,
    false,
    true,
    2
  );

-- Intarsia Patterns
INSERT INTO products (name, description, category_id, price, images, features, specifications, is_featured, is_active, display_order) VALUES
  (
    'Intarsia Inlay Coffee Table',
    'Stunning coffee table featuring intricate intarsia wood inlay designs with multiple wood types.',
    (SELECT id FROM categories WHERE name = 'Intarsia Patterns'),
    75000,
    '["https://images.pexels.com/photos/6480708/pexels-photo-6480708.jpeg"]'::jsonb,
    '["Intarsia wood inlay", "Multiple wood types", "Artistic design", "Museum quality"]'::jsonb,
    '{"Material":"Mixed Woods","Dimensions":"125cm W x 65cm D x 48cm H","Weight":"40kg","Finish":"Protective Lacquer"}'::jsonb,
    true,
    true,
    1
  ),
  (
    'Geometric Intarsia Side Table',
    'Contemporary side table with geometric intarsia patterns creating a modern artistic statement.',
    (SELECT id FROM categories WHERE name = 'Intarsia Patterns'),
    55000,
    '["https://images.pexels.com/photos/5974075/pexels-photo-5974075.jpeg"]'::jsonb,
    '["Geometric patterns", "Wood inlay art", "Modern design", "Unique artwork"]'::jsonb,
    '{"Material":"Walnut & Maple","Dimensions":"60cm W x 60cm D x 55cm H","Weight":"22kg","Finish":"Satin Lacquer"}'::jsonb,
    false,
    true,
    2
  );

-- Wooden Planter Stand
INSERT INTO products (name, description, category_id, price, images, features, specifications, is_featured, is_active, display_order) VALUES
  (
    'Two-Tier Planter Stand',
    'Elegant wooden stand with two levels for displaying multiple potted plants indoors or outdoors.',
    (SELECT id FROM categories WHERE name = 'Wooden Planter Stand'),
    12000,
    '["https://images.pexels.com/photos/6480716/pexels-photo-6480716.jpeg"]'::jsonb,
    '["Two-tier design", "Spacious shelves", "Weather resistant", "Garden ready"]'::jsonb,
    '{"Material":"Teak Wood","Dimensions":"80cm W x 40cm D x 100cm H","Weight":"14kg","Finish":"Weather Treated"}'::jsonb,
    true,
    true,
    1
  ),
  (
    'Tall Decorative Planter Stand',
    'Tall wooden planter stand with intricate details, perfect for showcasing favorite indoor plants.',
    (SELECT id FROM categories WHERE name = 'Wooden Planter Stand'),
    16000,
    '["https://images.pexels.com/photos/6129089/pexels-photo-6129089.jpeg"]'::jsonb,
    '["Tall design", "Decorative details", "Sturdy base", "Indoor/outdoor use"]'::jsonb,
    '{"Material":"Rosewood","Dimensions":"60cm W x 50cm D x 120cm H","Weight":"18kg","Finish":"Natural Polish"}'::jsonb,
    false,
    true,
    2
  );

-- Sofa
INSERT INTO products (name, description, category_id, price, images, features, specifications, is_featured, is_active, display_order) VALUES
  (
    'Wooden Frame Sofa',
    'Spacious wooden-frame sofa with generous seating and traditional craftsmanship. Customizable upholstery.',
    (SELECT id FROM categories WHERE name = 'Sofa'),
    125000,
    '["https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg"]'::jsonb,
    '["Solid wooden frame", "Multiple seating", "Customizable", "Premium comfort"]'::jsonb,
    '{"Material":"Sheesham Wood","Dimensions":"200cm W x 90cm D x 85cm H","Weight":"55kg","Finish":"Natural Polish"}'::jsonb,
    true,
    true,
    1
  ),
  (
    'Modern Minimalist Sofa',
    'Contemporary sofa with clean lines, minimalist design, and comfortable seating for contemporary homes.',
    (SELECT id FROM categories WHERE name = 'Sofa'),
    115000,
    '["https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg"]'::jsonb,
    '["Minimalist design", "Solid construction", "Easy maintenance", "Modern aesthetic"]'::jsonb,
    '{"Material":"Teak Wood","Dimensions":"210cm W x 85cm D x 80cm H","Weight":"52kg","Finish":"Walnut Stain"}'::jsonb,
    false,
    true,
    2
  );

-- Dining Table
INSERT INTO products (name, description, category_id, price, images, features, specifications, is_featured, is_active, display_order) VALUES
  (
    'Family Dining Table',
    'Large wooden dining table perfect for family gatherings with seating for 8-10 people.',
    (SELECT id FROM categories WHERE name = 'Dining Table'),
    145000,
    '["https://images.pexels.com/photos/6480720/pexels-photo-6480720.jpeg"]'::jsonb,
    '["Large seating capacity", "Solid wood construction", "Durable finish", "Perfect for gatherings"]'::jsonb,
    '{"Material":"Rosewood","Dimensions":"240cm W x 100cm D x 75cm H","Weight":"70kg","Finish":"Dark Polish"}'::jsonb,
    true,
    true,
    1
  ),
  (
    'Extendable Dining Table',
    'Practical dining table with extension capability, adapting to different seating needs.',
    (SELECT id FROM categories WHERE name = 'Dining Table'),
    155000,
    '["https://images.pexels.com/photos/1350786/pexels-photo-1350786.jpeg"]'::jsonb,
    '["Extendable top", "Spacious design", "Easy mechanism", "Versatile seating"]'::jsonb,
    '{"Material":"Teak Wood","Dimensions":"200-280cm W x 100cm D x 75cm H","Weight":"75kg","Finish":"Natural Polish"}'::jsonb,
    false,
    true,
    2
  ),
  (
    'Carved Heritage Dining Table',
    'Traditional dining table with ornate carved details and classical design for elegant dining spaces.',
    (SELECT id FROM categories WHERE name = 'Dining Table'),
    165000,
    '["https://images.pexels.com/photos/6129093/pexels-photo-6129093.jpeg"]'::jsonb,
    '["Hand-carved details", "Traditional design", "Premium wood", "Statement piece"]'::jsonb,
    '{"Material":"Mahogany","Dimensions":"220cm W x 110cm D x 78cm H","Weight":"80kg","Finish":"Polished"}'::jsonb,
    false,
    true,
    3
  );

-- Wooden Ceiling
INSERT INTO products (name, description, category_id, price, images, features, specifications, is_featured, is_active, display_order) VALUES
  (
    'Coffered Ceiling Panels',
    'Beautiful wooden ceiling panels creating a coffered ceiling effect for sophisticated interiors.',
    (SELECT id FROM categories WHERE name = 'Wooden Ceiling'),
    35000,
    '["https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg"]'::jsonb,
    '["Coffered design", "Easy installation", "Sound dampening", "Elegant appearance"]'::jsonb,
    '{"Material":"Teak Wood Panels","Dimensions":"60cm x 60cm per panel","Weight":"5kg per panel","Finish":"Lacquered"}'::jsonb,
    true,
    true,
    1
  ),
  (
    'Decorative Wooden Beams',
    'Decorative ceiling beams adding architectural interest and traditional charm to any space.',
    (SELECT id FROM categories WHERE name = 'Wooden Ceiling'),
    28000,
    '["https://images.pexels.com/photos/6480724/pexels-photo-6480724.jpeg"]'::jsonb,
    '["Architectural feature", "Traditional style", "Lightweight", "Easy mounting"]'::jsonb,
    '{"Material":"Rosewood","Dimensions":"20cm H x 15cm D x 300cm L","Weight":"25kg per beam","Finish":"Natural Polish"}'::jsonb,
    false,
    true,
    2
  );

-- Wooden Lamps
INSERT INTO products (name, description, category_id, price, images, features, specifications, is_featured, is_active, display_order) VALUES
  (
    'Table Lamp with Wooden Base',
    'Elegant table lamp featuring a beautifully crafted wooden base with warm ambient lighting.',
    (SELECT id FROM categories WHERE name = 'Wooden Lamps'),
    8000,
    '["https://images.pexels.com/photos/1865056/pexels-photo-1865056.jpeg"]'::jsonb,
    '["Wooden base", "Soft lighting", "Modern design", "Energy efficient LED"]'::jsonb,
    '{"Material":"Teak Wood","Dimensions":"25cm W x 25cm D x 50cm H","Weight":"3kg","Finish":"Natural Polish"}'::jsonb,
    true,
    true,
    1
  ),
  (
    'Floor Lamp with Wooden Stand',
    'Modern floor lamp with sturdy wooden stand, providing ambient lighting for living spaces.',
    (SELECT id FROM categories WHERE name = 'Wooden Lamps'),
    12000,
    '["https://images.pexels.com/photos/6480729/pexels-photo-6480729.jpeg"]'::jsonb,
    '["Floor standing", "Adjustable brightness", "Wooden craftsmanship", "Contemporary style"]'::jsonb,
    '{"Material":"Rosewood","Dimensions":"35cm W x 35cm D x 150cm H","Weight":"8kg","Finish":"Polished"}'::jsonb,
    false,
    true,
    2
  );

-- Wood Signs
INSERT INTO products (name, description, category_id, price, images, features, specifications, is_featured, is_active, display_order) VALUES
  (
    'Custom Engraved Wood Sign',
    'Personalized wooden sign with custom engraving. Perfect for home décor, business, or special occasions.',
    (SELECT id FROM categories WHERE name = 'Wood Signs'),
    4000,
    '["https://images.pexels.com/photos/459654/pexels-photo-459654.jpeg"]'::jsonb,
    '["Custom engraving", "Personalized", "Wall mounted", "Premium finish"]'::jsonb,
    '{"Material":"Teak Wood","Dimensions":"40cm W x 30cm H","Weight":"1.5kg","Finish":"Polished with Varnish"}'::jsonb,
    false,
    true,
    1
  ),
  (
    'Decorative Welcome Sign',
    'Beautiful welcome sign with decorative carved elements, ideal for entryways and porches.',
    (SELECT id FROM categories WHERE name = 'Wood Signs'),
    5500,
    '["https://images.pexels.com/photos/3876176/pexels-photo-3876176.jpeg"]'::jsonb,
    '["Decorative carving", "Welcoming design", "Weather resistant", "Rustic charm"]'::jsonb,
    '{"Material":"Sheesham Wood","Dimensions":"50cm W x 35cm H","Weight":"2kg","Finish":"Natural with Waterproof Coat"}'::jsonb,
    true,
    true,
    2
  );

-- Driftwood Craft
INSERT INTO products (name, description, category_id, price, images, features, specifications, is_featured, is_active, display_order) VALUES
  (
    'Driftwood Wall Art',
    'Unique wall art created from beautiful reclaimed driftwood, bringing coastal charm to any space.',
    (SELECT id FROM categories WHERE name = 'Driftwood Craft'),
    6000,
    '["https://images.pexels.com/photos/6129098/pexels-photo-6129098.jpeg"]'::jsonb,
    '["Reclaimed driftwood", "Unique design", "Wall mounted", "Coastal aesthetic"]'::jsonb,
    '{"Material":"Natural Driftwood","Dimensions":"80cm W x 50cm H","Weight":"2.5kg","Finish":"Natural with Sealant"}'::jsonb,
    true,
    true,
    1
  ),
  (
    'Driftwood Planter',
    'Artistic planter made from driftwood, perfect for succulents or small potted plants.',
    (SELECT id FROM categories WHERE name = 'Driftwood Craft'),
    4500,
    '["https://images.pexels.com/photos/6129101/pexels-photo-6129101.jpeg"]'::jsonb,
    '["Driftwood construction", "Plant-ready", "Unique artistry", "Eco-friendly"]'::jsonb,
    '{"Material":"Reclaimed Driftwood","Dimensions":"30cm W x 25cm D x 35cm H","Weight":"1.2kg","Finish":"Natural"}'::jsonb,
    false,
    true,
    2
  );
