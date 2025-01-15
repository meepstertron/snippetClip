import React, { useState } from "react";
import Tag from "./tag";
import { cn } from "@/lib/utils";

interface TagSelectorProps {
  tags: string[];
  setTags: (tags: string[]) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({ tags, setTags }) => {
  const [input, setInput] = useState("");

  const addTag = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter" && input.trim() !== "") {
      setTags([...tags, input.trim()]);
      setInput("");
      event.preventDefault(); // Prevent form submission on Enter key press
    }
  };

  const removeTag = (tagToRemove: string): void => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className={cn(
      "flex items-center flex-wrap rounded-md p-2",
      "border border-input bg-background",
      "dark:border-input dark:bg-background"
    )}>
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
        placeholder={tags.length === 0 ? "Add a tag" : ""}
        className={cn(
          "outline-none border-none focus:ring-0 flex-1",
          "bg-background text-foreground placeholder:text-muted-foreground",
          "dark:bg-background dark:text-foreground dark:placeholder:text-muted-foreground"
        )}
      />
    </div>
  );
};

export default TagSelector;
