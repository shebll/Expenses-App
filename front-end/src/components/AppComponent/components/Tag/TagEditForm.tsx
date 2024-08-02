import { useState } from "react";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Smile } from "lucide-react";
import { Tag } from "./TagsSelection";

export const TagEditForm = ({
  tag,
  onUpdate,
  onDelete,
}: {
  tag: Tag;
  onUpdate: (updatedTag: Tag) => void;
  onDelete: () => void;
}) => {
  const [editedTag, setEditedTag] = useState(tag);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <Input
        value={editedTag.tagName}
        onChange={(e) =>
          setEditedTag({ ...editedTag, tagName: e.target.value })
        }
        placeholder="Tag name"
      />
      <div className="relative">
        <Button
          variant="outline"
          onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
          className="justify-start w-full"
        >
          <Smile className="w-4 h-4 mr-2" />
          {editedTag.tagEmoji || "Select emoji"}
        </Button>
        {isEmojiPickerOpen && (
          <div className="absolute z-50 mt-2">
            <Picker
              data={data}
              onEmojiSelect={(emoji: { native: string }) => {
                setEditedTag({ ...editedTag, tagEmoji: emoji.native });
                setIsEmojiPickerOpen(false);
              }}
            />
          </div>
        )}
      </div>
      <div className="flex justify-between">
        <Button onClick={() => onUpdate(editedTag)}>Update</Button>
        <Button variant="destructive" onClick={onDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
};
