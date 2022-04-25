import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

const region = "asia-southeast2"
const zone = `${region}-a`

const imageBucketLocation = "ASIA-SOUTHEAST2"

const imageBucket = new gcp.storage.Bucket("cauraproj-nixos-images-gcp", {
    location: imageBucketLocation,
    name: "cauraproj-nixos-images-gcp",
    uniformBucketLevelAccess: true

})

const vpc = new gcp.compute.Network("vpc-nixos", {
    autoCreateSubnetworks: false
})

const subnets = new gcp.compute.Subnetwork("subnet-jakarta", {
    network: vpc.id,
    region: region,
    ipCidrRange: "172.20.1.0/24",
})

const firewall = new gcp.compute.Firewall("allow-ssh", 
{
    network: vpc.name,
    direction: "INGRESS",
    priority: 1000,
    allows: [
        {
            protocol: "tcp",
            ports: [
                "22"
            ]
        },
    ],
    targetTags: ["allow-ssh"],
    sourceRanges: ["0.0.0.0/0"]
})

const image = new gcp.compute.Image("nixos-21-05", {
    rawDisk: {
        source: "https://storage.cloud.google.com/cauraproj-nixos-images-gcp/nixos-image-21.11.337209.c254b8c915a-x86_64-linux.raw.tar.gz",
    },
    description: "nixos-image-21.11.337209",
    family: "nixos",
})

const serviceAccount = new gcp.serviceaccount.Account("nixos-sa", {
    accountId: "nixos-sa",
    displayName: "nixos-play-sa"
})

// Create a compute resource
const nixosVm = new gcp.compute.Instance("nixos-play", {
    name: "nixos-play",
    machineType: "f1-micro",
    zone: zone,
    bootDisk: {
        initializeParams: {
            image: image.selfLink,
            size: 40
        },
    },
    networkInterfaces: [{
        subnetwork: subnets.selfLink,
        accessConfigs: [{}]
    }],
    serviceAccount: {
        email: serviceAccount.email,
        scopes: ["cloud-platform"]
    },
    metadata: {
        "enable-oslogin": "TRUE"
    },
    tags: ["allow-ssh"],
    allowStoppingForUpdate: true
})

// Export the DNS name of the bucket
export const bucketName = imageBucket.url
export const nixosVmName = nixosVm.name
export const nixosVmPublicIP = nixosVm.networkInterfaces[0].accessConfigs
