// Usage: node scripts/build-azure.mjs <dir>/Azure_Public_Service_Icons/Icons
// <dir> is the unzipped Azure_Public_Service_Icons_V24.zip from
// https://learn.microsoft.com/en-us/azure/architecture/icons/ . Node built-ins only.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ZIP_VERSION = "V24";
const OUT = join(
    dirname(fileURLToPath(import.meta.url)),
    "..",
    "src",
    "azure-icons.ts"
);

// slug: the file name without its numeric ID and "-icon-service-", lowercased.
// file: relative to Icons/. Several folders hold byte-identical copies of one icon; any copy will do.
// title: the service's current Microsoft product name. Where the file name is a resource name or out of date
// (Function Apps, Cognitive Search), the title is the product it belongs to.
const ICONS = [
    // compute and apps
    {
        slug: "virtual-machine",
        file: "compute/10021-icon-service-Virtual-Machine.svg",
        title: "Azure Virtual Machines",
    },
    {
        slug: "app-services",
        file: "compute/10035-icon-service-App-Services.svg",
        title: "Azure App Service",
    },
    {
        slug: "function-apps",
        file: "compute/10029-icon-service-Function-Apps.svg",
        title: "Azure Functions",
    },
    {
        slug: "kubernetes-services",
        file: "compute/10023-icon-service-Kubernetes-Services.svg",
        title: "Azure Kubernetes Service",
    },
    {
        slug: "container-instances",
        file: "compute/10104-icon-service-Container-Instances.svg",
        title: "Azure Container Instances",
    },
    {
        slug: "container-registries",
        file: "containers/10105-icon-service-Container-Registries.svg",
        title: "Azure Container Registry",
    },
    {
        // The zip has no plain Container Apps icon; this is the one Microsoft draws for the service.
        slug: "container-apps-environments",
        file: "other/02989-icon-service-Container-Apps-Environments.svg",
        title: "Azure Container Apps",
    },
    {
        slug: "static-apps",
        file: "web/01007-icon-service-Static-Apps.svg",
        title: "Azure Static Web Apps",
    },
    {
        slug: "batch-accounts",
        file: "compute/10031-icon-service-Batch-Accounts.svg",
        title: "Azure Batch",
    },
    // storage and databases
    {
        slug: "storage-accounts",
        file: "storage/10086-icon-service-Storage-Accounts.svg",
        title: "Azure Storage Account",
    },
    {
        slug: "blob-block",
        file: "general/10780-icon-service-Blob-Block.svg",
        title: "Azure Blob Storage",
    },
    {
        slug: "disks",
        file: "compute/10032-icon-service-Disks.svg",
        title: "Azure Managed Disks",
    },
    {
        slug: "backup-vault",
        file: "other/02361-icon-service-Backup-Vault.svg",
        title: "Azure Backup",
    },
    {
        slug: "azure-cosmos-db",
        file: "databases/10121-icon-service-Azure-Cosmos-DB.svg",
        title: "Azure Cosmos DB",
    },
    {
        slug: "sql-database",
        file: "databases/10130-icon-service-SQL-Database.svg",
        title: "Azure SQL Database",
    },
    {
        slug: "azure-database-postgresql-server",
        file: "databases/10131-icon-service-Azure-Database-PostgreSQL-Server.svg",
        title: "Azure Database for PostgreSQL",
    },
    {
        slug: "azure-database-mysql-server",
        file: "databases/10122-icon-service-Azure-Database-MySQL-Server.svg",
        title: "Azure Database for MySQL",
    },
    {
        slug: "cache-redis",
        file: "databases/10137-icon-service-Cache-Redis.svg",
        title: "Azure Cache for Redis",
    },
    // messaging and integration
    {
        slug: "azure-service-bus",
        file: "integration/10836-icon-service-Azure-Service-Bus.svg",
        title: "Azure Service Bus",
    },
    {
        slug: "event-hubs",
        file: "analytics/00039-icon-service-Event-Hubs.svg",
        title: "Azure Event Hubs",
    },
    {
        // The zip has no plain Event Grid icon; Topics is the one Microsoft draws for the service.
        slug: "event-grid-topics",
        file: "integration/10206-icon-service-Event-Grid-Topics.svg",
        title: "Azure Event Grid",
    },
    {
        slug: "logic-apps",
        file: "integration/02631-icon-service-Logic-Apps.svg",
        title: "Azure Logic Apps",
    },
    {
        slug: "api-management-services",
        file: "integration/10042-icon-service-API-Management-Services.svg",
        title: "Azure API Management",
    },
    {
        slug: "signalr",
        file: "web/10052-icon-service-SignalR.svg",
        title: "Azure SignalR Service",
    },
    {
        slug: "notification-hubs",
        file: "app services/10045-icon-service-Notification-Hubs.svg",
        title: "Azure Notification Hubs",
    },
    // networking
    {
        slug: "front-door-and-cdn-profiles",
        file: "networking/10073-icon-service-Front-Door-and-CDN-Profiles.svg",
        title: "Azure Front Door",
    },
    {
        slug: "application-gateways",
        file: "networking/10076-icon-service-Application-Gateways.svg",
        title: "Azure Application Gateway",
    },
    {
        slug: "load-balancers",
        file: "networking/10062-icon-service-Load-Balancers.svg",
        title: "Azure Load Balancer",
    },
    {
        slug: "virtual-networks",
        file: "networking/10061-icon-service-Virtual-Networks.svg",
        title: "Azure Virtual Network",
    },
    {
        slug: "dns-zones",
        file: "networking/10064-icon-service-DNS-Zones.svg",
        title: "Azure DNS",
    },
    {
        slug: "firewalls",
        file: "networking/10084-icon-service-Firewalls.svg",
        title: "Azure Firewall",
    },
    {
        slug: "cdn-profiles",
        file: "networking/00056-icon-service-CDN-Profiles.svg",
        title: "Azure CDN",
    },
    {
        slug: "virtual-network-gateways",
        file: "networking/10063-icon-service-Virtual-Network-Gateways.svg",
        title: "Azure VPN Gateway",
    },
    {
        slug: "expressroute-circuits",
        file: "networking/10079-icon-service-ExpressRoute-Circuits.svg",
        title: "Azure ExpressRoute",
    },
    {
        slug: "private-link",
        file: "networking/00427-icon-service-Private-Link.svg",
        title: "Azure Private Link",
    },
    {
        slug: "nat",
        file: "networking/10310-icon-service-NAT.svg",
        title: "Azure NAT Gateway",
    },
    {
        slug: "traffic-manager-profiles",
        file: "networking/10065-icon-service-Traffic-Manager-Profiles.svg",
        title: "Azure Traffic Manager",
    },
    {
        slug: "bastions",
        file: "networking/02422-icon-service-Bastions.svg",
        title: "Azure Bastion",
    },
    // security and identity
    {
        slug: "key-vaults",
        file: "security/10245-icon-service-Key-Vaults.svg",
        title: "Azure Key Vault",
    },
    {
        slug: "entra-managed-identities",
        file: "identity/10227-icon-service-Entra-Managed-Identities.svg",
        title: "Managed Identities",
    },
    {
        slug: "azure-sentinel",
        file: "security/10248-icon-service-Azure-Sentinel.svg",
        title: "Microsoft Sentinel",
    },
    {
        slug: "microsoft-defender-for-cloud",
        file: "security/10241-icon-service-Microsoft-Defender-for-Cloud.svg",
        title: "Microsoft Defender for Cloud",
    },
    // monitoring and governance
    {
        slug: "monitor",
        file: "monitor/00001-icon-service-Monitor.svg",
        title: "Azure Monitor",
    },
    {
        slug: "application-insights",
        file: "monitor/00012-icon-service-Application-Insights.svg",
        title: "Application Insights",
    },
    {
        slug: "log-analytics-workspaces",
        file: "monitor/00009-icon-service-Log-Analytics-Workspaces.svg",
        title: "Log Analytics Workspace",
    },
    {
        slug: "policy",
        file: "management + governance/10316-icon-service-Policy.svg",
        title: "Azure Policy",
    },
    {
        slug: "resource-groups",
        file: "general/10007-icon-service-Resource-Groups.svg",
        title: "Resource Group",
    },
    {
        slug: "subscriptions",
        file: "general/10002-icon-service-Subscriptions.svg",
        title: "Subscription",
    },
    // data and AI
    {
        slug: "azure-synapse-analytics",
        file: "analytics/00606-icon-service-Azure-Synapse-Analytics.svg",
        title: "Azure Synapse Analytics",
    },
    {
        slug: "data-factories",
        file: "analytics/10126-icon-service-Data-Factories.svg",
        title: "Azure Data Factory",
    },
    {
        slug: "azure-databricks",
        file: "analytics/10787-icon-service-Azure-Databricks.svg",
        title: "Azure Databricks",
    },
    {
        slug: "stream-analytics-jobs",
        file: "analytics/00042-icon-service-Stream-Analytics-Jobs.svg",
        title: "Azure Stream Analytics",
    },
    {
        slug: "azure-data-explorer-clusters",
        file: "analytics/10145-icon-service-Azure-Data-Explorer-Clusters.svg",
        title: "Azure Data Explorer",
    },
    {
        // Microsoft's current Azure Machine Learning icon; "Machine-Learning" (10166) is the older beaker.
        slug: "azure-machine-learning",
        file: "ai + machine learning/038470510-icon-service-Azure-Machine-Learning.svg",
        title: "Azure Machine Learning",
    },
    {
        slug: "azure-openai",
        file: "ai + machine learning/03438-icon-service-Azure-OpenAI.svg",
        title: "Azure OpenAI",
    },
    {
        slug: "cognitive-search",
        file: "ai + machine learning/10044-icon-service-Cognitive-Search.svg",
        title: "Azure AI Search",
    },
    {
        slug: "cognitive-services",
        file: "ai + machine learning/10162-icon-service-Cognitive-Services.svg",
        title: "Azure AI services",
    },
    // IoT and DevOps
    {
        slug: "iot-hub",
        file: "iot/10182-icon-service-IoT-Hub.svg",
        title: "Azure IoT Hub",
    },
    {
        slug: "azure-devops",
        file: "devops/10261-icon-service-Azure-DevOps.svg",
        title: "Azure DevOps",
    },
];

