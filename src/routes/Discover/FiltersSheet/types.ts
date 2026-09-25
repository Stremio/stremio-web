// Copyright (C) 2017-2026 Smart code 203358507

export type Option = {
    value: string;
    label: string;
    description?: string;
    default?: boolean;
};

export type Input = {
    id: string;
    label: string;
    options: Option[];
    value?: string;
    active?: boolean;
    onSelect: (value: string) => void;
};
