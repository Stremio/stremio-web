type MultiselectMenuOption = {
    id?: number;
    label: string;
    value: string | number | null;
    destination?: string;
    default?: boolean;
    hidden?: boolean;
    level?: MultiselectMenuOption[];
};
