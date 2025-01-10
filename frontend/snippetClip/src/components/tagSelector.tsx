import React, { useState } from "react";
import Tag from "./tag"; // Import the Tag component

const TagSelector = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [input, setInput] = useState("");

  // Function to handle adding a tag when Enter is pressed
  interface TagSelectorProps {}

  interface TagProps {
    tag: string;
    showRemoveButton: boolean;
    onRemove: () => void;
    className?: string;
  }

  const addTag = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter" && input.trim() !== "") {
      setTags([...tags, input.trim()]);
      setInput("");
      event.preventDefault(); // Prevent form submission on Enter key press
    }
  };


  // Function to remove a tag
  const removeTag = (tagToRemove: string): void => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="flex items-center flex-wrap border rounded-md p-2">
      {/* Map over the tags and add a margin between them */}
      {tags.map((tag, index) => (
        <Tag
          key={index}
          tag={tag}
          showRemoveButton={true}  // Pass `true` to show the "×" button
          onRemove={() => removeTag(tag)}  // Pass the remove function
          // Add margin between tags only in the selector
          className="mr-2 mb-2"
        />
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={addTag}
        placeholder="Add a tag"
        className="outline-none border-none focus:ring-0 flex-1"
      />
    </div>
  );
};

export default TagSelector;
