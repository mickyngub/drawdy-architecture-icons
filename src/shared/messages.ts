export type IconSource = "lucide" | "iconify";

export type IconRef = {
    source: IconSource;
    name: string;
    title: string;
};

export type IconPick = IconRef & { svg: string };

export type IconSize = 32 | 64 | 128 | 256;

export type StrokeWidth = 1.5 | 2 | 2.75;

export type PlaceOptions = {
    size: IconSize;
    color: string;
    stroke: StrokeWidth;
    label: boolean;
};

export type PersistedState = {
    recent: IconRef[];
    options: PlaceOptions;
};

export type WebviewToDriver =
    | { type: "ready" }
    | { type: "drop-icon"; icon: IconPick; x: number; y: number }
    | { type: "insert-icon"; icon: IconPick }
    | { type: "persist"; recent: IconRef[]; options: PlaceOptions };

export type DriverToWebview =
    | { type: "init"; recent: IconRef[]; options: PlaceOptions }
    | { type: "theme"; cssVars: string };
