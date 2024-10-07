type MultiselectMenuOption = {
    id?: number;
    label: string;
    value: number;
    destination?: string;
    default?: boolean;
    hidden?: boolean;
    level?: MultiselectMenuOption[];
};
