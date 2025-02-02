// moderation.ts

export async function scanContentForModeration(content: string): Promise<{ flagged: boolean; reasons?: string[] }> {
    try {
      const response = await fetch('/api/moderation', { // Adjust this endpoint as needed
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
      });
  
      if (!response.ok) {
        console.error('Moderation API request failed', response.statusText);
        return { flagged: true, reasons: ['Moderation request failed. Please try again.'] };
      }
  
      const result = await response.json();
      return result.flagged ? { flagged: true, reasons: result.reasons || [] } : { flagged: false };
  
    } catch (error) {
      console.error('Error scanning content for moderation:', error);
      return { flagged: true, reasons: ['An error occurred while processing your request.'] };
    }
  }
  