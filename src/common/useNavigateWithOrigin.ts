import { useLocation, useNavigate, To, Location } from 'react-router-dom';
import toPath from './toPath';

const getLocationPath = (location: Location): string => location.pathname + (location.search || '');
const getOriginPath = (origin: Location | string): string => typeof origin === 'string' ? origin : getLocationPath(origin);
const normalizeTarget = (target: To): To => typeof target === 'string' ? toPath(target) : target;

export function useNavigateWithOrigin() {
    const navigate = useNavigate();
    const location = useLocation();

    function navigateWithOrigin(target: To) {
        const origin: Location = location.state?.from || location;
        navigate(normalizeTarget(target), {
            state: { from: origin },
        });
    }

    function getStoredOrigin(fallback?: string): string | undefined {
        if (location.state?.from) {
            return getOriginPath(location.state.from as Location | string);
        }
        return fallback;
    }

    return {
        navigateWithOrigin,
        getStoredOrigin,
    };
}
