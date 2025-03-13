/**
 * Position Addon
 * Shows productivity ranking and stats
 */
import React, { useState, useEffect } from 'react';
import { BarChart2, TrendingUp, Award, Users } from 'lucide-react';
import './styles.css';

const Position = () => {
  // State for user stats
  const [points, setPoints] = useState(259);
  const [rank, setRank] = useState(2);
  const [totalUsers, setTotalUsers] = useState(17);
  const [weeklyChange, setWeeklyChange] = useState(12);
  const [streakDays, setStreakDays] = useState(5);
  
  // Load stats from localStorage on mount
  useEffect(() => {
    const savedPoints = localStorage.getItem('userPoints');
    const savedRank = localStorage.getItem('userRank');
    const savedStreak = localStorage.getItem('userStreak');
    
    if (savedPoints) setPoints(parseInt(savedPoints));
    if (savedRank) setRank(parseInt(savedRank));
    if (savedStreak) setStreakDays(parseInt(savedStreak));
    
    // Simulate random stats
    setTotalUsers(Math.floor(Math.random() * 10) + 15);
    setWeeklyChange(Math.floor(Math.random() * 20) + 5);
  }, []);
  
  // Calculate percentile
  const percentile = Math.round(((totalUsers - rank) / totalUsers) * 100);
  
  // Get badge based on percentile
  const getBadge = () => {
    if (percentile >= 90) return { name: 'Dominator', color: '#F43F5E' };
    if (percentile >= 75) return { name: 'Champion', color: '#8B5CF6' };
    if (percentile >= 50) return { name: 'Achiever', color: '#3B82F6' };
    if (percentile >= 25) return { name: 'Builder', color: '#10B981' };
    return { name: 'Explorer', color: '#F59E0B' };
  };
  
  const badge = getBadge();
  
  return (
    <div className="position-addon">
      <div className="position-header">
        <BarChart2 size={18} className="position-icon" />
        <h2 className="position-title">Position</h2>
      </div>
      
      <div className="position-profile">
        <div className="position-avatar" style={{ backgroundColor: badge.color }}>
          <span>Z</span>
        </div>
        
        <div className="position-stats">
          <div className="position-points">{points} points</div>
          <div className="position-rank">Rank {rank} of {totalUsers}</div>
        </div>
      </div>
      
      <div className="position-badge" style={{ backgroundColor: `${badge.color}20`, borderColor: badge.color }}>
        <Award size={16} style={{ color: badge.color }} />
        <span style={{ color: badge.color }}>{badge.name}</span>
      </div>
      
      <div className="position-details">
        <div className="position-detail-item">
          <div className="detail-label">
            <TrendingUp size={14} />
            <span>Weekly Growth</span>
          </div>
          <div className="detail-value positive">+{weeklyChange} pts</div>
        </div>
        
        <div className="position-detail-item">
          <div className="detail-label">
            <Users size={14} />
            <span>Percentile</span>
          </div>
          <div className="detail-value">{percentile}%</div>
        </div>
        
        <div className="position-detail-item">
          <div className="detail-label">
            <Award size={14} />
            <span>Current Streak</span>
          </div>
          <div className="detail-value">{streakDays} days</div>
        </div>
      </div>
      
      <div className="position-progress">
        <div className="progress-track">
          <div 
            className="progress-fill"
            style={{ 
              width: `${percentile}%`,
              backgroundColor: badge.color
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Position;