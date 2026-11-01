import assert from "node:assert/strict";
import { test } from "node:test";
import { AZURE_ICONS } from "../src/azure-icons";
import { CATEGORIES, titleFor } from "../src/catalog";

const NAME = /^[a-z0-9-]+$/;

test("every category has icons with plain names", () => {
    for (const group of CATEGORIES) {
        assert.ok(group.names.length > 0, `${group.title} is empty`);
        for (const name of group.names) {
            assert.match(name, NAME, `${group.title}: ${name}`);
        }
    }
});

test("no name appears twice within or across categories", () => {
    const seen = new Map<string, string>();
    for (const group of CATEGORIES) {
        for (const name of group.names) {
            const key = `${group.source}:${name}`;
            assert.ok(
                !seen.has(key),
                `${name} is in ${seen.get(key)} and ${group.title}`
            );
            seen.set(key, group.title);
        }
    }
});

test("titleFor uses the override map before the acronym map", () => {
    assert.equal(titleFor("postgresql"), "PostgreSQL");
    assert.equal(titleFor("nodejs"), "Node.js");
    assert.equal(titleFor("c-sharp"), "C#");
    assert.equal(titleFor("github-actions"), "GitHub Actions");
});

test("titleFor upper-cases acronyms and title-cases other words", () => {
    assert.equal(titleFor("aws-lambda"), "AWS Lambda");
    assert.equal(titleFor("aws-s3"), "AWS S3");
    assert.equal(titleFor("google-cloud-run"), "Google Cloud Run");
    assert.equal(titleFor("hard-drive"), "Hard Drive");
});

test("titleFor drops a trailing -icon", () => {
    assert.equal(titleFor("docker-icon"), "Docker");
    assert.equal(titleFor("mongodb-icon"), "MongoDB");
    assert.equal(titleFor("icon"), "Icon");
});

test("titleFor works the same after a toString round trip", () => {
    const inlined = new Function(
        `return ${titleFor.toString()}`
    )() as typeof titleFor;
    for (const group of CATEGORIES) {
        for (const name of group.names) {
            assert.equal(inlined(name), titleFor(name));
        }
    }
});

test("gcp category lists the 60 core services", () => {
    const index = CATEGORIES.findIndex((group) => group.id === "gcp");
    assert.notEqual(index, -1, "no gcp category");
    const gcp = CATEGORIES[index];
    assert.equal(gcp.source, "gcp");
    assert.equal(gcp.names.length, 60);
    assert.equal(CATEGORIES[index - 1].id, "aws");
});

test("gcp labels use Google's product names", () => {
    assert.equal(titleFor("bigquery"), "BigQuery");
    assert.equal(titleFor("pubsub"), "Pub/Sub");
    assert.equal(titleFor("vertexai"), "Vertex AI");
    assert.equal(titleFor("cloud-sql"), "Cloud SQL");
    assert.equal(titleFor("cloud-nat"), "Cloud NAT");
    assert.equal(titleFor("cloud-vpn"), "Cloud VPN");
    assert.equal(titleFor("cloud-cdn"), "Cloud CDN");
    assert.equal(
        titleFor("google-kubernetes-engine"),
        "Google Kubernetes Engine"
    );
    assert.equal(
        titleFor("identity-and-access-management"),
        "Identity and Access Management"
    );
    assert.equal(titleFor("speech-to-text"), "Speech-to-Text");
    assert.equal(titleFor("text-to-speech"), "Text-to-Speech");
    assert.equal(titleFor("trace"), "Trace");
    assert.equal(titleFor("identity-aware-proxy"), "Identity-Aware Proxy");
});

test("azure category follows gcp and lists every generated icon", () => {
    const gcp = CATEGORIES.findIndex((group) => group.id === "gcp");
    const azure = CATEGORIES.findIndex((group) => group.id === "azure");
    assert.notEqual(azure, -1, "no azure category");
    assert.equal(azure, gcp + 1);
    assert.equal(CATEGORIES[azure].source, "azure");
    assert.deepEqual(CATEGORIES[azure].names, Object.keys(AZURE_ICONS));
});

test("kubernetes category lists all 38 icons after azure", () => {
    const azure = CATEGORIES.findIndex((group) => group.id === "azure");
    const k8s = CATEGORIES.findIndex((group) => group.id === "kubernetes");
    assert.notEqual(k8s, -1, "no kubernetes category");
    assert.equal(k8s, azure + 1);
    assert.equal(CATEGORIES[k8s].title, "Kubernetes");
    assert.equal(CATEGORIES[k8s].source, "k8s");
    assert.equal(CATEGORIES[k8s].names.length, 38);
});

test("kubernetes labels use kind spellings", () => {
    assert.equal(titleFor("statefulset"), "StatefulSet");
    assert.equal(titleFor("configmap"), "ConfigMap");
    assert.equal(titleFor("persistentvolumeclaim"), "PersistentVolumeClaim");
    assert.equal(
        titleFor("horizontalpodautoscaler"),
        "HorizontalPodAutoscaler"
    );
    assert.equal(
        titleFor("customresourcedefinition"),
        "CustomResourceDefinition"
    );
    assert.equal(titleFor("clusterrolebinding"), "ClusterRoleBinding");
    assert.equal(titleFor("serviceaccount"), "ServiceAccount");
    assert.equal(titleFor("api-server"), "API Server");
    assert.equal(titleFor("etcd-cluster"), "etcd");
    assert.equal(titleFor("kubelet"), "kubelet");
    assert.equal(titleFor("kube-proxy"), "kube-proxy");
    assert.equal(titleFor("worker-node"), "Worker Node");
    assert.equal(titleFor("pod"), "Pod");
    assert.equal(titleFor("replicaset"), "ReplicaSet");
    assert.equal(titleFor("daemonset"), "DaemonSet");
    assert.equal(titleFor("cronjob"), "CronJob");
    assert.equal(titleFor("networkpolicy"), "NetworkPolicy");
    assert.equal(titleFor("persistentvolume"), "PersistentVolume");
    assert.equal(titleFor("storageclass"), "StorageClass");
    assert.equal(titleFor("clusterrole"), "ClusterRole");
    assert.equal(titleFor("rolebinding"), "RoleBinding");
    assert.equal(titleFor("podsecuritypolicy"), "PodSecurityPolicy");
    assert.equal(titleFor("resourcequota"), "ResourceQuota");
    assert.equal(titleFor("limitrange"), "LimitRange");
    assert.equal(titleFor("controller-manager"), "Controller Manager");
    assert.equal(
        titleFor("cloud-controller-manager"),
        "Cloud Controller Manager"
    );
});
