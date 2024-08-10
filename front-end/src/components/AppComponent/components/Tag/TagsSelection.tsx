import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, getTagsQueryOption } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FieldError, UseFormRegister } from "react-hook-form";
import { Edit2 } from "lucide-react";
import { TagAddForm } from "./TagAddForm";
import { TagEditForm } from "./TagEditForm";
import { TagType } from "@app/sharedType";

type TagsSelectionProps = {
  register: UseFormRegister<{
    tagId: number;
    amount: string;
    date?: string | null | undefined;
    id?: number | undefined;
  }>;
  error: FieldError | undefined;
  value: number | undefined;
};

const TagsSelection: React.FC<TagsSelectionProps> = ({
  register,
  error,
  value,
}) => {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const queryClient = useQueryClient();

  const { data: tags, isLoading } = useQuery(getTagsQueryOption);

  const updateTagMutation = useMutation({
    mutationFn: (updatedTag: TagType) =>
      api.tags[":id"].$put({
        json: { tagName: updatedTag.tagName, tagEmoji: updatedTag.tagEmoji },
        param: { id: String(updatedTag.id) },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });

  const deleteTagMutation = useMutation({
    mutationFn: (tagId: number) =>
      api.tags[":id"].$delete({ param: { id: String(tagId) } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tags"] }),
  });

  if (isLoading) return <div>Loading tags...</div>;

  console.log(value);
  return (
    <div className="grid grid-cols-4 gap-4">
      {tags?.map((tag) => (
        <div
          key={tag.id}
          className={`relative group flex items-center justify-center w-20 h-20 border rounded-lg transition-colors ${
            Number(value) === tag.id
              ? "border-primary bg-primary/10"
              : "hover:border-primary"
          }`}
        >
          <input
            type="radio"
            id={String(tag.id)}
            value={String(tag.id)}
            className="hidden"
            {...register("tagId")}
          />
          <label
            htmlFor={String(tag.id)}
            className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
          >
            <span className="mb-2 text-3xl">{tag.tagEmoji}</span>
            <span className="max-w-full px-1 overflow-hidden text-sm text-nowrap text-ellipsis">
              {tag.tagName}
            </span>
          </label>
          <div className="absolute transition-opacity opacity-0 top-2 right-2 group-hover:opacity-100">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <Edit2 className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <TagEditForm
                  tag={tag}
                  onUpdate={(updatedTag) =>
                    updateTagMutation.mutate(updatedTag)
                  }
                  onDelete={() => deleteTagMutation.mutate(tag.id)}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      ))}
      {isAddingTag ? (
        <TagAddForm setIsAddingTag={setIsAddingTag} />
      ) : (
        <Button
          onClick={() => setIsAddingTag(true)}
          className="h-20 max-h-full col-span-1 "
          variant="outline"
        >
          Add +
        </Button>
      )}
      {error && (
        <p className="col-span-3 text-sm text-red-500">{error.message}</p>
      )}
    </div>
  );
};

export default TagsSelection;
