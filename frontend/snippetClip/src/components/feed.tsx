import { Badge } from "lucide-react";
import { Card, CardContent, CardTitle } from "./ui/card";
import { CopyBlock } from 'react-code-blocks';
interface Post {
    id: number;
    title: string;
    body: string;
    code: string;
    language: string;
    tags: string[];
}

interface FeedComponentProps {
    posts: Post[];
}

function FeedComponent({posts}: FeedComponentProps) {
    return ( 
    <>
        <div className="grid grid-cols-4 gap-4">
            {posts.map((post: Post) => (
                <Card>
                    <CardTitle>{post.title}</CardTitle>
                    <CardContent>
                        <CopyBlock
                            text={post.code}
                            language={post.language}
                            showLineNumbers={true}
                        />
                    </CardContent>
                    <div>
                        {post.tags.map((tag) => (
                            <Badge>{tag}</Badge>
                        ))}
                    </div>

                </Card>

            ))}
        </div>
    </>
     );
}

export default FeedComponent;