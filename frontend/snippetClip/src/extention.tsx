import { Button } from "./components/ui/button";

function ExtensionPage() {
    return (
        <div className="flex flex-col items-center gap-8 p-8 max-w-2xl mx-auto">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">SnippetClip Extension</h1>
                <p className="text-gray-600 mb-8">Choose your preferred version of the extension</p>
            </div>
            
            <div className="flex flex-col gap-4 w-full max-w-md">
                <div className="space-y-2">
                    <Button 
                        className="w-full" 
                        variant="default"
                        onClick={() => {
                            window.location.href = 'https://github.com/meepstertron/snippetClip/raw/refs/heads/main/extension/snippetclip/snippetclip-latest.vsix';
                        }}
                    >
                        Download Latest Stable
                    </Button>
                    <p className="text-sm text-gray-500">Recommended for most users</p>
                </div>

                <div className="space-y-2">
                    <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => {
                            window.location.href = 'https://github.com/meepstertron/snippetClip/raw/refs/heads/main/extension/snippetclip/snippetclip-development-latest.vsix';
                        }}
                    >
                        Download Latest Experimental
                    </Button>
                    <p className="text-sm text-gray-500">For testing new features</p>
                </div>
            </div>
        </div>
    );
}

export default ExtensionPage;