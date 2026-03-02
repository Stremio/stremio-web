type ToastOptions = {
    type: string,
    title: string,
    timeout: number,
};

declare const useToast: () => {
    show: (options: ToastOptions) => void,
};

export = useToast;
