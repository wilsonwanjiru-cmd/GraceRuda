// client/src/utils/analytics.js
// Meta Pixel integration
export const initMetaPixel = (pixelId) => {
    if (typeof window !== 'undefined' && pixelId) {
        window.fbq = window.fbq || function () {
            (window.fbq.q = window.fbq.q || []).push(arguments);
        };
        window.fbq('init', pixelId);
        window.fbq('track', 'PageView');
    }
};

export const trackEvent = (eventName, params = {}) => {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', eventName, params);
    }
};

export const trackPageView = (path) => {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'PageView', { path });
    }
};

export const trackSignup = (userData) => {
    trackEvent('CompleteRegistration', {
        content_name: 'Signup',
        status: 'success',
        ...userData,
    });
};

export const trackPurchase = (amount, currency, product) => {
    trackEvent('Purchase', {
        value: amount,
        currency: currency || 'KES',
        content_name: product || 'Premium Subscription',
    });
};