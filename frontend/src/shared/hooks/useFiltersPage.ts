import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useFiltersForm = () => {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [relationship, setRelationship] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [giftTypes, setGiftTypes] = useState<string[]>([]);
  const [budget, setBudget] = useState(450);

  const navigate = useNavigate();

  const toggleSelection = (
    value: string,
    currentList: string[],
    setList: (val: string[]) => void,
  ) => {
    if (currentList.includes(value)) {
      setList(currentList.filter((item) => item !== value));
    } else {
      setList([...currentList, value]);
    }
  };

  const handleGenerate = () => {
    const params = new URLSearchParams();

    if (gender) params.append('gender_target', gender);
    if (relationship) params.append('recipient', relationship);
    if (age) params.append('age_group', age);
    if (budget) params.append('max_price', budget.toString());
    
    if (interests.length > 0) {
      params.append('interests', interests.join(','));
    }
    if (giftTypes.length > 0) {
      params.append('category', giftTypes.join(','));
    }

    navigate(`/catalog?${params.toString()}`, {
      state: { fromGenerate: true },
    });
  };

  return {
    age, setAge,
    gender, setGender,
    relationship, setRelationship,
    interests, setInterests,
    giftTypes, setGiftTypes,
    budget, setBudget,
    toggleSelection,
    handleGenerate,
  };
};