const SLUG = /^[a-z0-9-]+$/;
const FILE_NAME = /(?:^|\/)\d+-icon-service-([^/]+)\.svg$/;
const BOM = /^﻿/;
const XML_DECLARATION = /<\?xml[\s\S]*?\?>/gi;
const COMMENT = /<!--[\s\S]*?-->/g;
const SCRIPT = /<script\b[^>]*\/>|<script\b[\s\S]*?<\/script>/gi;
// Microsoft's internal names (e.g. "Icon-compute-21"), which would show as hover tooltips when painted inline.
const TITLE = /<title\b[^>]*\/>|<title\b[\s\S]*?<\/title>/gi;
const EVENT_HANDLER = /\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;
const VIEW_BOX = /\sviewBox\s*=\s*(?:"([^"]*)"|'([^']*)')/;

function clean(source) {
    return source
        .replace(BOM, "")
        .replace(XML_DECLARATION, "")
        .replace(COMMENT, "")
        .replace(SCRIPT, "")
        .replace(TITLE, "")
        .replace(EVENT_HANDLER, "")
        .replace(/>\s*[\r\n]+\s*</g, "><")
        .replace(/\s*[\r\n]+\s*/g, " ")
        .trim();
}

function hasPositiveViewBox(svg) {
    const root = /<svg\b[^>]*>/i.exec(svg)?.[0] ?? "";
    const match = VIEW_BOX.exec(root);
    const parts = (match?.[1] ?? match?.[2] ?? "")
        .trim()
        .split(/[\s,]+/)
        .map(Number);
    return (
        parts.length === 4 &&
        parts.every(Number.isFinite) &&
        parts[2] > 0 &&
        parts[3] > 0
    );
}

