export type Poem = {
  id: string;
  title: string;
  content: string;
  author: string;
  likes: number;
};

export const fetchPoems = async (): Promise<Poem[]> => {
  const response = await fetch("http://localhost:8080/api/poems");
  if (!response.ok) {
    throw new Error("Failed to fetch poems");
  }
  return response.json();
};
