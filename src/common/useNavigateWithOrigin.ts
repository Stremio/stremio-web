import { useLocation, useNavigate, To, Location } from 'react-router-dom';

const ORIGIN_KEY = 'originPath';

export function useNavigateWithOrigin() {
    const navigate = useNavigate();
    const location = useLocation();

    function navigateWithOrigin(target: To) {
        const origin: Location = location.state?.from || location;

        // Save origin in sessionStorage
        sessionStorage.setItem(ORIGIN_KEY, origin.pathname + origin.search);

        // Navigate and propagate origin
        navigate(target, {
            state: { from: origin },
        });
    }

    function setOriginPath(path?: string) {
        const finalPath = path ?? location.pathname + location.search;
        sessionStorage.setItem(ORIGIN_KEY, finalPath);
    }

    function getStoredOrigin(fallback?: string): string | undefined {
        if (location.state?.from) {
            const from = location.state.from as Location;
            return from.pathname + (from.search || '');
        }
        return sessionStorage.getItem(ORIGIN_KEY) || fallback;
    }

    return {
        navigateWithOrigin,
        getStoredOrigin,
        setOriginPath,
    };
}
