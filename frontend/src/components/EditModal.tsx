import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Select, InputLabel, FormControl, Box, Typography } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';

const EditModal = ({
  fornecedor: fornecedorProp,
  onClose,
  onFetchFornecedores,
}: {
  fornecedor: {
    id: string;
    nome: string;
    logo: string;
    cnpjs: { id: string; cnpj: string }[];
    segmentos: { id: string; nome: string }[];
  };
  onClose: () => void;
  onFetchFornecedores: () => Promise<void>;
}) => {
  const [fornecedor, setFornecedor] = useState(fornecedorProp);
  const [segmentosDisponiveis, setSegmentosDisponiveis] = useState<{ id: string; nome: string }[]>([]);

  useEffect(() => {
    api.get('/segmentos').then((res) => setSegmentosDisponiveis(res.data));
  }, []);

  const handleSubmit = async (values: any) => {
    await api.patch(`/fornecedores?id=eq.${fornecedor.id}`, {
      nome: values.nome,
      logo: values.logo,
    });

    // Atualizar os segmentos
    const segmentoIds = fornecedor.segmentos.map((s) => s.id);
    await api.delete(`/fornecedor_segmentos?fornecedor_id=eq.${fornecedor.id}`);
    for (const segmentoId of segmentoIds) {
      await api.post('/fornecedor_segmentos', {
        fornecedor_id: fornecedor.id,
        segmento_id: segmentoId,
      });
    }

    // Atualizar os CNPJs
    for (const cnpj of fornecedor.cnpjs) {
      if (!cnpj.id.toString().startsWith('temp-')) {
        await api.patch(`/cnpjs?id=eq.${cnpj.id}`, { cnpj: cnpj.cnpj });
      } else {
        await api.post('/cnpjs', { cnpj: cnpj.cnpj, fornecedor_id: fornecedor.id });
      }
    }

    // Excluir CNPJs removidos
    const originalCnpjs = fornecedorProp.cnpjs.map((c) => c.id);
    const currentCnpjs = fornecedor.cnpjs.map((c) => c.id);
    const deletedCnpjs = originalCnpjs.filter((id) => !currentCnpjs.includes(id));
    for (const id of deletedCnpjs) {
      await api.delete(`/cnpjs?id=eq.${id}`);
    }

    await onFetchFornecedores(); // Atualiza a lista de fornecedores
    onClose();
  };

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Editar Fornecedor</DialogTitle>
      <Formik
        initialValues={{ nome: fornecedor.nome, logo: fornecedor.logo }}
        validationSchema={Yup.object({
          nome: Yup.string().required('Nome obrigatório'),
          logo: Yup.string().url('URL inválida'),
        })}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, handleSubmit, errors }) => (
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h6">Informações Gerais</Typography>
                <TextField
                  fullWidth
                  label="Nome"
                  name="nome"
                  value={values.nome}
                  onChange={handleChange}
                  error={!!errors.nome}
                  helperText={errors.nome}
                />
                <TextField
                  fullWidth
                  label="Logo (URL)"
                  name="logo"
                  value={values.logo}
                  onChange={handleChange}
                  error={!!errors.logo}
                  helperText={errors.logo}
                />

                <Typography variant="h6">CNPJs</Typography>
                {fornecedor.cnpjs.map((cnpj) => (
                  <Box key={cnpj.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      fullWidth
                      value={cnpj.cnpj}
                      onChange={(e) => setFornecedor((prev) => ({
                        ...prev,
                        cnpjs: prev.cnpjs.map((c) => (c.id === cnpj.id ? { ...c, cnpj: e.target.value } : c)),
                      }))}
                    />
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => setFornecedor((prev) => ({
                        ...prev,
                        cnpjs: prev.cnpjs.filter((c) => c.id !== cnpj.id),
                      }))}
                    >
                      Remover
                    </Button>
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() =>
                    setFornecedor((prev) => ({
                      ...prev,
                      cnpjs: [...prev.cnpjs, { id: `temp-${Date.now()}`, cnpj: '' }],
                    }))
                  }
                  sx={{ alignSelf: 'flex-start' }}
                >
                  Adicionar CNPJ
                </Button>

                <Typography variant="h6">Segmentos</Typography>
                <FormControl fullWidth>
                  <InputLabel>Segmentos</InputLabel>
                  <Select
                    multiple
                    value={fornecedor.segmentos.map((s) => s.id)}
                    onChange={(e) => {
                      const selectedIds = e.target.value as string[];
                      const selectedSegmentos = segmentosDisponiveis.filter((s) =>
                        selectedIds.includes(s.id)
                      );
                      setFornecedor((prev) => ({ ...prev, segmentos: selectedSegmentos }));
                    }}
                  >
                    {segmentosDisponiveis.map((segmento) => (
                      <MenuItem key={segmento.id} value={segmento.id}>
                        {segmento.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} color="secondary">
                Cancelar
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Salvar
              </Button>
            </DialogActions>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};

export default EditModal;