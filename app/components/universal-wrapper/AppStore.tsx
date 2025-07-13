import React, { useState, useMemo } from 'react';
import type { AppStoreProps, AppConfig } from '~/types/universal-wrapper';
import { useMouseTilt } from '~/lib/hooks/useMouseTilt';

interface AppCardProps {
  app: AppConfig;
  onSelect: (app: AppConfig) => void;
  mouseTiltEnabled?: boolean;
}

function AppCard({ app, onSelect, mouseTiltEnabled = true }: AppCardProps) {
  const {
    elementRef,
    handleMouseMove,
    handleMouseLeave,
    getTransformStyle,
    getGlareStyle,
  } = useMouseTilt({
    maxRotation: 10,
    speed: 0.8,
    enableGlare: true,
    glareOpacity: 0.1,
  });

  const typeIcons = {
    website: '🌐',
    webapp: '📱',
    extension: '🧩',
    custom: '⚡',
  };

  const categoryColors = {
    productivity: '#007bff',
    entertainment: '#28a745',
    development: '#6f42c1',
    design: '#fd7e14',
    communication: '#20c997',
    default: '#6c757d',
  };

  const categoryColor = categoryColors[app.category as keyof typeof categoryColors] || categoryColors.default;

  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className="app-card"
      onMouseMove={mouseTiltEnabled ? handleMouseMove : undefined}
      onClick={() => onSelect(app)}
      style={{
        ...getTransformStyle({
          position: 'relative',
          padding: '20px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e1e5e9',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          overflow: 'hidden',
        }),
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform += ' translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        if (mouseTiltEnabled) {
          handleMouseLeave();
        }
        e.currentTarget.style.transform = getTransformStyle().transform || '';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
      }}
    >
      {/* Glare effect */}
      {mouseTiltEnabled && <div style={getGlareStyle()} />}
      
      <div className="app-card-header" style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '12px',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '12px',
          fontSize: '24px',
        }}>
          {app.icon || typeIcons[app.type]}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: '16px', 
            fontWeight: 'bold',
            color: '#1a1a1a',
            marginBottom: '4px',
          }}>
            {app.name}
          </h3>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{
              display: 'inline-block',
              padding: '2px 8px',
              backgroundColor: categoryColor,
              color: 'white',
              fontSize: '12px',
              borderRadius: '12px',
              fontWeight: '500',
            }}>
              {app.category}
            </span>
            <span style={{
              fontSize: '12px',
              color: '#6c757d',
              textTransform: 'uppercase',
              fontWeight: '500',
            }}>
              {app.type}
            </span>
          </div>
        </div>
        {app.metadata?.featured && (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            fontSize: '16px',
          }}>
            ⭐
          </div>
        )}
      </div>

      <p style={{
        margin: 0,
        fontSize: '14px',
        color: '#6c757d',
        lineHeight: '1.5',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        {app.description}
      </p>

      {app.metadata?.tags && app.metadata.tags.length > 0 && (
        <div style={{
          marginTop: '12px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px',
        }}>
          {app.metadata.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              style={{
                display: 'inline-block',
                padding: '2px 6px',
                backgroundColor: '#f8f9fa',
                color: '#495057',
                fontSize: '11px',
                borderRadius: '8px',
                border: '1px solid #e9ecef',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {app.metadata?.author && (
        <div style={{
          marginTop: '12px',
          fontSize: '12px',
          color: '#6c757d',
        }}>
          by {app.metadata.author}
        </div>
      )}
    </div>
  );
}

export function AppStore({
  apps,
  filters,
  viewMode,
  onAppSelect,
  onFiltersChange,
  mouseTiltEnabled = true,
}: AppStoreProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      const matchesCategory = !filters.category || app.category === filters.category;
      const matchesType = !filters.type || app.type === filters.type;
      const matchesFeatured = filters.featured === undefined || app.metadata?.featured === filters.featured;
      const matchesSearch = !searchTerm || 
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.metadata?.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesCategory && matchesType && matchesFeatured && matchesSearch;
    });
  }, [apps, filters, searchTerm]);

  const categories = useMemo(() => {
    const categorySet = new Set(apps.map(app => app.category));
    return Array.from(categorySet).sort();
  }, [apps]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onFiltersChange({ ...filters, search: value });
  };

  return (
    <div className="app-store" style={{ padding: '24px' }}>
      {/* Header */}
      <div className="app-store-header" style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 'bold', 
          margin: '0 0 8px 0',
          color: '#1a1a1a',
        }}>
          Application Store
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: '#6c757d', 
          margin: 0,
        }}>
          Discover and embed applications in your Universal Wrapper
        </p>
      </div>

      {/* Filters and Search */}
      <div className="app-store-filters" style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '32px',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <div style={{ flex: 1, minWidth: '250px' }}>
          <input
            type="text"
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: '#ffffff',
            }}
          />
        </div>

        <select
          value={filters.category || ''}
          onChange={(e) => onFiltersChange({ ...filters, category: e.target.value || undefined })}
          style={{
            padding: '12px 16px',
            border: '1px solid #e1e5e9',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: '#ffffff',
            minWidth: '150px',
          }}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={filters.type || ''}
          onChange={(e) => onFiltersChange({ ...filters, type: e.target.value as any || undefined })}
          style={{
            padding: '12px 16px',
            border: '1px solid #e1e5e9',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: '#ffffff',
            minWidth: '130px',
          }}
        >
          <option value="">All Types</option>
          <option value="website">Website</option>
          <option value="webapp">Web App</option>
          <option value="extension">Extension</option>
          <option value="custom">Custom</option>
        </select>

        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          color: '#495057',
          cursor: 'pointer',
        }}>
          <input
            type="checkbox"
            checked={filters.featured || false}
            onChange={(e) => onFiltersChange({ ...filters, featured: e.target.checked || undefined })}
          />
          Featured Only
        </label>
      </div>

      {/* Results count */}
      <div style={{
        marginBottom: '24px',
        fontSize: '14px',
        color: '#6c757d',
      }}>
        Showing {filteredApps.length} of {apps.length} applications
      </div>

      {/* App Grid */}
      {filteredApps.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '64px 24px',
          color: '#6c757d',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <h3 style={{ fontSize: '18px', margin: '0 0 8px 0' }}>No applications found</h3>
          <p style={{ margin: 0 }}>Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="app-grid" style={{
          display: 'grid',
          gridTemplateColumns: viewMode === 'grid' 
            ? 'repeat(auto-fill, minmax(320px, 1fr))'
            : '1fr',
          gap: '24px',
        }}>
          {filteredApps.map((app) => (
            <AppCard
              key={app.id}
              app={app}
              onSelect={onAppSelect}
              mouseTiltEnabled={mouseTiltEnabled}
            />
          ))}
        </div>
      )}
    </div>
  );
}