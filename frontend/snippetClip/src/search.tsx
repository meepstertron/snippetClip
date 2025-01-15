import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import config from "./config";
import FeedComponent from "./components/feed";

function SearchPage() {
    const { query } = useParams();
    const [results, setResults] = useState([]);
    useEffect(() => {
        if (query) {
            fetch(`${config.apiUrl}/api/search?query=${query}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => response.json())
            .then(data => setResults(data))
            .catch(error => console.error('Error fetching data:', error));
        }
    }, [query]);


    return ( 
        <>
            <div className="p-4">
                <h1 className="text-3xl mb-5">Showing Snippets for "{query}"<span className="ml-2 text-sm text-muted-foreground">found {results.length} results</span></h1>
                <FeedComponent posts={results} />       
            </div>
        </>
     );
}

export default SearchPage;