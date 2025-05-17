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
  Autocomplete,
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

  function buildHistogram(data: any[], attr: keyof ProductRequest, binCount = 10) {
    const values = data.map(item => Number(item[attr])).filter(x => !isNaN(x));
    if (values.length === 0) return { bins: [], counts: [] };
    const min = Math.min(...values);
    const max = Math.max(...values);
    if (min === max) {
      return { bins: [`${min}`], counts: [values.length] };
    }
    const step = (max - min) / binCount;
    const bins: string[] = [];
    const counts: number[] = Array(binCount).fill(0);
    for (let i = 0; i < binCount; ++i) {
      const binMin = min + i * step;
      const binMax = min + (i + 1) * step;
      bins.push(`${binMin.toFixed(0)} - ${binMax.toFixed(0)}`);
    }
    values.forEach(val => {
      let idx = Math.floor((val - min) / step);
      if (idx >= binCount) idx = binCount - 1;
      counts[idx]++;
    });
    return { bins, counts };
  }

  const chartData = useMemo(() => {
    if (xAttr === yAttr) {
      if (xAttr === 'price') {
        const hist = buildHistogram(filteredData, 'price', 10);
        return {
          xLabels: hist.bins,
          series: [{ data: hist.counts, label: 'Количество' }],
        };
      }
      const counts: Record<string, number> = {};
      filteredData.forEach(item => {
        let val: string;
        if (xAttr === 'category') {
          val = categoryToRussian(String(item[xAttr]) as any) ?? String(item[xAttr] ?? 'null');
        } else if (xAttr === 'timestamp') {
          if (Array.isArray(item.statuses) && item.statuses.length > 0) {
            val = String(item.statuses[0].timestamp).slice(0, 10);
          } else {
            val = 'нет даты';
          }
        } else {
          val = String(item[xAttr] ?? 'null');
        }
        counts[val] = (counts[val] ?? 0) + 1;
      });
      const xLabels = Object.keys(counts);
      return {
        xLabels,
        series: [{
          data: xLabels.map(x => counts[x]),
          label: 'Количество',
        }],
      };
    }

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
        <Autocomplete
          options={unique('address')}
          value={filters.address}
          onInputChange={(_, newValue) => setFilters(f => ({ ...f, address: newValue }))}
          onChange={(_, newValue) => setFilters(f => ({ ...f, address: newValue ?? '' }))}
          renderInput={(params) => (
            <TextField
              {...params}
              label={attrToRussian['address']}
              size="small"
              placeholder="Поиск или выберите"
            />
          )}
          freeSolo
          clearOnEscape
          sx={{ minWidth: 280, maxWidth: 400 }}
        />
        <Autocomplete
          options={unique('user_id')}
          value={filters.user_id}
          onInputChange={(_, newValue) => setFilters(f => ({ ...f, user_id: newValue }))}
          onChange={(_, newValue) => setFilters(f => ({ ...f, user_id: newValue ?? '' }))}
          renderInput={(params) => (
            <TextField
              {...params}
              label={attrToRussian['user_id']}
              size="small"
              placeholder="Поиск или выберите"
            />
          )}
          freeSolo
          clearOnEscape
          sx={{ minWidth: 250, maxWidth: 300 }}
        />
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
              <MenuItem
                key={attr}
                value={attr}
                disabled={attr === yAttr}
              >
                {attrToRussian[attr] ?? attr}
              </MenuItem>
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
              <MenuItem
                key={attr}
                value={attr}
                disabled={attr === xAttr}
              >
                {attrToRussian[attr] ?? attr}
              </MenuItem>
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
