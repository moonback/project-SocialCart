// Utilitaires pour la gestion des catégories et marques
// =============================================

// Fonction pour valider si une chaîne est un UUID valide
export const isValidUUID = (str: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

// Catégories prédéfinies avec leurs IDs UUID fictifs
export const PREDEFINED_CATEGORIES = [
  { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Électronique', slug: 'electronics' },
  { id: '550e8400-e29b-41d4-a716-446655440002', name: 'Mode & Accessoires', slug: 'fashion' },
  { id: '550e8400-e29b-41d4-a716-446655440003', name: 'Maison & Jardin', slug: 'home' },
  { id: '550e8400-e29b-41d4-a716-446655440004', name: 'Sports & Loisirs', slug: 'sports' },
  { id: '550e8400-e29b-41d4-a716-446655440005', name: 'Beauté & Santé', slug: 'beauty' },
  { id: '550e8400-e29b-41d4-a716-446655440006', name: 'Alimentation', slug: 'food' },
  { id: '550e8400-e29b-41d4-a716-446655440007', name: 'Livres & Médias', slug: 'books' },
  { id: '550e8400-e29b-41d4-a716-446655440008', name: 'Automobile', slug: 'automotive' },
  { id: '550e8400-e29b-41d4-a716-446655440009', name: 'Jouets & Enfants', slug: 'toys' },
  { id: '550e8400-e29b-41d4-a716-446655440010', name: 'Autres', slug: 'other' }
];

// Marques prédéfinies avec leurs IDs UUID fictifs
export const PREDEFINED_BRANDS = [
  { id: '660e8400-e29b-41d4-a716-446655440001', name: 'Apple', slug: 'apple' },
  { id: '660e8400-e29b-41d4-a716-446655440002', name: 'Samsung', slug: 'samsung' },
  { id: '660e8400-e29b-41d4-a716-446655440003', name: 'Nike', slug: 'nike' },
  { id: '660e8400-e29b-41d4-a716-446655440004', name: 'Adidas', slug: 'adidas' },
  { id: '660e8400-e29b-41d4-a716-446655440005', name: 'Sony', slug: 'sony' },
  { id: '660e8400-e29b-41d4-a716-446655440006', name: 'LG', slug: 'lg' },
  { id: '660e8400-e29b-41d4-a716-446655440007', name: 'Dell', slug: 'dell' },
  { id: '660e8400-e29b-41d4-a716-446655440008', name: 'HP', slug: 'hp' },
  { id: '660e8400-e29b-41d4-a716-446655440009', name: 'Canon', slug: 'canon' },
  { id: '660e8400-e29b-41d4-a716-446655440010', name: 'Autre', slug: 'other' }
];

// Fonction pour obtenir l'ID de catégorie à partir du nom ou slug
export const getCategoryId = (categoryInput: string): string | null => {
  if (!categoryInput) return null;
  
  // Si c'est déjà un UUID valide, le retourner
  if (isValidUUID(categoryInput)) {
    return categoryInput;
  }
  
  // Chercher par nom ou slug
  const category = PREDEFINED_CATEGORIES.find(
    cat => cat.name.toLowerCase() === categoryInput.toLowerCase() || 
           cat.slug === categoryInput.toLowerCase()
  );
  
  return category ? category.id : null;
};

// Fonction pour obtenir l'ID de marque à partir du nom ou slug
export const getBrandId = (brandInput: string): string | null => {
  if (!brandInput) return null;
  
  // Si c'est déjà un UUID valide, le retourner
  if (isValidUUID(brandInput)) {
    return brandInput;
  }
  
  // Chercher par nom ou slug
  const brand = PREDEFINED_BRANDS.find(
    br => br.name.toLowerCase() === brandInput.toLowerCase() || 
          br.slug === brandInput.toLowerCase()
  );
  
  return brand ? brand.id : null;
};

// Fonction pour obtenir le nom de catégorie à partir de l'ID
export const getCategoryName = (categoryId: string): string | null => {
  if (!categoryId) return null;
  
  const category = PREDEFINED_CATEGORIES.find(cat => cat.id === categoryId);
  return category ? category.name : null;
};

// Fonction pour obtenir le nom de marque à partir de l'ID
export const getBrandName = (brandId: string): string | null => {
  if (!brandId) return null;
  
  const brand = PREDEFINED_BRANDS.find(br => br.id === brandId);
  return brand ? brand.name : null;
};
