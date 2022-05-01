{modulesPath, pkgs, ...}:
{
    imports = ["${modulesPath}/virtualisation/google-compute-image.nix"];

    virtualisation.docker.enable = true;

    environment.systemPackages = [ pkgs.python];
}