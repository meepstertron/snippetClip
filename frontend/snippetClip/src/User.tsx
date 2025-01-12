import FeedComponent from "./components/feed";

function UserPage() {
    let posts = [
        {
            id: 1,
            title: "Hello World",
            code: "console.log('Hello World')",
            language: "JavaScript",
            tags: ["example", "beginner"],
            upvotes: 10,
            copies: 5,
            author: "John Doe"
    
        }
    ]
    return ( 
    <div className="m-0 p-0 h-screen w-screen no-scrollbar overflow-hidden">
        <div className="h-1/3 bg-muted flex items-center pl-6 no-scrollbar">
            <div className="flex flex-col">
                <div className="flex items-center">
                    <div className="h-16 w-16 bg-gray-300 rounded-full"></div>
                    <div className="ml-4">
                        <h1 className="text-2xl font-semibold">John Doe</h1>
                        <p className="text-gray-500">Joined 1 month ago</p>
                    </div>
                    
                </div>
            </div>    
        </div>
        <div className="h-2/3 w-full p-3">
            <FeedComponent posts={posts}/>
        </div>
    </div>
 );
}

export default UserPage;