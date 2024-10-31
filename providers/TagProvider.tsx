'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { deleteTag, fetchTags, updateTag } from '@/lib/actions';
import { GeneralTagData } from '@/lib/definitions';
import { createTag } from "@/lib/actions"

const GeneralTagsContext = createContext([] as any);

export const GeneralTagsProvider = ({ children }: { children: React.ReactNode }) => {
  const [generalTags, setGeneralTags] = useState<GeneralTagData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      var tags = await fetchTags();

      setGeneralTags(tags.map((tag) => {
        return {
          'id': tag.id,
          'name': tag.name,
          'color': tag.color
        }
      }));
    }
    fetchData();
  }, []);

  const createGeneralTag = async (tag: GeneralTagData) => {
    setGeneralTags((prev) => {
      return [...prev, { ...tag }].toSorted((a, b) => a.name.localeCompare(b.name));
    });

    var newTag = await createTag(tag);
    if (newTag === undefined) throw new Error('Database Error: Failed to Create Tag.');

  };

  const updateGeneralTag = async (tag: GeneralTagData) => {

    setGeneralTags((prev) => {
      return prev.map((t: any) => (t.id === tag.id ? tag : t)).toSorted((a, b) => a.name.localeCompare(b.name));
    });

    var newTag = await updateTag(tag);
    if (!newTag) throw new Error('Database Error: Failed to Create Tag.');

  }

  const deleteGeneralTag = async (tagId: string) => {

    setGeneralTags((prev) => {
      return prev.filter((t: any) => t.id !== tagId);
    });

    await deleteTag(tagId);

  }

  return (
    <GeneralTagsContext.Provider value={{ generalTags, createGeneralTag, updateGeneralTag, deleteGeneralTag }}>
      {children}
    </GeneralTagsContext.Provider>
  );
};

export const useGeneralTagsContext = () => useContext(GeneralTagsContext);
