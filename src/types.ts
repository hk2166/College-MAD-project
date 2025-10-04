export type Recipe = {
  id: string;
  recipeName: string;
  ingredients: string;
  instructions: string;
  nutritionalInformation?: string;
  imageUrl: string;
  imageHint: string;
};

export type PantryItem = {
  id: string;
  name: string;
};