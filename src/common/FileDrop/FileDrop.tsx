import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import classNames from 'classnames';
import { isFileType } from './utils';

export type FileType = string;
export type FileDropListener = (filename: string, buffer: ArrayBuffer) => void;

type FileDropContext = {
    on: (type: FileType, listener: FileDropListener) => void,
    off: (type: FileType, listener: FileDropListener) => void,
};

const FileDropContext = createContext({} as FileDropContext);

type Props = {
    className: string,
    children: JSX.Element,
};

const FileDropProvider = ({ className, children }: Props) => {
    const [listeners, setListeners] = useState<[FileType, FileDropListener][]>([]);
    const [active, setActive] = useState(false);

    const onDragOver = (event: DragEvent) => {
        event.preventDefault();
        setActive(true);
    };

    const onDragLeave = () => {
        setActive(false);
    };

    const onDrop = useCallback((event: DragEvent) => {
        event.preventDefault();
        const { dataTransfer } = event;

        if (dataTransfer && dataTransfer?.files.length > 0) {
            const file = dataTransfer.files[0];

            file
                .arrayBuffer()
                .then((buffer) => {
                    listeners
                        .filter(([type]) => file.type ? type === file.type : isFileType(buffer, type))
                        .forEach(([, listener]) => listener(file.name, buffer));
                });
        }

        setActive(false);
    }, [listeners]);

    const on = (type: FileType, listener: FileDropListener) => {
        setListeners((listeners) => {
            return [...listeners, [type, listener]];
        });
    };

    const off = (type: FileType, listener: FileDropListener) => {
        setListeners((listeners) => {
            return listeners.filter(([key, value]) => key !== type && value !== listener);
        });
    };

    useEffect(() => {
        window.addEventListener('dragover', onDragOver);
        window.addEventListener('dragleave', onDragLeave);
        window.addEventListener('drop', onDrop);

        return () => {
            window.removeEventListener('dragover', onDragOver);
            window.removeEventListener('dragleave', onDragLeave);
            window.removeEventListener('drop', onDrop);
        };
    }, [onDrop]);

    return (
        <FileDropContext.Provider value={{ on, off }}>
            { children }
            <div className={classNames(className, { 'active': active })} />
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
