export interface AraneaDenIntroProps {
  /**
   * Callback fired when the cinematic brand intro completes and the overlay dissolves.
   */
  onComplete?: () => void;

  /**
   * Optional ready flag for external resource synchronization.
   * If true, intro proceeds to release immediately after cinematic hold.
   * If false, intro holds gracefully on the final logo until ready.
   * Defaults to true.
   */
  isReady?: boolean;

  /**
   * Maximum duration in milliseconds before forced graceful release safeguard.
   * Defaults to 3500ms.
   */
  fallbackTimeoutMs?: number;
}
