/**
 * AraneaDenNavbar — Type Definitions
 * Phase 2: THE FLOATING ARCANUM
 */

export interface NavLink {
  label: string;
  href: string;
  /** Route path for active state matching */
  path: string;
}

export interface AraneaDenNavbarProps {
  /** Whether the Phase 1 intro has completed — navbar enters only after */
  isVisible: boolean;
}

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLink[];
  currentPath: string;
}
