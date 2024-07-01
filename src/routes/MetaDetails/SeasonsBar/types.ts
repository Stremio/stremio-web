// Copyright (C) 2017-2024 Smart code 203358507

export type OnSelectFunction = (event: OnSelectEvent) => void;

export type CustomSelectEvent = {
    value: number;
    reactEvent: React.SyntheticEvent;
    nativeEvent: Event;
    currentTarget: {
        dataset: {
            action: string;
        };
    };
};

export type OnSelectEvent = {
    type: string;
    value: number;
    reactEvent: React.SyntheticEvent;
    nativeEvent: Event;
};