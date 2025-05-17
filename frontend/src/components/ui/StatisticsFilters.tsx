import React from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
} from '@mui/material';
import { categoryToRussian } from '@src/lib/RussianConverters';

interface StatisticsFiltersProps {
  onFilterChange: (filters: { [key: string]: any }) => void;
  attributes: Array<string>;
}

const attrToRussian: Record<string, string> = {
  category: 'Категория',
  address: 'Адрес',
  user_id: 'User ID',
  price: 'Цена',
  title: 'Название',
  description: 'Описание',
};

const StatisticsFilters: React.FC<StatisticsFiltersProps> = ({ onFilterChange, attributes }) => {
  const [xAttr, setXAttr] = React.useState<string>('');
  const [yAttr, setYAttr] = React.useState<string>('');
  const [minValue, setMinValue] = React.useState<number>(0);
  const [maxValue, setMaxValue] = React.useState<number>(100);

  const handleFilterChange = () => {
    onFilterChange({ xAttr, yAttr, minValue, maxValue });
  };

  return (
    <Box display="flex" gap={2} mb={4}>
      <FormControl>
        <InputLabel>Ось X</InputLabel>
        <Select
          value={xAttr}
          onChange={(e) => setXAttr(e.target.value)}
          style={{ width: 180 }}
        >
          {attributes.map((attr) => (
            <MenuItem key={attr} value={attr}>
              {attrToRussian[attr]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <InputLabel>Ось Y</InputLabel>
        <Select
          value={yAttr}
          onChange={(e) => setYAttr(e.target.value)}
          style={{ width: 180 }}
        >
          {attributes.map((attr) => (
            <MenuItem key={attr} value={attr}>
              {attrToRussian[attr] ?? attr}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Минимальное значение"
        type="number"
        value={minValue}
        onChange={(e) => setMinValue(Number(e.target.value))}
      />
      <TextField
        label="Максимальное значение"
        type="number"
        value={maxValue}
        onChange={(e) => setMaxValue(Number(e.target.value))}
      />

      <Button variant="contained" onClick={handleFilterChange}>
        Применить фильтры
      </Button>
    </Box>
  );
};

export default StatisticsFilters;
