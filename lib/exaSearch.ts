import Exa from "exa-js";

// Initialize the Exa client
// It will automatically look for process.env.EXA_API_KEY
const exa = new Exa(process.env.EXA_API_KEY as string);

export async function searchLiveCreditCardData(userQuery: string): Promise<string> {
  try {
    // Search and immediately get the contents of the pages
    const response = await exa.searchAndContents(userQuery, {
      type: "auto",
      numResults: 3,
      highlights: true, // Pulls just the most relevant snippets to save tokens
      category: "personal site" 
    });

    // Format the output to feed into MyAI3
    let context = "";
    for (const result of response.results) {
      context += `Source: ${result.title} (${result.url})\n`;
      // Safely check if highlights exist before appending
      if (result.highlights && result.highlights.length > 0) {
        context += `Relevant Info: ${result.highlights[0]}\n\n`;
      }
    }
    
    return context;
  } catch (error) {
    console.error("Failed to fetch data from Exa:", error);
    return "Error: Could not retrieve live data.";
  }
}
