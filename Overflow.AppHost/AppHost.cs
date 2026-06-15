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

var typeSenseApKey = builder
    .AddParameter(name: "typesense-api-key", secret: true);

var typesense = builder.
    AddContainer(name: "typesense", image: "typesense/typesense","30.2")
    .WithArgs("--data-dir", "/data", "--api-key", typeSenseApKey, "--enable-cors")
    .WithVolume(name: "typesense-data", target: "/data")
    .WithHttpEndpoint(port: 8108, targetPort: 8108, name: "typesense");

var typesenseContainer = typesense.GetEndpoint(name: "typesense");

var questionDb = postgres.AddDatabase("questionDb");

var rabbitmq = builder
    .AddRabbitMQ(name: "messaging", port: 5672)
    .WithDataVolume("rabbitmq-data")
    .WithManagementPlugin(port: 15672)
    .WithOtlpExporter()
    .WithoutHttpsCertificate();

var questionService = builder
    .AddProject<Projects.QuestionService>(name: "question-svc")
    .WithReference(keycloak)
    .WithReference(questionDb)
    .WithReference(rabbitmq)
    .WaitFor(keycloak)
    .WaitFor(questionDb)
    .WaitFor(rabbitmq);

var searchService = builder
    .AddProject<Projects.SearchService>(name: "search-svc")
    .WithEnvironment(name: "typesense-api-key", typeSenseApKey)
    .WithReference(typesenseContainer)
    .WithReference(rabbitmq)
    .WaitFor(typesense)
    .WaitFor(rabbitmq);

builder.Build().Run();