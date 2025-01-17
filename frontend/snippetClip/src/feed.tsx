import { ArrowRight, CopyPlusIcon, Sparkles, Trophy } from "lucide-react";
import { useState, useEffect } from 'react';
import { Button } from "./components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "./components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "./components/ui/separator";
import FeedComponent from "./components/feed";
import config from "./config";


function Feed() {
    const [posts, setPosts] = useState<any[]>([]);
    const [currentTab, setCurrentTab] = useState('new');
    const [error, setError] = useState<string | null>(null);

    async function fetchPosts(fetchtype: string) {
        try {
            setError(null);
            const response = await fetch(`${config.apiUrl}/api/posts/${fetchtype}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch posts (${response.status})`);
            }
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
            setPosts([]);
            setError('Failed to load snippets. Please try again later.');
        }
    }

    useEffect(() => {
        fetchPosts(currentTab);
    }, [currentTab]);

    return ( 
        <>
            <div className="text-center py-8 bg-muted/50 h-1/4">
                <h1 className="text-4xl font-bold">SnippetClip</h1>
                <p className="text-muted-foreground">Welcome to SnippetClip, an opensource app to store and share your code snippets</p>
            </div>
            <div className="grid grid-cols-3 gap-4 h-64 m-3">
                <a href="/extension" className="cursor-pointer no-underline">
                    <Card className="bg-gradient-to-r from-background via-background min-h-full to-blue-950 p-3 flex flex-col justify-between">
                        <div>
                            <CardTitle>VSCode extension</CardTitle>
                            <CardContent className="p-0 pt-3 text-sm text-muted-foreground">
                                Install the extension to send snippets directly to your VSCode Editor    
                            </CardContent>
                        </div>
                        <CardFooter className="flex justify-end p-0">
                            <Button className="rounded-full w-8 h-8 p-0 aspect-square ">
                                <ArrowRight className="" strokeWidth="4px" />
                            </Button>
                        </CardFooter>
                    </Card>
                </a>
                
                <a href="/register" className="cursor-pointer no-underline">
                    <Card className="bg-gradient-to-r from-background via-background min-h-full to-orange-950 p-3 flex flex-col justify-between">
                        <div>
                            <CardTitle>Account</CardTitle>
                            <CardContent className="p-0 pt-3 text-sm text-muted-foreground">
                                Sign up for an account to save your snippets and access them from anywhere.
                            </CardContent>
                        </div>
                        <CardFooter className="flex justify-end p-0">
                            <Button className="rounded-full w-8 h-8 p-0 aspect-square ">
                                <ArrowRight className="" strokeWidth="4px" />
                            </Button>
                        </CardFooter>
                    </Card>
                </a>
                
                <a href="https://github.com/meepstertron/snippetClip/blob/main/change-log.md" className="cursor-pointer no-underline">
                    <Card className="bg-gradient-to-r from-background via-background min-h-full to-green-950 p-3 flex flex-col justify-between">
                        <div>
                            <CardTitle>1.0 Release</CardTitle>
                            <CardContent className="p-0 pt-3 text-sm text-muted-foreground">
                                I am thrilled to announce the 1.0 release of SnippetClip. Features have been added and bugs have been fixed. Any bugs do occur please Report them.
                            </CardContent>
                        </div>
                        <CardFooter className="flex justify-end p-0">
                            <Button className="rounded-full w-8 h-8 p-0 aspect-square ">
                                <ArrowRight className="" strokeWidth="4px" />
                            </Button>
                        </CardFooter>
                    </Card>
                </a>
                    
            </div>
            <Separator className="mt-5"/>
            <div className="flex justify-center m-5 w-full">
                <Tabs defaultValue="new" className="w-full max-w-7xl px-4" onValueChange={setCurrentTab}>
                    <TabsList className="w-full justify-center">
                        <TabsTrigger value="random"><Sparkles className="mr-3"/> Magic</TabsTrigger>
                        <TabsTrigger value="new"><CopyPlusIcon className="mr-3"/> New</TabsTrigger>
                        <TabsTrigger value="featured"><Trophy className="mr-3"/> Featured</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="random">
                        {error ? (
                            <div className="text-center p-4 text-muted-foreground">
                                <p>{error}</p>
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="text-center p-4 text-muted-foreground">
                                <p>No snippets under this category :(</p>
                            </div>
                        ) : (
                            <FeedComponent posts={posts} />
                        )}
                    </TabsContent>
                    <TabsContent value="new">
                        {error ? (
                            <div className="text-center p-4 text-muted-foreground">
                                <p>{error}</p>
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="text-center p-4 text-muted-foreground">
                                <p>No snippets under this category :(</p>
                            </div>
                        ) : (
                            <FeedComponent posts={posts} />
                        )}
                    </TabsContent>
                    <TabsContent value="featured">
                        {error ? (
                            <div className="text-center p-4 text-muted-foreground">
                                <p>{error}</p>
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="text-center p-4 text-muted-foreground">
                                <p>No snippets under this category :(</p>
                            </div>
                        ) : (
                            <FeedComponent posts={posts} />
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}

export default Feed;