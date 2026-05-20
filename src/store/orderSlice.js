import { createSlice } from '@reduxjs/toolkit';

const initialOrders = [
  {
    id: 'ORD-9831',
    customer: {
      name: 'Aarav Sharma',
      email: 'aarav.sharma@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    itemsCount: 3,
    total: 650.00,
    status: 'Delivered',
    date: 'May 20, 2026 09:15 AM',
    paymentMethod: 'UPI (GPay)',
  },
  {
    id: 'ORD-9830',
    customer: {
      name: 'Priyanjali Sen',
      email: 'priyanjali.s@outlook.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    itemsCount: 1,
    total: 380.00,
    status: 'In Transit',
    date: 'May 20, 2026 08:30 AM',
    paymentMethod: 'Cash on Delivery',
  },
  {
    id: 'ORD-9829',
    customer: {
      name: 'Rohan Gupta',
      email: 'rohan.gupta@yahoo.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    itemsCount: 5,
    total: 1250.00,
    status: 'Pending',
    date: 'May 19, 2026 05:45 PM',
    paymentMethod: 'UPI (PhonePe)',
  },
  {
    id: 'ORD-9828',
    customer: {
      name: 'Deepa Nair',
      email: 'deepa.nair@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    itemsCount: 2,
    total: 420.00,
    status: 'Delivered',
    date: 'May 19, 2026 02:10 PM',
    paymentMethod: 'Debit Card',
  },
  {
    id: 'ORD-9827',
    customer: {
      name: 'Amit Verma',
      email: 'amit.verma@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    itemsCount: 4,
    total: 980.00,
    status: 'Pending',
    date: 'May 19, 2026 11:15 AM',
    paymentMethod: 'Cash on Delivery',
  },
  {
    id: 'ORD-9826',
    customer: {
      name: 'Ananya Iyer',
      email: 'ananya.iyer@outlook.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    itemsCount: 2,
    total: 320.00,
    status: 'Delivered',
    date: 'May 18, 2026 04:30 PM',
    paymentMethod: 'Net Banking',
  },
  {
    id: 'ORD-9825',
    customer: {
      name: 'Vikram Malhotra',
      email: 'vikram.m@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    itemsCount: 1,
    total: 210.00,
    status: 'Cancelled',
    date: 'May 18, 2026 01:15 PM',
    paymentMethod: 'Credit Card',
  },
  {
    id: 'ORD-9824',
    customer: {
      name: 'Meera Deshmukh',
      email: 'meera.d@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    itemsCount: 6,
    total: 1540.00,
    status: 'Delivered',
    date: 'May 18, 2026 09:45 AM',
    paymentMethod: 'UPI (Paytm)',
  }
];

const initialState = {
  items: initialOrders,
  stats: {
    baseActiveUsers: 1420,
    baseRevenue: 345200.00,
    baseOrders: 320,
  }
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder: (state, action) => {
      state.items.unshift(action.payload);
    },
    updateOrderStatus: (state, action) => {
      const { id, status } = action.payload;
      const order = state.items.find((o) => o.id === id);
      if (order) {
        order.status = status;
      }
    },
    deleteOrder: (state, action) => {
      state.items = state.items.filter((o) => o.id !== action.payload);
    },
  },
});

export const { addOrder, updateOrderStatus, deleteOrder } = orderSlice.actions;

// Selectors
export const selectOrders = (state) => state.orders.items;

export const selectDashboardStats = (state) => {
  const orders = state.orders.items;
  const products = state.products.items;
  const { baseActiveUsers, baseRevenue, baseOrders } = state.orders.stats;

  // Calculate stats from dynamic state + base counts
  const dynamicRevenue = orders
    .filter(o => o.status === 'Delivered' || o.status === 'In Transit')
    .reduce((sum, o) => sum + o.total, 0);

  const totalRevenue = baseRevenue + dynamicRevenue;
  const totalOrders = baseOrders + orders.length;
  
  // Pending deliveries are those that are "Pending" or "In Transit"
  const pendingDeliveries = orders.filter(o => o.status === 'Pending' || o.status === 'In Transit').length;
  
  // Count unique customers in recent list to add to active users
  const uniqueRecentCustomers = new Set(orders.map(o => o.customer.email)).size;
  const totalActiveUsers = baseActiveUsers + uniqueRecentCustomers;

  return {
    totalOrders,
    revenue: totalRevenue,
    activeUsers: totalActiveUsers,
    pendingDeliveries,
  };
};

export default orderSlice.reducer;
