type buttonVariantType = 'text-with-icon' | 'icon-only';

type popupMenuOptionType = {
    IconComponent: React.ElementType;
    label: string;
    onClick: () => void;
};

type buttonType = {
    IconComponent: React.ElementType;
    onClick: () => void;
    title: string;
    shape?: 'outlined' | 'contained';
    variant?: buttonVariantType;
    isLoading?: boolean;
    popupMenu?: Array<popupMenuOptionType>;
};

export type { buttonType, popupMenuOptionType, buttonVariantType };
