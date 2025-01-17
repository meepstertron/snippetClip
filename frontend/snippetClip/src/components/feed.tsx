import { ArrowBigUp, Copy, EllipsisVertical } from "lucide-react";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";
import { CodeBlock, a11yDark, a11yLight } from 'react-code-blocks';
import { useTheme } from "./theme-provider";
import useExtension from "@/hooks/useExtension";


import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

import $ from "jquery";
import config from "@/config";

interface Post {
    id: number;
    title: string;
    code: string;
    language: string;
    tags: string[];
    upvotes: number;
    copies: number;
    author: string;
    upvote_ids?: number[];
}

interface FeedComponentProps {
    posts?: Post[];
}

function FeedComponent({posts = []}: FeedComponentProps) {
    const { theme } = useTheme();
    const resolvedTheme = theme === 'system' ? 'light' : theme;
    const themeMap = {
        light: a11yLight,
        dark: a11yDark
    }

    function upvotePost(id: number) {
        const token = localStorage.getItem('token');
        if (!token) {
            
            return;
        }

        $.ajax({
            url: `${config.apiUrl}/api/post/upvote`,
            type: 'POST',
            headers: {
                'Authorization': token
            },
            data: JSON.stringify({ id: id }),
            contentType: 'application/json',
            success: function() {
                const postElement = document.querySelector(`[data-post-id="${id}"]`);
                if (postElement) {
                    const upvotesElement = postElement.querySelector('.upvotes-count');
                    if (upvotesElement) {
                        upvotesElement.textContent = (parseInt(upvotesElement.textContent || '0') + 1).toString();
                    }
                }
            }
        });
    }

    function copyCodeToClipboard(code: string, id: number) {
        navigator.clipboard.writeText(code);
        $.ajax({
            url: `${config.apiUrl}/api/post/copy`,
            type: 'POST',
            data: JSON.stringify({ id: id }),
            contentType: 'application/json',
            success: function() {
                const postElement = document.querySelector(`[data-post-id="${id}"]`);
                if (postElement) {
                    const copiesElement = postElement.querySelector('.copies-count');
                    if (copiesElement) {
                        copiesElement.textContent = (parseInt(copiesElement.textContent || '0') + 1).toString();
                    }
                }
            }
        });
    }

    const { insertIntoDocument, connected } = useExtension();
    return ( 
    <>
        <div className="grid grid-cols-3 gap-4">
            {posts?.map((post: Post) => (
                <DropdownMenu key={post.id}>
                    <Card className="flex flex-col justify-between" data-post-id={post.id}>
                        <div className="flex justify-between mt-3 ml-3 mb-2">
                            <CardTitle className="text-left">
                                <span className="ml-3">{post.title}</span>
                            </CardTitle>
                            <DropdownMenuTrigger className="mr-3">
                                <span><EllipsisVertical /></span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => insertIntoDocument(post.code)} disabled={!connected}>Send to VSCode</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Copy</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-800 hidden">Report</DropdownMenuItem>

                            </DropdownMenuContent>
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
                                    <span 
                                        onClick={() => upvotePost(post.id)}
                                        className={`text-muted-foreground rounded hover:bg-muted hover:bg-opacity-20 text-sm mr-3 cursor-pointer ${
                                            post.upvote_ids?.includes(parseInt(localStorage.getItem('userid') || '0')) ? 'text-blue-500' : ''
                                        }`}
                                    >
                                        <ArrowBigUp style={{ display: 'inline' }} className="mr-1" size={24} />
                                        <span className="upvotes-count">{post.upvotes}</span>
                                    </span>
                                    <span onClick={() => copyCodeToClipboard(post.code, post.id)} className="text-muted-foreground rounded hover:bg-muted text-sm cursor-pointer">
                                        <Copy style={{ display: 'inline' }} className="mr-1" size={16} />
                                        <span className="copies-count">{post.copies}</span>
                                    </span>
                                </div>
                                <span className="text-muted-foreground text-sm ml-auto underline"><a href={"/u/"+ post.author}>{post.author}</a></span>
                            </div>
                        </CardFooter>
                    </Card>
                </DropdownMenu>
            ))}
        </div>
    </>
     );
}

export default FeedComponent;



