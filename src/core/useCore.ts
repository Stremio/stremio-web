import { useContext } from 'react';
import CoreContext from './CoreContext';

const useCore = () => useContext(CoreContext);
export default useCore;
