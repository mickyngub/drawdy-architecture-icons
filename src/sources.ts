export const LUCIDE_VERSION = "1.39.0";

export const LUCIDE_INDEX_URL = `https://cdn.jsdelivr.net/npm/lucide-static@${LUCIDE_VERSION}/tags.json`;
export const LUCIDE_ICON_BASE = `https://cdn.jsdelivr.net/npm/lucide-static@${LUCIDE_VERSION}/icons/`;

export const ICONIFY_HOST = "https://api.iconify.design";

export const LOGOS_PREFIX = "logos";
// Catalog sources served by Iconify; each one is also its Iconify prefix.
export const ICONIFY_SETS = [LOGOS_PREFIX, "gcp", "k8s"] as const;
