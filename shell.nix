{ pkgs ? import <nixpkgs> {} }:

with pkgs;
pkgs.mkShell {
  nativeBuildInputs = [
    pulumi-bin
  ];
}
