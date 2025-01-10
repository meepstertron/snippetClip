import { ArrowBigUp, Copy, EllipsisVertical } from "lucide-react";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";
import { CodeBlock, a11yDark, a11yLight } from 'react-code-blocks';
import { useTheme } from "./theme-provider";
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

interface FeedComponentProps {
    posts: Post[];
}

function FeedComponent({posts}: FeedComponentProps) {
    const { theme } = useTheme();
    const resolvedTheme = theme === 'system' ? 'light' : theme;
    const themeMap = {
        light: a11yLight,
        dark: a11yDark
    }

    return ( 
    <>
        <div className="grid grid-cols-3 gap-4">
            {posts.map((post: Post) => (
                <Card className="flex flex-col justify-between">
                    <div className="flex justify-between mt-3 ml-3 mb-2">
                        <CardTitle className="text-left">
                            <span className="ml-3">{post.title}</span>
                        </CardTitle>
                        <span className="mr-3"><EllipsisVertical /></span>
                    </div>
                    <CardContent className="flex-grow">
                        <CodeBlock
                            theme={ themeMap[resolvedTheme] }
                            text={post.code}
                            language={post.language}
                            showLineNumbers={true}
                        />
                    </CardContent>
                    <div className="mb-3 ml-6">
                        {post.tags.map((tag) => (
                            <Badge className="mr-1 cursor-pointer" onClick={() => location.href = "/tag/" + tag }>#{tag}</Badge>
                        ))}
                    </div>
                    <CardFooter>
                        <div className="flex justify-between w-full">
                            <div>
                                <span className="text-muted-foreground rounded hover:bg-muted-foreground text-sm mr-3">
                                    <ArrowBigUp style={{ display: 'inline' }} className="mr-1" size={24} />{post.upvotes}
                                </span>
                                <span className="text-muted-foreground rounded hover:bg-muted-foreground text-sm">
                                    <Copy style={{ display: 'inline' }} className="mr-1" size={16} />{post.copies}
                                </span>
                            </div>
                            <span className="text-muted-foreground text-sm ml-auto">{post.author}</span>
                        </div>
                    </CardFooter>
                </Card>

            ))}
        </div>
    </>
     );
}

export default FeedComponent;