#pragma warning disable ASPIRECERTIFICATES001
var builder = DistributedApplication.CreateBuilder(args);

var keycloak = builder
    .AddKeycloak(name:"keycloak", port: 6001)
    .WithDataVolume("keycloak-data")
    .WithOtlpExporter()
    .WithoutHttpsCertificate();

var postgres = builder
    .AddPostgres(name: "postgres", port: 5432)
    .WithDataVolume("postgres-data")
    .WithOtlpExporter()
    .WithoutHttpsCertificate()
    .WithPgAdmin();

var questionDb = postgres.AddDatabase("questionDb");

var questionService = builder
    .AddProject<Projects.QuestionService>(name: "question-svc")
    .WithReference(keycloak)
    .WithReference(questionDb)
    .WaitFor(keycloak)
    .WaitFor(questionDb);

builder.Build().Run();