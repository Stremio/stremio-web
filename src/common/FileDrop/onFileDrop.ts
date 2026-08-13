import { useEffect } from 'react';
import { type FileType, type FileDropListener, useFileDrop } from './FileDrop';

const onFileDrop = (types: FileType[], listener: FileDropListener) => {
    const { on, off } = useFileDrop();

    useEffect(() => {
        types.forEach((type) => on(type, listener));
        return () => types.forEach((type) => off(type, listener));
    }, []);
};

export default onFileDrop;
