import FeedComponent from "./components/feed";


let posts = [
    {
        id: 1,
        title: "Hello World",
        body: "This is a snippet of code that prints 'Hello World'",
        code: "console.log('Hello World')",
        language: "JavaScript",
        tags: ["example", "beginner"]

    }
]

function Feed() {
    return ( 
        <div>
            <h1>Feed</h1>
            <FeedComponent posts={posts} />
        </div>
     );
}

export default Feed;