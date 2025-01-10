interface Post {
    id: number;
    title: string;
    body: string;
}

interface FeedComponentProps {
    posts: Post[];
}

function FeedComponent({posts}: FeedComponentProps) {
    return ( 
    <>
        <div className="grid grid-cols-4 gap-4">
            {posts.map((post: Post) => (
                <div key={post.id} className="border p-4">
                    <h2 className="text-lg font-semibold">{post.title}</h2>
                    <p className="text-sm text-gray-500">{post.body}</p>
                </div>
            ))}
        </div>
    </>
     );
}

export default FeedComponent;