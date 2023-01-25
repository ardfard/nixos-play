# Nixos Play

This project is an example of deploying nixos to GCP.

## Setup

* install Pulumi
* install nix (for building custom nixos image)
* make sure to using correct GCP credential
`gcloud config auth set account ardfarde@gmail.com`
* set the correct project 
`gcloud config set project cauraproj`
* setup application-default loging
`gcloud auth application-default login`
* to create the infrastructure
`pulumi up`

