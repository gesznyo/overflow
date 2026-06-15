using System.Text.RegularExpressions;
using Contracts;
using Typesense;

namespace SearchService.MessageHandlers;

public class QuestionUpdatedHandler(ITypesenseClient client)
{
    public async Task HandleAsync(QuestionUpdated message)
    {
        // This is a partial update, not change other properties values
        await client.UpdateDocument(collection: "questions", message.QuestionId, document: new
        {
            message.Title,
            Content = StripHtml(message.Content),
            Tags = message.Tags.ToArray()
        });
    }
    
    private static string StripHtml(string content) => 
        Regex.Replace(content, "<.*?>", string.Empty);
}