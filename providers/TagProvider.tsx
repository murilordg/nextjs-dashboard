'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchTags, updateTag } from '@/lib/actions';
import { GeneralTagData, GeneralTagDataCreate, GeneralTagDataUpdate } from '@/lib/definitions';
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

  const createGeneralTag = async (tag: GeneralTagDataCreate) => {

    var newTag = await createTag(tag);
    if (newTag === undefined) throw new Error('Database Error: Failed to Create Tag.');

    setGeneralTags((prev) => {
      return [...prev, { ...tag, id: newTag!.id }];
    });
  };

  const updateGeneralTag = async (tag: GeneralTagDataUpdate) => {

    var newTag = await updateTag(tag);
    if (!newTag) throw new Error('Database Error: Failed to Create Tag.');

    setGeneralTags((prev) => {
      prev = prev.filter((t: any) => t.id !== tag.id);
      return [...prev, tag];
    });
  }

  return (
    <GeneralTagsContext.Provider value={{ generalTags, setGeneralTags, createGeneralTag, updateGeneralTag }}>
      {children}
    </GeneralTagsContext.Provider>
  );
};

export const useGeneralTagsContext = () => useContext(GeneralTagsContext);
