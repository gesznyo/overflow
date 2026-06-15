using System.Text.RegularExpressions;
using Contracts;
using SearchService.Models;
using Typesense;

namespace SearchService.MessageHandlers;

public class QuestionCreatedHandler(ITypesenseClient client)
{
    public async Task HandleAsync(QuestionCreated message)
    {
        var created = new DateTimeOffset(message.Created).ToUnixTimeSeconds();

        var doc = new SearchQuestion()
        {
            Id = message.QuestionId,
            Title = message.Title,
            Content = StripHtml(message.Content),
            CreatedAt = created,
            Tags = message.Tags.ToArray()
        };
        await client.CreateDocument(collection: "questions", doc);
        
        Console.WriteLine("Question created with id: {0}", message.QuestionId);
    }

    private static string StripHtml(string content) => 
        Regex.Replace(content, "<.*?>", string.Empty);
}