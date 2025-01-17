import FeedComponent from "./components/feed";
import config from "./config";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage} from "./components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';

function UserPage() {
    const { user } = useParams();
    const [posts, setPosts] = useState([]);
    const [notFound, setNotFound] = useState(false);
    const [userDetails, setUserDetails] = useState<any>(null);


    useEffect(() => {
        fetch(`${config.apiUrl}/api/user?username=${user}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (response.status === 404) {
                setNotFound(true);
                throw new Error('User not found');
            }
            return response.json();
        })
        .then(data => {
            setUserDetails(data.user);
            setPosts(data.posts);
        })
        .catch(error => console.error('Error fetching posts:', error));
    }, [user]);

    if (notFound) {
        return (
            <div className="h-screen w-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-2">404</h1>
                    <p className="text-muted-foreground">User not found</p>
                </div>
            </div>
        );
    }

    if (!userDetails) {
        return (
            <div className="h-screen w-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    let timeAgo = 'recently';
    if (userDetails.join_timestamp && userDetails.join_timestamp !== '0000-00-00 00:00:00') {
        const joinDate = new Date(userDetails.join_timestamp);
        if (!isNaN(joinDate.getTime()) && joinDate.getFullYear() > 1970) {
            timeAgo = formatDistanceToNow(joinDate, { addSuffix: true });
        }
    }

    return ( 
    <div className="m-0 p-0 h-screen w-screen">
        <div className="h-1/3 bg-muted flex items-center pl-6">
            <div className="flex flex-col">
                <div className="flex items-center">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src="" alt="avatar" />
                        <AvatarFallback className="bg-muted-foreground text-background">{user?.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                        <h1 className="text-2xl font-semibold">{user}</h1>
                        <p className="text-gray-500">Joined {timeAgo}</p>
                    </div>
                    
                </div>
            </div>    
        </div>
        <div className="h-2/3 w-full p-3 overflow-y-auto">
        {posts.length === 0 ? <p className="w-full mt-3 text-center text-muted-foreground">No snippets available</p> : (<FeedComponent posts={posts}/>)}
            

        </div>
    </div>
 );
}

export default UserPage;