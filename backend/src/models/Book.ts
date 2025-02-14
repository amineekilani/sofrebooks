import mongoose from "mongoose";
import fetch from "node-fetch";

export enum BookCategory
{
    Fiction="Fiction",
    NonFiction="Non-fiction",
    Educational="Éducatif et académique",
    Children="Enfants et jeunes adultes",
    Comics="Bandes dessinées et romans graphiques",
    Religious="Religieux et spirituel",
    Science="Sciences et technologies",
    Business="Affaires et économie",
    SelfHelp="Développement personnel et autonomie",
    Lifestyle="Loisirs et style de vie"
}

const bookSchema=new mongoose.Schema
(
    {
        title: { type: String, required: true },
        author: { type: String, required: true },
        category: { type: String, enum: Object.values(BookCategory), required: true },
        isbn: { type: String, required: true },
        publisher: { type: String, required: true },
        publicationYear: { type: Number, required: true },
        isAvailable: { type: Boolean, required: true, default: true },
        loans: { type: [mongoose.Schema.Types.ObjectId], ref: "LoanRequest", default: [] },
        likes: { type: Number, required: true, default: 0 },
        neutral: { type: Number, required: true, default: 0 },
        dislikes: { type: Number, required: true, default: 0 },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        borrower: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
        summary: { type: String, default: "" }
    },
    {
        timestamps: true
    }
);

async function generateSummary(title: string, author: string): Promise<string>
{
    try
    {
        const response=await fetch("https://openrouter.ai/api/v1/chat/completions",
        {
            method: "POST",
            headers:
            {
                "Authorization": `Bearer ${process.env.AI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify
            (
                {
                    "model": "deepseek/deepseek-r1",
                    "messages": [
                    {
                        "role": "user",
                        "content": `Generate a short summary of the book "${title}" by ${author}. In your response, do not include any titles or formatting—just start directly with plain text.`
                    }]
                }
            )
        });
        const data=await response.json();
        return data.choices[0]?.message?.content?.trim() || "Summary unavailable.";
    }
    catch (error)
    {
        console.error("Error generating book summary:", error);
        return "Summary unavailable.";
    }
}
bookSchema.pre("save", async function (next)
{
    if (!this.summary)
    {
        this.summary=await generateSummary(this.title, this.author);
    }
    next();
});

export default mongoose.model("Book", bookSchema);