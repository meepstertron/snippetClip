import React from "react";
import { Hash } from "lucide-react";
import FeedComponent from "./components/feed";
import { useParams } from "react-router-dom";
import { useState } from "react";
import config from "./config";

import $ from "jquery";

import { useEffect } from "react";

interface Post {
    id: number;
    title: string;
    code: string;
    language: string;
    tags: string[];
    upvotes: number;
    copies: number;
    author: string;
}

function TagPage() {
    const { tag } = useParams<{ tag: string }>();
    const [posts, setPosts] = useState([
        {
            id: 1,
            title: "Hello World",
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
            code: "@app.route('/hello')\ndef hello():\n    return 'Hello, World!'",
            language: "python",
            tags: ["Flask", "beginner", "example"],
            upvotes: 7,
            copies: 60,
            author: "John Doe"
        }
    ]);
    const [tagdata, setTag] = useState<{ color: string; icon: string }>({ color: '', icon: '' });

    const IconComponent = React.lazy(() => import(`lucide-react`).then(module => {
        const Icon = module[tagdata.icon as keyof typeof module] || Hash;
        return { default: Icon as React.ComponentType<any> };
    }));

    useEffect(() => {
        $.ajax({
            url: `${config.apiUrl}/api/tag/${tag}`,
            type: 'GET',
            success: function(data) {
                const formattedPosts: Post[] = data.posts.map((post: any) => ({
                    ...post,
                    tags: Array.isArray(post.tags) ? post.tags : []
                }));
                setPosts(formattedPosts);
                setTag({ color: data.tag.color, icon: data.tag.icon });
            }
        });
    }, [tag]);

    return ( 
        <div className="m-0 p-0 h-screen w-screen">
            <div className="h-1/3 bg-muted flex items-center pl-6">
                {tag && (
                    <React.Suspense fallback={<Hash width={48} height={48} className="text-white" />}>
                        <div className="bg-blue-600 w-16 h-16 rounded flex justify-center items-center" style={{ backgroundColor: '#'+tagdata.color }}>
                            <IconComponent width={48} height={48} className="text-white" />
                        </div> 
                        <div>
                            <span className="ml-3 text-3xl">{tagdata.icon !== 'Hash' ? '#' : ''}{tag}</span>
                            <p className="ml-3 mt-0 text-muted-foreground">{posts.length} Snippets</p>
                        </div>
                    </React.Suspense>
                )}
            </div>
            <div className="h-2/3 p-5">
                <FeedComponent posts={posts}/>
            </div>
        </div>
    );
}

export default TagPage;