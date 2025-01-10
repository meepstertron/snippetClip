import { Hash } from "lucide-react";
import FeedComponent from "./components/feed";
import { useParams } from "react-router-dom";

let posts = [
    {
        id: 1,
        title: "Hello World",
        body: "This is a snippet of code that prints 'Hello World'",
        code: "console.log('Hello World')",
        language: "JavaScript",
        tags: ["example", "beginner"],
        upvotes: 10,
        copies: 5,
        author: "John Doe"
    },
    {
        id: 1,
        title: "Flask Example",
        body: "This is a snippet of code that prints 'Hello World'",
        code: "@app.route('/hello')\ndef hello():\n    return 'Hello, World!'",
        language: "python",
        tags: ["Flask", "beginner", "example"],
        upvotes: 7,
        copies: 60,
        author: "John Doe"
    }
];

function TagPage() {
    const { tag } = useParams<{ tag: string }>();

    return ( 
        <div className="m-0 p-0 h-screen w-screen">
            <div className="h-1/3 bg-muted flex items-center pl-6">
                <div className="bg-blue-600 w-16 h-16 rounded flex justify-center items-center">
                    <Hash width={48} height={48} className=" text-white" />
                </div> 
                <div>
                    <span className="ml-3 text-3xl">{tag}</span>
                    <p className="ml-3 mt-0 text-muted-foreground">{posts.length} Snippets</p>
                </div>
            </div>
            <div className="h-2/3 p-5">
                <FeedComponent posts={posts}/>
            </div>
        </div>
    );
}

export default TagPage;