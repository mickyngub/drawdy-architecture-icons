import type {
    DrawdyElementSchema,
    DriverCommandIssuer,
    DriverManifest,
    DriverModule,
    ModuleStyling,
} from "@drawdy/driver-protocol";
import type {
    DriverToWebview,
    IconPick,
    IconRef,
    IconSize,
    PersistedState,
    PlaceOptions,
    StrokeWidth,
    WebviewToDriver,
} from "./shared/messages";
import { labelSpot, nextInsertSpot, type InsertRun } from "./layout";
import { LOGOS_PREFIX } from "./sources";
import { finalizeIconSvg, isMonochrome, toSvgDataUrl } from "./svg";
import { WEBVIEW_HTML } from "./webview-html";

// Drawdy shows this through <img>, where currentColor is black, so the art is a full-colour PNG.
const ACTION_BUTTON_SVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="18" height="18"><image href="data:image/png;base64,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" x="1" y="1" width="22" height="22"/></svg>`;

const STATE_KEY = "recent";
const RECENT_LIMIT = 12;
const SIZES: readonly IconSize[] = [32, 64, 128, 256];
const STROKES: readonly StrokeWidth[] = [1.5, 2, 2.75];
const CUSTOM_COLOR = /^#[0-9a-fA-F]{6}$/;
const ICONIFY_NAME = new RegExp(`^${LOGOS_PREFIX}:[a-z0-9-]+$`);
const DEFAULT_OPTIONS: PlaceOptions = {
    size: 64,
    color: "ink",
    stroke: 2,
    label: true,
};

let requestId = 0;

let driver: {
    manifest: DriverManifest;
    issueCommand: DriverCommandIssuer;
    generateId: () => string;
    styling: ModuleStyling;
    actionButtonId: string;
    webviewId: string;
    webviewHtml: string | null;
    state: PersistedState;
    insertRun: InsertRun | null;
} | null = null;

const nextRequestId = (): string => String(requestId++);

function stylingCssVars(styling: ModuleStyling): string {
    return Object.entries(styling)
        .map(([key, value]) =>
            key === "theme"
                ? `color-scheme: ${value};`
                : `--drawdy-${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}: ${value};`
        )
        .join("");
}

function post(message: DriverToWebview): void {
    if (!driver) return;
    void driver.issueCommand({
        type: "command:webview:post-message",
        driverId: driver.manifest.driverId,
        requestId: nextRequestId(),
        req: { webviewDomId: driver.webviewId, message },
    });
}

function isIconRef(value: unknown): value is IconRef {
    if (typeof value !== "object" || value === null) return false;
    const ref = value as Record<string, unknown>;
    if (
        typeof ref.name !== "string" ||
        ref.name.length === 0 ||
        typeof ref.title !== "string"
    ) {
        return false;
    }
    if (ref.source === "lucide") return true;
    return ref.source === "iconify" && ICONIFY_NAME.test(ref.name);
}

function toRef(icon: IconRef): IconRef {
    return { source: icon.source, name: icon.name, title: icon.title };
}

function oneOf<T>(list: readonly T[], value: unknown, fallback: T): T {
    return list.includes(value as T) ? (value as T) : fallback;
}

function readOptions(raw: unknown): PlaceOptions {
    const got =
        typeof raw === "object" && raw !== null
            ? (raw as Record<string, unknown>)
            : {};
    return {
        size: oneOf(SIZES, got.size, DEFAULT_OPTIONS.size),
        color:
            typeof got.color === "string" && CUSTOM_COLOR.test(got.color)
                ? got.color
                : "ink",
        stroke: oneOf(STROKES, got.stroke, DEFAULT_OPTIONS.stroke),
        label:
            typeof got.label === "boolean" ? got.label : DEFAULT_OPTIONS.label,
    };
}

export function readState(
    got: Record<string, unknown> | undefined
): PersistedState {
    if (!got) return { recent: [], options: readOptions(null) };
    const raw = Array.isArray(got.recent) ? got.recent : [];
    const recent: IconRef[] = [];
    for (const entry of raw) {
        if (!isIconRef(entry)) continue;
        recent.push(toRef(entry));
        if (recent.length >= RECENT_LIMIT) break;
    }
    return { recent, options: readOptions(got.options) };
}

async function loadState(): Promise<PersistedState> {
    if (!driver) return readState(undefined);
    const res = await driver.issueCommand({
        type: "command:kv-storage:get",
        driverId: driver.manifest.driverId,
        requestId: nextRequestId(),
        req: { key: STATE_KEY },
    });
    if (res.res.error !== undefined) return readState(undefined);
    return readState(res.res.value.got);
}

async function saveState(state: PersistedState): Promise<void> {
    if (!driver) return;
    await driver.issueCommand({
        type: "command:kv-storage:set",
        driverId: driver.manifest.driverId,
        requestId: nextRequestId(),
        req: {
            key: STATE_KEY,
            payload: {
                recent: state.recent,
                options: state.options,
            },
        },
    });
}

export const activate: DriverModule["activate"] = async ({
    manifest,
    issueCommand,
    styling,
    generateId,
}) => {
    driver = {
        manifest,
        issueCommand,
        generateId,
        styling,
        actionButtonId: `${manifest.driverId}:action-button`,
        webviewId: `${manifest.driverId}:webview`,
        webviewHtml: null,
        state: readState(undefined),
        insertRun: null,
    };

    const created = await issueCommand({
        type: "command:dom:create-action-button",
        driverId: manifest.driverId,
        requestId: nextRequestId(),
        req: {
            domElementId: driver.actionButtonId,
            svg: ACTION_BUTTON_SVG,
        },
    });
    if (!created.res.value?.created) return;

    await issueCommand({
        type: "subscription:dom:theme-changed",
        driverId: manifest.driverId,
        requestId: nextRequestId(),
    });

    await issueCommand({
        type: "subscription:dom:element-clicked",
        driverId: manifest.driverId,
        requestId: nextRequestId(),
        req: { domElementId: driver.actionButtonId },
    });

    await issueCommand({
        type: "subscription:webview:message",
        driverId: manifest.driverId,
        requestId: nextRequestId(),
        req: { webviewDomId: driver.webviewId },
    });

    const restored = await loadState();
    if (!driver) return;
    driver.state = restored;
};

export const onEvent: DriverModule["onEvent"] = async (e) => {
    if (!driver) return;
    switch (e.type) {
        case "subscription:dom:theme-changed": {
            driver.styling = e.body.styling;
            post({ type: "theme", cssVars: stylingCssVars(driver.styling) });
            return;
        }
        case "subscription:dom:element-clicked": {
            if (e.body.domElementId !== driver.actionButtonId) return;
            if (driver.webviewHtml === null) {
                driver.webviewHtml = WEBVIEW_HTML.replace(
                    "/*__DRAWDY_STYLING__*/",
                    stylingCssVars(driver.styling)
                );
            }
            await driver.issueCommand({
                type: "command:webview:create",
                driverId: driver.manifest.driverId,
                requestId: nextRequestId(),
                req: {
                    webviewDomId: driver.webviewId,
                    htmlContent: driver.webviewHtml,
                    keepStateWhenClosed: true,
                },
            });
            return;
        }
        case "subscription:webview:message": {
            if (e.body.webviewDomId !== driver.webviewId) return;
            const message = e.body.message;
            if (typeof message !== "object" || message === null) return;
            await handleWebviewMessage(message as WebviewToDriver);
            return;
        }
        default: {
            return;
        }
    }
};

async function handleWebviewMessage(message: WebviewToDriver): Promise<void> {
    if (!driver) return;
    switch (message.type) {
        case "ready": {
            post({
                type: "init",
                recent: driver.state.recent,
                options: driver.state.options,
            });
            return;
        }
        case "drop-icon": {
            await placeIcon(message.icon, message.x, message.y);
            return;
        }
        case "insert-icon": {
            await insertInView(message.icon);
            return;
        }
        case "persist": {
            driver.state = readState({
                recent: message.recent,
                options: message.options,
            });
            await saveState(driver.state);
            return;
        }
        default: {
            return;
        }
    }
}

async function addIcon(
    icon: IconPick,
    centreX: number,
    centreY: number
): Promise<void> {
    if (!driver) return;
    const { options } = driver.state;
    const ink = driver.styling.foreground;
    const color = options.color === "ink" ? ink : options.color;
    const finished = finalizeIconSvg(icon, {
        size: options.size,
        color,
        stroke: options.stroke,
    });
    if (finished === null) return;

    const meta = {
        [driver.manifest.driverId]: {
            source: icon.source,
            name: icon.name,
        },
    };
    const top = centreY - finished.height / 2;
    const elements: DrawdyElementSchema[] = [
        {
            type: "image",
            drawdyElementId: driver.generateId(),
            url: toSvgDataUrl(finished.svg),
            x: centreX - finished.width / 2,
            y: top,
            width: finished.width,
            height: finished.height,
            meta,
        },
    ];
    if (options.label) {
        const spot = labelSpot(
            icon.title,
            options.size,
            centreX,
            top + finished.height
        );
        elements.push({
            type: "text",
            drawdyElementId: driver.generateId(),
            text: icon.title,
            x: spot.x,
            y: spot.y,
            fontSize: spot.fontSize,
            textAlign: "center",
            color: isMonochrome(icon) ? color : ink,
            meta,
        });
    }

    await driver.issueCommand({
        type: "command:scene:add-drawdy-elements",
        driverId: driver.manifest.driverId,
        requestId: nextRequestId(),
        req: { elements },
    });
}

async function placeIcon(
    icon: IconPick,
    iframeX: number,
    iframeY: number
): Promise<void> {
    if (!driver) return;

    const rectRes = await driver.issueCommand({
        type: "command:dom:element-rect",
        driverId: driver.manifest.driverId,
        requestId: nextRequestId(),
        req: { elementId: driver.webviewId },
    });
    if (!driver || rectRes.res.error !== undefined) return;
    const rect = rectRes.res.value;

    const insidePalette =
        iframeX >= 0 &&
        iframeY >= 0 &&
        iframeX <= rect.width &&
        iframeY <= rect.height;
    if (insidePalette) return;

    const canvasRes = await driver.issueCommand({
        type: "command:camera:screen-to-canvas",
        driverId: driver.manifest.driverId,
        requestId: nextRequestId(),
        req: { x: rect.x + iframeX, y: rect.y + iframeY },
    });
    if (!driver || canvasRes.res.error !== undefined) return;
    const { x, y } = canvasRes.res.value;

    await addIcon(icon, x, y);
}

async function insertInView(icon: IconPick): Promise<void> {
    if (!driver) return;
    const res = await driver.issueCommand({
        type: "command:camera:get-viewport-rect",
        driverId: driver.manifest.driverId,
        requestId: nextRequestId(),
    });
    if (!driver || res.res.error !== undefined) return;
    const { options } = driver.state;
    const spot = nextInsertSpot(
        driver.insertRun,
        res.res.value.rect,
        options.size,
        options.label
    );
    driver.insertRun = spot.run;
    await addIcon(icon, spot.x, spot.y);
}
