import React from 'react';

export type InnerPageHeroVariant = 'about' | 'services' | 'portfolio' | 'contact';

export interface InnerPageHeroProps {
  /**
   * Minimal breadcrumb or page identifier
   */
  breadcrumb?: string;

  /**
   * Optional structured breadcrumb items with links
   */
  breadcrumbItems?: Array<{ label: string; path?: string }>;

  /** Bold, oversized headline */
  headline: string;

  /** Short, readable editorial description */
  description: string;

  /** Distinctive visual element variant corresponding to the page's theme */
  variant: InnerPageHeroVariant;

  /** Optional secondary children, e.g. filter buttons on Portfolio */
  children?: React.ReactNode;

  /** Optional container class name */
  className?: string;
}
