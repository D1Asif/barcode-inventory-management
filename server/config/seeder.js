import Category from '../models/Category.js';

const defaultCategories = [
  'Uncategorized',
  'In Stock',
  'Stock Out'
];

const seedCategories = async () => {
  try {
    console.log('Seeding default categories...');
    
    for (const categoryName of defaultCategories) {
      const existingCategory = await Category.findOne({ name: categoryName });
      
      if (!existingCategory) {
        await Category.create({ name: categoryName });
        console.log(`Created category: ${categoryName}`);
      } else {
        console.log(`Category already exists: ${categoryName}`);
      }
    }
    
    console.log('Category seeding completed!');
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
};

export { seedCategories }; 