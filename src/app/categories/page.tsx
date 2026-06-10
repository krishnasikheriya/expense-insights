"use client";

import { useCategories, useCreateCategory, useDeleteCategory } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();
  const [name, setName] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call createCategory.mutate() with the name, then clear the input field
    createCategory.mutate(
      { name },
      { 
        onSuccess: () => {
          setName("");
        },
      }
    );
  };

  if (isLoading) return (
    <div className="flex justify-center p-12">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Categories</h1>
      
      <form onSubmit={handleCreate} className="flex gap-4 mb-8">
        <Input 
          placeholder="New category name..." 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <Button type="submit" disabled={createCategory.isPending}>
          Add Category
        </Button>
      </form>

      <ul className="space-y-4">
        {categories?.map((cat: any) => (
          <li key={cat._id} className="flex justify-between items-center bg-white p-4 rounded-md shadow-sm border">
            <span>{cat.name}</span>
            <Button 
              variant="destructive" 
              onClick={() => {
                deleteCategory.mutate(cat._id)
              }}
              disabled={deleteCategory.isPending}
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
