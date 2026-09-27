import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Breadcrumbs.module.css';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  currentPage?: string;
  className?: string;
}

const ROUTE_LABELS: Record<string, string> = {
  about: 'ABOUT',
  services: 'SERVICES',
  portfolio: 'PORTFOLIO',
  team: 'TEAM',
  contact: 'CONTACT',
  privacy: 'PRIVACY POLICY',
  terms: 'TERMS OF SERVICE',
  'web-development': 'WEB DEVELOPMENT',
  'mobile-development': 'MOBILE APP DEVELOPMENT',
  'ui-ux-design': 'UI / UX DESIGN',
  'digital-marketing': 'DIGITAL MARKETING',
  'video-production': 'VIDEO PRODUCTION',
  'graphic-design': 'GRAPHIC DESIGN',
  seo: 'SEO ARCHITECTURE',
  'cloud-solutions': 'CLOUD SOLUTIONS',
};

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items: customItems,
  currentPage,
  className,
}) => {
  const location = useLocation();

  // Resolve breadcrumb trail
  const resolvedItems: BreadcrumbItem[] = React.useMemo(() => {
    if (customItems && customItems.length > 0) {
      return customItems;
    }

    if (currentPage) {
      return [
        { label: 'HOME', path: '/' },
        { label: currentPage.toUpperCase() },
      ];
    }

    // Auto-resolve from current pathname
    const segments = location.pathname.split('/').filter(Boolean);
    if (segments.length === 0) {
      return [{ label: 'HOME' }];
    }

    const trail: BreadcrumbItem[] = [{ label: 'HOME', path: '/' }];
    let accumulatedPath = '';

    segments.forEach((segment, index) => {
      accumulatedPath += `/${segment}`;
      const isLast = index === segments.length - 1;
      const label =
        ROUTE_LABELS[segment.toLowerCase()] ||
        segment.replace(/-/g, ' ').toUpperCase();

      trail.push({
        label,
        path: isLast ? undefined : accumulatedPath,
      });
    });

    return trail;
  }, [customItems, currentPage, location.pathname]);

  return (
    <nav
      aria-label="Breadcrumb"
      className={`${styles.nav} ${className || ''}`}
    >
      <ol className={styles.list}>
        <li className={styles.dotItem} aria-hidden="true">
          <span className={styles.dot} />
        </li>
        {resolvedItems.map((item, index) => {
          const isLast = index === resolvedItems.length - 1;
          return (
            <React.Fragment key={`${item.label}-${index}`}>
              <li
                className={`${styles.item} ${isLast ? styles.activeItem : ''}`}
              >
                {isLast || !item.path ? (
                  <span
                    className={styles.current}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link to={item.path} className={styles.link}>
                    {item.label}
                  </Link>
                )}
              </li>
              {!isLast && (
                <li className={styles.separator} aria-hidden="true">
                  /
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