// Quotes a string the way Prettier does (double quotes unless that needs more escapes),
// so the generated file needs no formatting pass.
function literal(text) {
    const doubles = text.split('"').length - 1;
    const singles = text.split("'").length - 1;
    const quote = doubles > singles ? "'" : '"';
    return (
        quote +
        text.replaceAll("\\", "\\\\").replaceAll(quote, `\\${quote}`) +
        quote
    );
}

// Prettier drops the quotes from keys that are plain identifiers.
function key(slug) {
    return /^[a-z][a-z0-9]*$/.test(slug) ? slug : literal(slug);
}

function build(iconsDir) {
    const problems = [];
    const seen = new Set();
    const entries = [];
    for (const { slug, file, title } of ICONS) {
        if (!SLUG.test(slug)) problems.push(`${slug}: not a plain slug`);
        if (seen.has(slug)) problems.push(`${slug}: listed twice`);
        seen.add(slug);
        if (FILE_NAME.exec(file)?.[1].toLowerCase() !== slug) {
            problems.push(`${slug}: ${file} does not give that slug`);
            continue;
        }
        let svg;
        try {
            svg = clean(readFileSync(join(iconsDir, file), "utf8"));
        } catch (error) {
            problems.push(`${slug}: cannot read ${file} (${error.code})`);
            continue;
        }
        if (!svg.startsWith("<svg") || !hasPositiveViewBox(svg)) {
            problems.push(`${slug}: ${file} has no positive viewBox`);
            continue;
        }
        entries.push({ slug, title, svg });
    }
    return { entries, problems };
}

const iconsDir = process.argv[2];
if (!iconsDir) {
    console.error(
        "Usage: node scripts/build-azure.mjs <dir>/Azure_Public_Service_Icons/Icons"
    );
    process.exit(2);
}

const { entries, problems } = build(iconsDir);
if (problems.length > 0) {
    for (const problem of problems) console.error(`✗ ${problem}`);
    process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const source =
    `// GENERATED by scripts/build-azure.mjs from Azure_Public_Service_Icons_${ZIP_VERSION}.zip on ${today}. Do not edit.\n` +
    `// The icons in this file are © Microsoft Corporation and are NOT covered by this repository's\n` +
    `// MIT licence. Microsoft permits their use only in architectural diagrams, training materials\n` +
    `// and documentation: https://learn.microsoft.com/en-us/azure/architecture/icons/\n` +
    `\n` +
    `export type AzureIcon = { title: string; svg: string };\n` +
    `\n` +
    `export const AZURE_ICONS: Readonly<Record<string, AzureIcon>> = {\n` +
    entries
        .map(
            ({ slug, title, svg }) =>
                `    ${key(slug)}: {\n` +
                `        title: ${literal(title)},\n` +
                `        svg: ${literal(svg)},\n` +
                `    },\n`
        )
        .join("") +
    `};\n`;

writeFileSync(OUT, source);
const bytes = entries.reduce((sum, { svg }) => sum + Buffer.byteLength(svg), 0);
console.log(
    `✓ Wrote ${entries.length} Azure icons (${bytes} bytes of SVG) to src/azure-icons.ts`
);
