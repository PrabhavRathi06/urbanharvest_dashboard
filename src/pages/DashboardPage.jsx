import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectDashboardStats, selectOrders, updateOrderStatus } from '../store/orderSlice';
import { updateStock } from '../store/productSlice';
import StatCard from '../components/StatCard';
import { 
  ShoppingBag, 
  IndianRupee, 
  Users, 
  Truck, 
  ArrowRight, 
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw
} from 'lucide-react';
import './pages.css';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const stats = useSelector(selectDashboardStats);
  const orders = useSelector(selectOrders);
  const products = useSelector((state) => state.products.items);

  // Filter low stock products (stock <= 5) for low-stock alerts
  const lowStockProducts = products.filter(p => p.stock <= 5);

  // Compute category distribution for inventory progress bars
  const categoryCounts = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  const totalProductCount = products.length;

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
  };

  const handleQuickRestock = (productId) => {
    // Restock to a standard level of 25 items
    dispatch(updateStock({ id: productId, stock: 25 }));
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Delivered':
        return 'badge-success';
      case 'In Transit':
        return 'badge-info';
      case 'Pending':
        return 'badge-warning';
      case 'Cancelled':
        return 'badge-danger';
      default:
        return '';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle size={12} />;
      case 'In Transit':
        return <Truck size={12} />;
      case 'Pending':
        return <Clock size={12} />;
      case 'Cancelled':
        return <XCircle size={12} />;
      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Metrics Row */}
      <div className="stats-grid">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders.toLocaleString()}
          icon={ShoppingBag}
          trendValue={14.2}
          isUp={true}
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.revenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={IndianRupee}
          trendValue={18.6}
          isUp={true}
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers.toLocaleString()}
          icon={Users}
          trendValue={8.4}
          isUp={true}
        />
        <StatCard
          title="Pending Deliveries"
          value={stats.pendingDeliveries}
          icon={Truck}
          trendValue={12.5}
          isUp={false}
          timeframe="vs yesterday"
        />
      </div>

      {/* Main Grid Content */}
      <div className="dashboard-layout-grid">
        
        {/* Left Side: Recent Orders Table */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h2 className="panel-title">Recent Customer Orders</h2>
            <span style={{ fontSize: '0.8125rem', color: 'var(--neutral-400)' }}>
              Live Order Stream
            </span>
          </div>

          <div className="table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Order Total</th>
                  <th>Order Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 600, color: 'var(--primary-700)' }}>{order.id}</td>
                    <td>
                      <div className="customer-cell">
                        <img 
                          className="customer-avatar" 
                          src={order.customer.avatar} 
                          alt={order.customer.name} 
                        />
                        <div className="customer-info">
                          <span className="customer-name">{order.customer.name}</span>
                          <span className="customer-email">{order.customer.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>{order.itemsCount} {order.itemsCount === 1 ? 'item' : 'items'}</td>
                    <td style={{ fontWeight: 600 }}>₹{order.total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--neutral-600)' }}>{order.date}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span style={{ marginLeft: '4px' }}>{order.status}</span>
                      </span>
                    </td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          border: '1px solid var(--neutral-200)',
                          fontSize: '0.75rem',
                          backgroundColor: 'white',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side Panels: Low Stock & Category breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Low Stock Panel */}
          <div className="dashboard-panel" style={{ margin: 0 }}>
            <div className="panel-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} color="var(--danger)" />
                <h2 className="panel-title">Low Stock Alerts</h2>
              </div>
              <span className="badge badge-danger">
                {lowStockProducts.length} Alert{lowStockProducts.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="low-stock-list">
              {lowStockProducts.length === 0 ? (
                <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--neutral-400)', fontSize: '0.875rem' }}>
                  All products are well stocked!
                </div>
              ) : (
                lowStockProducts.map((product) => (
                  <div key={product.id} className="low-stock-item">
                    <img className="low-stock-img" src={product.image} alt={product.name} />
                    <div className="low-stock-details">
                      <div className="low-stock-name">{product.name}</div>
                      <div className="low-stock-category">{product.category}</div>
                    </div>
                    <div className="low-stock-alert">
                      <div className="low-stock-qty">{product.stock} left</div>
                      <button 
                        onClick={() => handleQuickRestock(product.id)}
                        className="btn btn-outline"
                        style={{ padding: '4px 8px', fontSize: '0.6875rem', borderRadius: '4px', marginTop: '4px' }}
                        title="Restock to 25 items"
                      >
                        <RefreshCw size={10} style={{ marginRight: '4px' }} /> Restock
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Inventory Distribution */}
          <div className="dashboard-panel" style={{ margin: 0 }}>
            <div className="panel-header">
              <h2 className="panel-title">Inventory Composition</h2>
            </div>
            
            <div className="category-list">
              {Object.entries(categoryCounts).map(([category, count]) => {
                const percentage = Math.round((count / totalProductCount) * 100);
                return (
                  <div key={category} className="category-item">
                    <div className="category-info">
                      <span>{category}</span>
                      <span>{count} product{count !== 1 ? 's' : ''} ({percentage}%)</span>
                    </div>
                    <div className="category-bar-bg">
                      <div 
                        className="category-bar-fill" 
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: 
                            category === 'Vegetables' ? 'var(--primary-600)' :
                            category === 'Fruits' ? 'var(--warning)' :
                            category === 'Herbs' ? 'var(--success)' :
                            category === 'Microgreens' ? '#10b981' :
                            'var(--neutral-400)'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
