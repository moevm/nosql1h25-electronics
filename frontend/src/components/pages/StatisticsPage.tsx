import { useEffect, useMemo, useState } from 'react';
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
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { ApiService, ProductRequest } from '@src/api';
import { categoryToRussian } from '@src/lib/RussianConverters';
import { Link } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';

type chartLabels = keyof ProductRequest | 'timestamp' | 'user_fullname';

const groupableAttributes: Array<chartLabels> = [
  'category',
  'address',
  'user_fullname',
  'price',
  'title',
  'timestamp',
];

const attrToRussian: Record<string, string> = {
  category: 'Категория',
  address: 'Адрес',
  user_fullname: 'ФИО пользователя',
  price: 'Цена',
  title: 'Название',
  description: 'Описание',
  timestamp: 'Дата создания',
};

const statusOptions = [
  { value: '', label: 'Все' },
  { value: 'created_status', label: 'Создана' },
  { value: 'price_offer_status', label: 'Предложена цена' },
  { value: 'price_accept_status', label: 'Цена принята' },
  { value: 'date_offer_status', label: 'Предложена дата' },
  { value: 'date_accept_status', label: 'Дата принята' },
  { value: 'closed_status', label: 'Закрыта' },
];

export default function StatisticsPage() {
  const [productsData, setProductsData] = useState<ProductRequest[] | null>(null);
  const [onlyMy, setOnlyMy] = useState(false);

  const fetchData = async (me?: boolean) => {
    const { requests } = await ApiService.apiRequestsRetrieve({ me: me ? true : undefined });
    setProductsData(requests);
  };

  useEffect(() => {
    fetchData(onlyMy);
  }, [onlyMy]);

  const [filters, setFilters] = useState({
    title: '',
    category: '',
    address: '',
    user_id: '',
    minPrice: '',
    maxPrice: '',
    lastStatus: '',
    closedSuccess: true,
  });

  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  const [xAttr, setXAttr] = useState<chartLabels>('category');
  const [yAttr, setYAttr] = useState<chartLabels>('address');

  const userIds = useMemo(() => {
    if (!productsData) return [];
    return Array.from(new Set(productsData.map(p => String(p.user_id)))).filter(Boolean);
  }, [productsData]);

  const userQueries = useQueries({
    queries: userIds.map(user_id => ({
      queryKey: ['user', user_id, 'fullname'],
      queryFn: () => ApiService.apiUsersRetrieve({ id: user_id }).then(user => user.fullname),
      staleTime: 5 * 60 * 1000,
      enabled: !!user_id,
    })),
  });

  const usersList = useMemo(() => {
    const map: Record<string, string> = {};
    userIds.forEach((id, idx) => {
      const q = userQueries[idx];
      if (q && q.data) map[id] = q.data;
    });
    return map;
  }, [userIds, userQueries]);

  const userIdOptions = useMemo(() => {
    return userIds.map(id => ({
      id,
      fullname: usersList[id] || id,
    }));
  }, [userIds, usersList]);

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
        ? item.statuses[item.statuses.length - 1].timestamp
        : undefined;
      const dateOk =
        (!dateFrom || (firstTimestamp && firstTimestamp >= dateFrom)) &&
        (!dateTo || (firstTimestamp && firstTimestamp <= dateTo));
      const lastStatusObj = Array.isArray(item.statuses) && item.statuses.length > 0
        ? item.statuses[item.statuses.length - 1]
        : undefined;
      const lastStatus = lastStatusObj?.type;
      const statusOk = !filters.lastStatus || lastStatus === filters.lastStatus;
      const closedOk = filters.lastStatus !== 'closed_status'
        || (lastStatus === 'closed_status' && (
          (filters.closedSuccess && lastStatusObj?.success === true) ||
          (!filters.closedSuccess && lastStatusObj?.success === false)
        ));
      return titleOk && categoryOk && addressOk && userOk && minPriceOk && maxPriceOk && dateOk && statusOk && closedOk;
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
    const getAxisValue = (item: ProductRequest, attr: chartLabels) => {
      if (attr === 'timestamp') {
        if (Array.isArray(item.statuses) && item.statuses.length > 0) {
          return String(item.statuses[item.statuses.length - 1].timestamp).slice(0, 10);
        }
        return 'нет даты';
      }
      if (attr === 'user_fullname') {
        return usersList?.[String(item.user_id)] || String(item.user_id);
      }
      if (attr === 'category') {
        return categoryToRussian(item.category) ?? String(item.category ?? 'null');
      }
      return String(item[attr] ?? 'null');
    };

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
          val = categoryToRussian(item.category) ?? String(item.category ?? 'null');
        } else if (xAttr === 'timestamp') {
          if (Array.isArray(item.statuses) && item.statuses.length > 0) {
            val = String(item.statuses[0].timestamp).slice(0, 10);
          } else {
            val = 'нет даты';
          }
        } else if (xAttr === 'user_fullname') {
          val = usersList?.[String(item.user_id)] || String(item.user_id);
        } else {
          val = String(item[xAttr] ?? 'null');
        }
        counts[val] = (counts[val] ?? 0) + 1;
      });
      const xLabels = Object.keys(counts).sort();
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
      const xVal = getAxisValue(item, xAttr);
      const yVal = getAxisValue(item, yAttr);

      if (!groupMap.has(xVal)) groupMap.set(xVal, new Map());
      const yMap = groupMap.get(xVal)!;
      if (yAttr === 'price') {
        yMap.set('price', (yMap.get('price') ?? 0) + Number(item.price ?? 0));
      } else {
        yMap.set(yVal, (yMap.get(yVal) ?? 0) + 1);
      }
    });

    let xLabels = Array.from(groupMap.keys());
    if (xAttr === 'price') {
      xLabels.sort((a, b) => Number(a) - Number(b));
    } else if (xAttr === 'timestamp') {
      xLabels.sort((a, b) => a.localeCompare(b));
    } else if (xAttr === 'category') {
      xLabels.sort((a, b) => a.localeCompare(b, 'ru'));
    } else {
      if (xLabels.length > 0 && /^\d+/.test(xLabels[0])) {
        xLabels.sort((a, b) => {
          const aNum = parseInt(a.split(' ')[0], 10);
          const bNum = parseInt(b.split(' ')[0], 10);
          return aNum - bNum;
        });
      } else {
        xLabels.sort((a, b) => a.localeCompare(b, 'ru'));
      }
    }

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
            ? yLabel
            : yAttr === 'timestamp'
              ? yLabel
              : yAttr === 'user_fullname'
                ? yLabel
                : yLabel,
      }));
    }

    return { xLabels, series };
  }, [filteredData, xAttr, yAttr, usersList]);

  const userFullnameValue = filters.user_id
    ? usersList?.[filters.user_id] || ''
    : '';

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

      <Box display="flex" gap={2} flexWrap="wrap">
        <FormControlLabel
          control={
            <Checkbox
              checked={onlyMy}
              onChange={e => setOnlyMy(e.target.checked)}
            />
          }
          label="Участвовал в разрешении"
        />
      </Box>

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
          options={userIdOptions}
          getOptionLabel={option => typeof option === 'string' ? option : option.fullname}
          value={userIdOptions.find(opt => opt.id === filters.user_id) || null}
          onChange={(_, newValue) => setFilters(f => ({ ...f, user_id: newValue?.id ?? '' }))}
          renderInput={(params) => (
            <TextField
              {...params}
              label={attrToRussian['user_fullname']}
              size="small"
              placeholder="Поиск или выберите"
            />
          )}
          isOptionEqualToValue={(option, value) => {
            if (!option || !value) return false;
            return option.id === value.id;
          }}
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
          label="Мин. дата изменения"
          type="date"
          value={dateFrom}
          onChange={e => setDateFrom(e.target.value)}
          size="small"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Макс. дата изменения"
          type="date"
          value={dateTo}
          onChange={e => setDateTo(e.target.value)}
          size="small"
          InputLabelProps={{ shrink: true }}
        />
        <FormControl size="small" style={{ minWidth: 170 }}>
          <InputLabel>Последний статус</InputLabel>
          <Select
            value={filters.lastStatus}
            label="Последний статус"
            onChange={e => setFilters(f => ({ ...f, lastStatus: e.target.value }))}
            sx={{ minWidth: 280, maxWidth: 400 }}
          >
            {statusOptions.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {filters.lastStatus === 'closed_status' && (
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.closedSuccess}
                onChange={e => setFilters(f => ({ ...f, closedSuccess: e.target.checked }))}
              />
            }
            label="Успешно закрытые"
          />
        )}

        <Button variant="outlined" onClick={() => {
          setFilters({
            title: '', category: '', address: '', user_id: '', minPrice: '', maxPrice: '', lastStatus: '', closedSuccess: true
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
            onChange={e => setXAttr(e.target.value as chartLabels)}
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
            onChange={e => setYAttr(e.target.value as chartLabels)}
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
