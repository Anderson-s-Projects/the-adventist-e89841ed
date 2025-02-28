
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic } = await req.json();

    if (!topic) {
      return new Response(
        JSON.stringify({ error: 'Topic is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // This is a mock response since we don't have an actual AI integration yet
    // In a real implementation, you would call an AI service like OpenAI here
    const verses = {
      "prayer": [
        { reference: "Philippians 4:6-7", text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus." },
        { reference: "1 Thessalonians 5:16-18", text: "Rejoice always, pray continually, give thanks in all circumstances; for this is God's will for you in Christ Jesus." }
      ],
      "sabbath": [
        { reference: "Exodus 20:8-11", text: "Remember the Sabbath day by keeping it holy. Six days you shall labor and do all your work, but the seventh day is a sabbath to the Lord your God." },
        { reference: "Isaiah 58:13-14", text: "If you keep your feet from breaking the Sabbath and from doing as you please on my holy day, if you call the Sabbath a delight and the Lord's holy day honorable..." }
      ],
      "faith": [
        { reference: "Hebrews 11:1", text: "Now faith is confidence in what we hope for and assurance about what we do not see." },
        { reference: "Romans 10:17", text: "Consequently, faith comes from hearing the message, and the message is heard through the word about Christ." }
      ],
      "hope": [
        { reference: "Romans 15:13", text: "May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit." },
        { reference: "Jeremiah 29:11", text: "For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, plans to give you hope and a future." }
      ],
      "love": [
        { reference: "1 Corinthians 13:4-7", text: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking..." },
        { reference: "John 3:16", text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life." }
      ]
    };

    // Default response if topic doesn't match
    const defaultVerses = [
      { reference: "Psalm 119:105", text: "Your word is a lamp for my feet, a light on my path." },
      { reference: "Proverbs 3:5-6", text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight." }
    ];

    // Get verses for the requested topic or use default
    const topicVerses = verses[topic as keyof typeof verses] || defaultVerses;

    // Add a slight delay to simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 500));

    return new Response(
      JSON.stringify({ 
        verses: topicVerses,
        topic: topic 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
