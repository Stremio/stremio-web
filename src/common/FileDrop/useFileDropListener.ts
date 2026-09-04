import { useEffect } from 'react';
import { type FileType, type FileDropListener, useFileDrop } from './FileDrop';

const useFileDropListener = (types: readonly FileType[], listener: FileDropListener) => {
    const { on, off } = useFileDrop();

    useEffect(() => {
        types.forEach((type) => on(type, listener));
        return () => types.forEach((type) => off(type, listener));
    }, [types, listener, on, off]);
};

export default useFileDropListener;
