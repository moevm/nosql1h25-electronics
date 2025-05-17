import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Button,
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { ProductRequest } from '@src/api';
import { selectProducts, updateProducts } from '@src/store/ProductsSlice';
import { useAppDispatch, useAppSelector } from '@src/hooks/ReduxHooks';
import { categoryToRussian } from '@src/lib/RussianConverters';
import { Link } from 'react-router-dom';

const groupableAttributes: Array<keyof ProductRequest | 'timestamp'> = [
  'category',
  'address',
  'user_id',
  'price',
  'title',
  'timestamp',
];

const attrToRussian: Record<string, string> = {
  category: 'Категория',
  address: 'Адрес',
  user_id: 'User ID',
  price: 'Цена',
  title: 'Название',
  description: 'Описание',
  timestamp: 'Дата создания',
};

export default function StatisticsPage() {
  const productsData = useAppSelector(selectProducts);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(updateProducts(null));
  }, []);

  const [filters, setFilters] = useState({
    title: '',
    category: '',
    address: '',
    user_id: '',
    minPrice: '',
    maxPrice: '',
  });

  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  const [xAttr, setXAttr] = useState<keyof ProductRequest | 'timestamp'>('category');
  const [yAttr, setYAttr] = useState<keyof ProductRequest | 'timestamp'>('address');

  const filteredData = useMemo(() => {
    if (!productsData) return [];
    return productsData.filter((item) => {
      const titleOk = filters.title === '' || item.title.toLowerCase().includes(filters.title.toLowerCase());
      const categoryOk = filters.category === '' || item.category === filters.category;
      const addressOk = filters.address === '' || item.address === filters.address;
      const userOk = filters.user_id === '' || String(item.user_id) === filters.user_id;
      const minPriceOk = filters.minPrice === '' || item.price >= Number(filters.minPrice);
      const maxPriceOk = filters.maxPrice === '' || item.price <= Number(filters.maxPrice);
      const firstTimestamp = Array.isArray(item.statuses) && item.statuses.length > 0
        ? item.statuses[0].timestamp
        : undefined;
      const dateOk =
        (!dateFrom || (firstTimestamp && firstTimestamp >= dateFrom)) &&
        (!dateTo || (firstTimestamp && firstTimestamp <= dateTo));
      return titleOk && categoryOk && addressOk && userOk && minPriceOk && maxPriceOk && dateOk;
    });
  }, [productsData, filters, dateFrom, dateTo]);

  const chartData = useMemo(() => {
    const groupMap = new Map<string, Map<string, number>>();

    filteredData.forEach((item) => {
      const getAxisValue = (attr: keyof ProductRequest | 'timestamp') => {
        if (attr === 'timestamp') {
          if (Array.isArray(item.statuses) && item.statuses.length > 0) {
            return String(item.statuses[0].timestamp).slice(0, 10);
          }
          return 'нет даты';
        }
        return String(item[attr] ?? 'null');
      };

      const xVal = getAxisValue(xAttr);
      const yVal = getAxisValue(yAttr);

      if (!groupMap.has(xVal)) groupMap.set(xVal, new Map());
      const yMap = groupMap.get(xVal)!;
      if (yAttr === 'price') {
        yMap.set('price', (yMap.get('price') ?? 0) + Number(item.price ?? 0));
      } else {
        yMap.set(yVal, (yMap.get(yVal) ?? 0) + 1);
      }
    });

    const xLabels = Array.from(groupMap.keys());
    let yLabels: string[];
    let series;

    if (yAttr === 'price') {
      yLabels = ['price'];
      series = [{
        data: xLabels.map((xLabel) => groupMap.get(xLabel)?.get('price') ?? 0),
        label: 'Сумма price',
      }];
    } else {
      const yLabelsSet = new Set<string>();
      groupMap.forEach((yMap) => {
        yMap.forEach((_, y) => yLabelsSet.add(y));
      });
      yLabels = Array.from(yLabelsSet);
      series = yLabels.map((yLabel) => ({
        data: xLabels.map((xLabel) => groupMap.get(xLabel)?.get(yLabel) ?? 0),
        label:
          yAttr === 'category'
            ? categoryToRussian(yLabel as any) ?? yLabel
            : yAttr === 'timestamp'
              ? yLabel
              : yLabel,
      }));
    }

    return { xLabels, series };
  }, [filteredData, xAttr, yAttr]);

  const unique = (attr: keyof ProductRequest) =>
    Array.from(new Set((productsData ?? []).map((item) => String(item[attr] ?? '')))).filter(Boolean);

  return (
    <Box p={4}>
      <Button component={Link} to="/" variant="contained" sx={{ mb: 2 }}>
        В главное меню
      </Button>
      <Typography variant="h5" gutterBottom>
        Статистика по заявкам
      </Typography>

      <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
        <TextField
          label="Название содержит"
          value={filters.title}
          onChange={e => setFilters(f => ({ ...f, title: e.target.value }))}
          size="small"
        />
        <FormControl size="small" style={{ minWidth: 140 }}>
          <InputLabel>{attrToRussian['category']}</InputLabel>
          <Select
            value={filters.category}
            label={attrToRussian['category']}
            onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
          >
            <MenuItem value="">Все</MenuItem>
            {unique('category').map(val => (
              <MenuItem key={val} value={val}>{categoryToRussian(val as any) ?? val}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" style={{ minWidth: 140 }}>
          <InputLabel>{attrToRussian['address']}</InputLabel>
          <Select
            value={filters.address}
            label={attrToRussian['address']}
            onChange={e => setFilters(f => ({ ...f, address: e.target.value }))}
          >
            <MenuItem value="">Все</MenuItem>
            {unique('address').map(val => (
              <MenuItem key={val} value={val}>{val}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" style={{ minWidth: 140 }}>
          <InputLabel>{attrToRussian['user_id']}</InputLabel>
          <Select
            value={filters.user_id}
            label={attrToRussian['user_id']}
            onChange={e => setFilters(f => ({ ...f, user_id: e.target.value }))}
          >
            <MenuItem value="">Все</MenuItem>
            {unique('user_id').map(val => (
              <MenuItem key={val} value={val}>{val}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Мин. цена"
          type="number"
          value={filters.minPrice}
          onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))}
          size="small"
        />
        <TextField
          label="Макс. цена"
          type="number"
          value={filters.maxPrice}
          onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
          size="small"
        />
        <TextField
          label="Мин. дата"
          type="date"
          value={dateFrom}
          onChange={e => setDateFrom(e.target.value)}
          size="small"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Макс. дата"
          type="date"
          value={dateTo}
          onChange={e => setDateTo(e.target.value)}
          size="small"
          InputLabelProps={{ shrink: true }}
        />
        <Button variant="outlined" onClick={() => {
          setFilters({
            title: '', category: '', address: '', user_id: '', minPrice: '', maxPrice: ''
          });
          setDateFrom('');
          setDateTo('');
        }}>
          Сбросить фильтры
        </Button>
      </Box>

      <Box display="flex" gap={2} mb={3}>
        <FormControl size="small" style={{ minWidth: 180 }}>
          <InputLabel>Ось X</InputLabel>
          <Select
            value={xAttr}
            label="Ось X"
            onChange={e => setXAttr(e.target.value as keyof ProductRequest | 'timestamp')}
          >
            {groupableAttributes.map(attr => (
              <MenuItem key={attr} value={attr}>{attrToRussian[attr] ?? attr}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" style={{ minWidth: 180 }}>
          <InputLabel>Ось Y</InputLabel>
          <Select
            value={yAttr}
            label="Ось Y"
            onChange={e => setYAttr(e.target.value as keyof ProductRequest | 'timestamp')}
          >
            {groupableAttributes.map(attr => (
              <MenuItem key={attr} value={attr}>{attrToRussian[attr] ?? attr}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <BarChart
        xAxis={[{ data: chartData.xLabels, scaleType: 'band', label: attrToRussian[xAttr] ?? xAttr }]}
        series={chartData.series}
        height={420}
      />
    </Box>
  );
}
