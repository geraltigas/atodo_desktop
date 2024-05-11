import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
} from '@mui/material';
import { ChangeEvent } from 'react';
import { signal, Signal } from '@preact/signals'
import { is_inputting } from '../../pages/AToDo/ATodo'

export interface CreateTaskFormData {
  name: string;
  goal: string;
  deadline: string;
  in_work_time: boolean;
}

interface CreateTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskFormData) => void;
}

const form_data:Signal<CreateTaskFormData> = signal<CreateTaskFormData>({
  name: '',
  goal: '',
  deadline: '',
  in_work_time: false,
})

export const CreateTaskDialog = ({
  open,
  onClose,
  onSubmit,
}:CreateTaskDialogProps) => {

  is_inputting.value = open;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    form_data.value = { ...form_data.value, [name]: value };
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    form_data.value = { ...form_data.value, [name]: checked };
  };

  const handleSubmit = () => {
    const formattedData = {
      ...form_data.value,
      deadline: form_data.value.deadline ? form_data.value.deadline : '',
    };
    onSubmit(formattedData);
    form_data.value = {
      name: '',
      goal: '',
      deadline: '',
      in_work_time: false,
    };
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="span">
          Create a New Task
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={form_data.value.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="goal"
            label="Goal"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={form_data.value.goal}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="deadline"
            label="Deadline"
            type="datetime-local"
            fullWidth
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            value={form_data.value.deadline}
            onChange={handleInputChange}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="in_work_time"
                checked={form_data.value.in_work_time}
                onChange={handleCheckboxChange}
              />
            }
            label="In Work Time"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
