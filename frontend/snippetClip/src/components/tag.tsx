interface TagProps {
    tag?: string;
    showRemoveButton?: boolean;
    onRemove?: () => void;
    className?: string;
}

function Tag(props: TagProps) {
    let tag = props.tag;
    if (!tag) {
        tag = "Tag Not set"; // Falsy values: "", undefined, null
    }

    // Check if the 'showRemoveButton' prop is passed and true
    const showRemoveButton = props.showRemoveButton;

    return (
        <div className="tag bg-gray-600 text-white text-xs px-2 py-1 rounded-md inline-block">
            <span className="tag-name"># {tag}</span>

            {/* Conditionally render the "×" button */}
            {showRemoveButton && (
                <button
                    className="ml-2 text-xs text-white"
                    onClick={props.onRemove} // Pass onRemove function if needed
                >
                    ×
                </button>
            )}
        </div>
    );
}

export default Tag;
