import React, { ChangeEvent, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { isFileType, isFileTypeSupported } from './utils';
import styles from './styles.less';

export type FileType = string;
export type FileDropListener = (file: File, buffer: ArrayBuffer, supported: boolean) => void;

type FileDropContext = {
    on: (type: FileType, listener: FileDropListener) => void,
    off: (type: FileType, listener: FileDropListener) => void,
};

const FileDropContext = createContext({} as FileDropContext);

type Props = {
    children: React.ReactNode,
};

const FileDropProvider = ({ children }: Props) => {
    const listeners = useRef<[FileType, FileDropListener][]>([]);
    const [active, setActive] = useState(false);

    const on = useCallback((type: FileType, listener: FileDropListener) => {
        listeners.current = [...listeners.current, [type, listener]];
    }, []);

    const off = useCallback((type: FileType, listener: FileDropListener) => {
        listeners.current = listeners.current.filter(([key, value]) => key !== type || value !== listener);
    }, []);

    const value = useMemo(() => ({ on, off }), [on, off]);

    const readFile = useCallback((file: File) => {
        file
            .arrayBuffer()
            .then((buffer) => {
                listeners.current
                    .filter(([type]) => type === '*')
                    .forEach(([, listener]) => listener(file, buffer, isFileTypeSupported(buffer)));
                listeners.current
                    .filter(([type]) => type !== '*' && (file.type ? type === file.type : isFileType(buffer, type)))
                    .forEach(([, listener]) => listener(file, buffer, true));
            })
            .catch(console.error);
    }, []);

    const onChange = (event: ChangeEvent) => {
        event.preventDefault();

        const input = event.target as HTMLInputElement;

        if (input.files && input.files.length > 0) {
            readFile(input.files[0]);
        }

        setActive(false);
        input.files = new DataTransfer().files;
    };

    useEffect(() => {
        let dragDepth = 0;

        const onDragStart = (event: DragEvent) => {
            event.preventDefault();
        };

        const onDragEnter = (event: DragEvent) => {
            if (!event.dataTransfer?.types.includes('Files')) return;

            event.preventDefault();
            dragDepth += 1;
            setActive(true);
        };

        const onDragOver = (event: DragEvent) => {
            if (event.dataTransfer?.types.includes('Files')) event.preventDefault();
        };

        const onDragLeave = () => {
            dragDepth = Math.max(0, dragDepth - 1);
            if (dragDepth === 0) setActive(false);
        };

        const onDrop = (event: DragEvent) => {
            if (!event.dataTransfer?.types.includes('Files')) return;

            event.preventDefault();
            dragDepth = 0;
            setActive(false);

            const file = event.dataTransfer.files[0];
            if (file) readFile(file);
        };

        window.addEventListener('dragstart', onDragStart);
        window.addEventListener('dragenter', onDragEnter);
        window.addEventListener('dragover', onDragOver);
        window.addEventListener('dragleave', onDragLeave);
        window.addEventListener('drop', onDrop);

        return () => {
            window.removeEventListener('dragstart', onDragStart);
            window.removeEventListener('dragenter', onDragEnter);
            window.removeEventListener('dragover', onDragOver);
            window.removeEventListener('dragleave', onDragLeave);
            window.removeEventListener('drop', onDrop);
        };
    }, [readFile]);

    return (
        <FileDropContext.Provider value={value}>
            { children }
            <div className={classNames(styles['file-drop-container'], { 'active': active })}>
                <input type={'file'} className={styles['file-input']} onChange={onChange} />
            </div>
        </FileDropContext.Provider>
    );
};

const useFileDrop = () => {
    return useContext(FileDropContext);
};

export {
    FileDropProvider,
    useFileDrop,
};
