type buttonVariantType = 'text-with-icon' | 'icon-only';

type popupMenuOptionType = {
    IconComponent: React.ElementType;
    label: string;
    onClick: () => void;
};

type buttonType = {
    IconComponent: React.ElementType;
    onClick: () => void;
    isDisabled?: boolean;
    title: string;
    titleWhenDisabled?: string;
    shape?: 'outlined' | 'contained';
    variant?: buttonVariantType;
    isLoading?: boolean;
    popupMenu?: Array<popupMenuOptionType>;
};

export type { buttonType, popupMenuOptionType, buttonVariantType };
