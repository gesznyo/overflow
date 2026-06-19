using Microsoft.Extensions.Hosting;

#pragma warning disable ASPIRECERTIFICATES001
var builder = DistributedApplication.CreateBuilder(args);

var compose = builder
    .AddDockerComposeEnvironment("production")
    .WithDashboard(dashboard => dashboard.WithHostPort(8080));

var keycloak = builder
    .AddKeycloak(name:"keycloak", port: 6001)
    .WithArgs(context =>
    {
        // Clear the default 'start' argument injected by Aspire during deployment
        context.Args.Clear(); 
        // Force the development mode argument
        context.Args.Add("start-dev");
        // RE-ADD the import realm flag that was cleared
        context.Args.Add("--import-realm");
    })
    .WithDataVolume("keycloak-data")
    .WithRealmImport("../infra/realms")
    .WithEnvironment("KC_HTTP", "true")
    .WithEnvironment("KC_HOSTNAME_STRICT", "false")
    .WithOtlpExporter()
    .WithoutHttpsCertificate()
    .WithEnvironment(name: "VIRTUAL_HOST", "id.overflow.local")
    .WithEnvironment(name: "VIRTUAL_PORT", "8080");

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
    .WithVolume(name: "typesense-data", target: "/data")
    .WithEnvironment("TYPESENSE_DATA_DIR", "/data")
    .WithEnvironment("TYPESENSE_ENABLE_CORS", "true")
    .WithEnvironment("TYPESENSE_API_KEY", typeSenseApKey)
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

var yarp = builder.AddYarp("gateway")
    .WithConfiguration(yarpBuilder =>
    {
        yarpBuilder.AddRoute("/questions/{**catch-all}", questionService);
        yarpBuilder.AddRoute("/tags/{**catch-all}", questionService);
        yarpBuilder.AddRoute("/search/{**catch-all}", searchService);
    })
    .WithHostPort(8001)
    .WithEndpoint(port: 8001, targetPort: 8001, scheme: "http", name: "gateway", isExternal: true)
    .WithEnvironment(name: "ASPNETCORE_URLS", "http://*:8001")
    .WithEnvironment(name: "VIRTUAL_HOST", "api.overflow.local")
    .WithEnvironment(name: "VIRTUAL_PORT", "8001");

if (!builder.Environment.IsDevelopment())
{
    builder.AddContainer("nginx-proxy", "nginxproxy/nginx-proxy", "1.11")
        .WithEndpoint(port: 80, targetPort:80, "nginx", isExternal: true)
        .WithBindMount(source: "/var/run/docker.sock", target: "/tmp/docker.sock", isReadOnly: true);
}

builder.Build().Run();