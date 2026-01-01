import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
        "HTTP-Referer": process.env.NEXTAUTH_URL || "http://localhost:3001",
        "X-Title": "New Tab AI",
    },
});

export const chatRouter = router({
    sendMessage: publicProcedure
        .input(
            z.object({
                message: z.string(),
                history: z.array(
                    z.object({
                        role: z.enum(["user", "assistant"]),
                        content: z.string(),
                    })
                ).optional(),
            })
        )
        .mutation(async ({ input }) => {
            try {
                const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
                    {
                        role: "system",
                        content: "You are a helpful AI assistant integrated into a Chrome new tab page. Be concise and helpful.",
                    },
                    ...(input.history || []),
                    {
                        role: "user",
                        content: input.message,
                    },
                ];

                console.log("Sending request to OpenRouter...");
                console.log("API Key configured:", !!process.env.OPENROUTER_API_KEY);

                const models = [
                    "openai/gpt-4o-mini",
                    "anthropic/claude-3-haiku",
                ];

                let lastError: any;

                for (const model of models) {
                    try {
                        console.log(`Attempting with model: ${model}`);
                        const completion = await openai.chat.completions.create({
                            model,
                            messages,
                            temperature: 0.7,
                            max_tokens: 500,
                        });

                        console.log(`Success with model: ${model}`);
                        return {
                            response: completion.choices[0].message.content || "Sorry, I couldn't generate a response.",
                        };
                    } catch (error: any) {
                        console.warn(`Failed with model ${model}:`, error.message);
                        lastError = error;
                        // Continue to next model if not the last one
                        if (model === models[models.length - 1]) throw error;
                    }
                }

                throw lastError;
            } catch (error: any) {
                console.error("OpenRouter API Error:", error);
                console.error("Error details:", {
                    message: error.message,
                    status: error.status,
                    type: error.type,
                });

                throw new Error(
                    error.message || "Failed to communicate with AI service. Please check your API key and try again."
                );
            }
        }),
});
