/**
 * Global Theme Synchronization Utility
 *
 * Provides a unified theme management system that syncs dark/light mode
 * across all apps in real-time using BroadcastChannel and localStorage.
 *
 * Features:
 * - Cross-tab/cross-app synchronization (even same origin)
 * - OS preference detection as fallback
 * - Custom events for same-page listeners
 * - Standard data-theme attribute approach
 *
 * Usage:
 *   <script src="/path/to/theme-sync.js"></script>
 *   <script>
 *     ThemeSync.init({
 *       onThemeChange: (theme) => {
 *         // Update theme icons, etc.
 *       }
 *     });
 *   </script>
 */

(function(global) {
    'use strict';

    const STORAGE_KEY = 'theme';
    const THEME_DARK = 'dark';
    const THEME_LIGHT = 'light';
    const CHANNEL_NAME = 'theme-sync-channel';

    let onThemeChangeCallback = null;
    let broadcastChannel = null;

    /**
     * Detects OS preference for dark mode
     */
    function getOSPreference() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return THEME_DARK;
        }
        return THEME_LIGHT;
    }

    /**
     * Gets the current theme (from localStorage or OS preference)
     */
    function getCurrentTheme() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === THEME_DARK || saved === THEME_LIGHT) {
            return saved;
        }
        return getOSPreference();
    }

    /**
     * Applies theme to the document
     */
    function applyTheme(theme) {
        const html = document.documentElement;
        html.setAttribute('data-theme', theme);

        // Trigger callback if registered
        if (onThemeChangeCallback && typeof onThemeChangeCallback === 'function') {
            onThemeChangeCallback(theme);
        }

        // Dispatch custom event for same-page listeners
        window.dispatchEvent(new CustomEvent('themechange', {
            detail: { theme: theme }
        }));
    }

    /**
     * Sets the theme and saves to localStorage
     */
    function setTheme(theme) {
        if (theme !== THEME_DARK && theme !== THEME_LIGHT) {
            console.warn(`Invalid theme: ${theme}. Using default.`);
            theme = THEME_DARK;
        }

        localStorage.setItem(STORAGE_KEY, theme);
        applyTheme(theme);

        // Broadcast to other tabs/apps
        if (broadcastChannel) {
            try {
                broadcastChannel.postMessage({ theme: theme });
            } catch (e) {
                console.warn('Failed to broadcast theme change:', e);
            }
        }
    }

    /**
     * Toggles between light and dark theme
     */
    function toggleTheme() {
        const current = getCurrentTheme();
        const newTheme = current === THEME_DARK ? THEME_LIGHT : THEME_DARK;
        setTheme(newTheme);
    }

    /**
     * Handles messages from BroadcastChannel (other tabs)
     */
    function handleBroadcastMessage(event) {
        if (event.data && event.data.theme) {
            applyTheme(event.data.theme);
        }
    }

    /**
     * Handles storage events from other tabs/windows (fallback)
     */
    function handleStorageChange(e) {
        if (e.key === STORAGE_KEY && e.newValue) {
            applyTheme(e.newValue);
        }
    }

    /**
     * Handles OS preference changes
     */
    function handleOSPreferenceChange(e) {
        // Only apply OS preference if no explicit user preference is saved
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) {
            const newTheme = e.matches ? THEME_DARK : THEME_LIGHT;
            applyTheme(newTheme);
        }
    }

    /**
     * Initializes the theme system
     */
    function init(options) {
        options = options || {};
        onThemeChangeCallback = options.onThemeChange || null;

        // Apply initial theme immediately (before DOMContentLoaded for FOUC prevention)
        const initialTheme = getCurrentTheme();
        applyTheme(initialTheme);

        // Set up BroadcastChannel for cross-tab communication
        if (typeof BroadcastChannel !== 'undefined') {
            try {
                broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
                broadcastChannel.addEventListener('message', handleBroadcastMessage);
            } catch (e) {
                console.warn('BroadcastChannel not supported, using storage events only:', e);
            }
        }

        // Listen for storage events (fallback for browsers without BroadcastChannel)
        window.addEventListener('storage', handleStorageChange);

        // Listen for OS preference changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            if (mediaQuery.addEventListener) {
                mediaQuery.addEventListener('change', handleOSPreferenceChange);
            } else if (mediaQuery.addListener) {
                // Fallback for older browsers
                mediaQuery.addListener(handleOSPreferenceChange);
            }
        }

        return {
            getCurrentTheme: getCurrentTheme,
            setTheme: setTheme,
            toggleTheme: toggleTheme
        };
    }

    // Expose public API
    global.ThemeSync = {
        init: init,
        setTheme: setTheme,
        toggleTheme: toggleTheme,
        getCurrentTheme: getCurrentTheme,
        THEME_DARK: THEME_DARK,
        THEME_LIGHT: THEME_LIGHT
    };

})(window);
