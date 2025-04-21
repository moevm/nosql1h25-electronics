import { Dialog, DialogTitle, DialogContent, Box, Typography, TextField, MenuItem, DialogActions, Button, Grid, Avatar } from "@mui/material";
import { ApiService } from "@src/api";
import { CategoryEnum } from "@src/api/models/CategoryEnum";
import { categoryToRussian } from "@src/lib/russianConverters";
import { useEffect, useMemo, useState } from "react";

interface CreateRequestDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const categoryEnumValues: CategoryEnum[] = [
  'laptop', 
  'smartphone', 
  'tablet', 
  'pc', 
  'tv', 
  'audio', 
  'console', 
  'periphery', 
  'other'
];

const CreateRequestDialog = ({ open, onClose, onSubmit }: CreateRequestDialogProps) => {
  const [form, setForm] = useState({
    images: [] as File[],
    title: '',
    category: '',
    description: '',
    address: '',
    price: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm({ ...form, images: Array.from(e.target.files) });
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [field]: e.target.value });
    setErrors({ ...errors, [field]: '' });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = 'Введите название';
    if (!form.category) newErrors.category = 'Выберите категорию';
    if (!form.description.trim()) newErrors.description = 'Введите описание';
    if (!form.address.trim()) newErrors.address = 'Введите адрес';
    if (!form.price || Number(form.price) <= 0) newErrors.price = 'Укажите цену больше 0';
    if (form.images.length === 0) newErrors.images = 'Загрузите хотя бы одно изображение';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      //ApiService.apiPhotosCreate();
      //ApiService.apiRequestsCreate({...form});
      onSubmit(form);
      onClose();
    }
  };

  const imagePreviews = useMemo(() => {
    return form.images.map(file => ({
      file,
      url: URL.createObjectURL(file),
    }));
  }, [form.images]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach(p => URL.revokeObjectURL(p.url));
    };
  }, [imagePreviews]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Добавление товара</DialogTitle>
      <DialogContent>
        <Box>
          <Typography variant="body1">Изображения</Typography>
          <input type="file" accept="image/*" multiple onChange={handleImageChange} />
          {errors.images && (
            <Typography color="error" variant="caption">{errors.images}</Typography>
          )}

          <Grid container spacing={1} mt={1}>
            {imagePreviews.map((p, index) => (
              <Avatar variant="rounded" src={p.url} alt={`фото-${index}`} sx={{ width: 64, height: 64 }}/>
            ))}
          </Grid>
        </Box>

        <TextField fullWidth label="Название" value={form.title}
          onChange={handleChange('title')} margin="normal"
          error={!!errors.title} helperText={errors.title} />

        <TextField select fullWidth label="Категория" value={form.category}
          onChange={handleChange('category')} margin="normal"
          error={!!errors.category} helperText={errors.category}>
          {categoryEnumValues.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>

        <TextField fullWidth label="Описание" multiline rows={4} value={form.description}
          onChange={handleChange('description')} margin="normal"
          error={!!errors.description} helperText={errors.description} />

        <TextField fullWidth label="Адрес" value={form.address}
          onChange={handleChange('address')} margin="normal"
          error={!!errors.address} helperText={errors.address} />

        <TextField fullWidth label="Предложенная цена (руб.)" type="number" value={form.price}
          onChange={handleChange('price')} margin="normal"
          error={!!errors.price} helperText={errors.price} />
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'flex-start', pl: 3, pb: 2 }}>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Создать
        </Button>
        <Button onClick={onClose} color="inherit">Отмена</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateRequestDialog;
