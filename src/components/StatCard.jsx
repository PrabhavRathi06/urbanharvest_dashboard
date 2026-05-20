import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import './layout.css';

const StatCard = ({ title, value, icon: Icon, trendValue, isUp, timeframe = 'vs last month' }) => {
  return (
    <div className="stat-card card-hover animate-fade-in">
      <div className="stat-header">
        <span className="stat-title">{title}</span>
        <div className="stat-icon-wrapper">
          <Icon size={20} />
        </div>
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-footer">
          {trendValue !== undefined && (
            <span className={`stat-trend ${isUp ? 'up' : 'down'}`}>
              {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {trendValue}%
            </span>
          )}
          <span>{timeframe}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
