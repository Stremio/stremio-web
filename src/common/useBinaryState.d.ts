declare const useBinaryState: (initialValue?: boolean) => [
    boolean,
    () => void,
    () => void,
    () => void,
];

export = useBinaryState;
