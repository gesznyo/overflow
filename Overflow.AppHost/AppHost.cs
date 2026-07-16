using Microsoft.Extensions.Hosting;
// ReSharper disable UnusedVariable

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


if (!builder.Environment.IsDevelopment())
{
    var yarp = builder.AddYarp("gateway")
        .WithConfiguration(yarpBuilder =>
        {
            yarpBuilder.AddRoute("/questions/{**catch-all}", questionService);
            yarpBuilder.AddRoute("/tags/{**catch-all}", questionService);
            yarpBuilder.AddRoute("/search/{**catch-all}", searchService);
            yarpBuilder.AddRoute("/test/{**catch-all}", questionService);
        })
        .WithEnvironment("ASPNETCORE_URLS", "http://*:8001")
        .WithEndpoint(port: 8001, scheme: "http", targetPort: 8001, name: "gateway", isExternal: true)
        .WithEnvironment("VIRTUAL_HOST", "api.overflow.local")
        .WithEnvironment("VIRTUAL_PORT", "8001");
}
else
{
    var yarp = builder.AddYarp("gateway")
        .WithConfiguration(yarpBuilder =>
        {
            yarpBuilder.AddRoute("/questions/{**catch-all}", questionService);
            yarpBuilder.AddRoute("/test/{**catch-all}", questionService);
            yarpBuilder.AddRoute("/tags/{**catch-all}", questionService);
            yarpBuilder.AddRoute("/search/{**catch-all}", searchService);
        })
        .WithHttpEndpoint(port: 8001, name: "http")
        .WithoutHttpsCertificate();
}


var webapp = builder
    .AddJavaScriptApp(name: "webapp", appDirectory: "../webapp")
    .WithReference(keycloak)
    .WithHttpEndpoint(env: "PORT", port: 3000, targetPort: 4000)
    .WithEnvironment(name: "VIRTUAL_HOST", "app.overflow.local")
    .WithEnvironment(name: "VIRTUAL_PORT", "4000")
    .PublishAsDockerFile();
    
if (!builder.Environment.IsDevelopment())
{
    builder.AddContainer("nginx-proxy", "nginxproxy/nginx-proxy", "1.11")
        .WithEndpoint(port: 80, targetPort:80, "nginx", isExternal: true)
        .WithEndpoint(port: 443, targetPort:443, "nginx-ssl", isExternal: true)
        .WithBindMount(source: "/var/run/docker.sock", target: "/tmp/docker.sock", isReadOnly: true)
        .WithBindMount(source: "../infra/devcerts", target: "/etc/nginx/certs", isReadOnly: true);
    
    keycloak.WithEnvironment("KC_HOSTNAME", "https://id.overflow.local")
        .WithEnvironment("KC_HOSTNAME_BACKCHANNEL_DYNAMIC", "true");
}

builder.Build().Run();