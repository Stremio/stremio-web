type MultiselectMenuOption = {
    id?: number;
    label: string;
    value: string;
    destination?: string;
    default?: boolean;
    hidden?: boolean;
    level?: MultiselectMenuOption[];
};