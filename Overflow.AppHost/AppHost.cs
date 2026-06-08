var builder = DistributedApplication.CreateBuilder(args);

var keycloak = builder
    .AddKeycloak(name:"keycloak", port: 6001)
    .WithDataVolume("keycloak-data");

builder.Build().Run();