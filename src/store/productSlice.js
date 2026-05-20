import { createSlice } from '@reduxjs/toolkit';

const initialProducts = [
  {
    id: 'prod-1',
    name: 'Ozone-Washed Chopped Palak (Spinach)',
    category: 'Vegetables',
    price: 45.00,
    unit: '250g pkt',
    priceDisplay: '₹45/250g pkt',
    stock: 45,
    status: 'Available',
    description: 'Cleaned, chopped, and triple-washed with food-grade ozone. Ready to cook immediately.',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'prod-2',
    name: 'Sanitized Peeled Garlic Buttons',
    category: 'Vegetables',
    price: 65.00,
    unit: '150g pkt',
    priceDisplay: '₹65/150g pkt',
    stock: 18,
    status: 'Available',
    description: 'Fresh garlic cloves peeled and cleaned in sterile conditions. Saves meal preparation time.',
    image: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'prod-3',
    name: 'Premium Diced Alphonso Mangoes',
    category: 'Fruits',
    price: 180.00,
    unit: '200g bowl',
    priceDisplay: '₹180/200g bowl',
    stock: 0,
    status: 'Out of Stock',
    description: 'Naturally ripened, sweet diced Alphonso mangoes ready to consume or blend.',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'prod-4',
    name: 'Pre-cut Mixed Fruit Bowl',
    category: 'Fruits',
    price: 120.00,
    unit: '300g bowl',
    priceDisplay: '₹120/300g bowl',
    stock: 32,
    status: 'Available',
    description: 'A sanitized mix of chopped papaya, pomegranate, pineapple, and apple slices.',
    image: 'https://images.unsplash.com/photo-1505252585461-04db1eba86be?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'prod-5',
    name: 'Ozone-Washed Chopped Red Onions',
    category: 'Vegetables',
    price: 35.00,
    unit: '250g pkt',
    priceDisplay: '₹35/250g pkt',
    stock: 24,
    status: 'Available',
    description: 'Perfectly diced red onions washed and packed, keeping your kitchen prep clean and tear-free.',
    image: 'https://images.unsplash.com/photo-1508747703725-719ae257c14a?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'prod-6',
    name: 'Hydroponic Alfalfa Sprouts',
    category: 'Microgreens',
    price: 80.00,
    unit: '100g tub',
    priceDisplay: '₹80/100g tub',
    stock: 15,
    status: 'Available',
    description: 'Crispy, protein-rich hydroponic sprouts grown in climate-controlled environments.',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'prod-7',
    name: 'Fresh Mint Leaves (Pudina)',
    category: 'Herbs',
    price: 20.00,
    unit: '100g bunch',
    priceDisplay: '₹20/100g bunch',
    stock: 28,
    status: 'Available',
    description: 'Sanitized, aromatic mint leaves ideal for making fresh chutneys, dips, and coolers.',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'prod-8',
    name: 'Cleaned Oyster Mushrooms',
    category: 'Fungi',
    price: 150.00,
    unit: '200g pkt',
    priceDisplay: '₹150/200g pkt',
    stock: 0,
    status: 'Out of Stock',
    description: 'Premium woodsy oyster mushrooms, cleaned and sorted for stir-fries and curries.',
    image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=600',
  },
];

const initialState = {
  items: initialProducts,
  searchQuery: '',
  selectedCategory: 'All',
  selectedStatus: 'All',
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: (state, action) => {
      const newProduct = {
        id: `prod-${Date.now()}`,
        ...action.payload,
        stock: Number(action.payload.stock),
        price: Number(action.payload.price),
        status: Number(action.payload.stock) > 0 ? 'Available' : 'Out of Stock',
        image: action.payload.image || 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&q=80&w=600', // fallback vegetable image
      };
      state.items.unshift(newProduct);
    },
    toggleAvailability: (state, action) => {
      const product = state.items.find((p) => p.id === action.payload);
      if (product) {
        if (product.status === 'Available') {
          product.status = 'Out of Stock';
          product.stock = 0;
        } else {
          product.status = 'Available';
          product.stock = 15; // default restock level
        }
      }
    },
    updateStock: (state, action) => {
      const { id, stock } = action.payload;
      const product = state.items.find((p) => p.id === id);
      if (product) {
        product.stock = Number(stock);
        product.status = Number(stock) > 0 ? 'Available' : 'Out of Stock';
      }
    },
    deleteProduct: (state, action) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSelectedStatus: (state, action) => {
      state.selectedStatus = action.payload;
    },
    resetFilters: (state) => {
      state.searchQuery = '';
      state.selectedCategory = 'All';
      state.selectedStatus = 'All';
    },
  },
});

export const {
  addProduct,
  toggleAvailability,
  updateStock,
  deleteProduct,
  setSearchQuery,
  setSelectedCategory,
  setSelectedStatus,
  resetFilters,
} = productSlice.actions;

// Selector for filtered products
export const selectFilteredProducts = (state) => {
  const { items, searchQuery, selectedCategory, selectedStatus } = state.products;
  return items.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || product.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
};

export default productSlice.reducer;
