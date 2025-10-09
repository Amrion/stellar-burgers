import { FC, useEffect, useState } from 'react';
import { Preloader } from '@ui';
import { IngredientDetailsUI } from '@ui';
import { selectIngredients } from '../../services/slices/ingredients';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { TIngredient } from '@utils-types';

export const IngredientDetails: FC = () => {
  const { id } = useParams();

  const [ingredientData, setIngredientData] = useState<TIngredient | undefined>(
    undefined
  );
  const ingredients = useSelector(selectIngredients);

  useEffect(() => {
    setIngredientData(ingredients.find((item) => item._id === id));
  }, [ingredients, id]);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
