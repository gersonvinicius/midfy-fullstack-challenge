import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';

const EditModal = ({
  fornecedor: fornecedorProp,
  onClose,
}: {
  fornecedor: {
    id: string;
    nome: string;
    logo: string;
    cnpjs: { id: string; cnpj: string }[];
    segmentos: { id: string; nome: string }[];
  };
  onClose: () => void;
}) => {
  const [fornecedor, setFornecedor] = useState(fornecedorProp);
  const [segmentosDisponiveis, setSegmentosDisponiveis] = useState<{ id: string; nome: string }[]>([]);

  useEffect(() => {
    // Busca os segmentos disponíveis no Supabase
    api.get('/segmentos').then((res) => setSegmentosDisponiveis(res.data));
  }, []);

  const handleSubmit = async (values: any) => {
    // Atualizar o fornecedor
    await api.patch(`/fornecedores?id=eq.${fornecedor.id}`, {
      nome: values.nome,
      logo: values.logo,
    });

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

    // Atualizar os segmentos
    const segmentoIds = fornecedor.segmentos.map((s) => s.id);
    await api.delete(`/fornecedor_segmentos?fornecedor_id=eq.${fornecedor.id}`);
    for (const segmentoId of segmentoIds) {
      await api.post('/fornecedor_segmentos', {
        fornecedor_id: fornecedor.id,
        segmento_id: segmentoId,
      });
    }

    onClose();
  };

  const handleCnpjChange = (id: string, value: string) => {
    setFornecedor((prev) => ({
      ...prev,
      cnpjs: prev.cnpjs.map((c) => (c.id === id ? { ...c, cnpj: value } : c)),
    }));
  };

  const handleAddCnpj = () => {
    setFornecedor((prev) => ({
      ...prev,
      cnpjs: [...prev.cnpjs, { id: `temp-${Date.now()}`, cnpj: '' }],
    }));
  };

  const handleDeleteCnpj = (id: string) => {
    setFornecedor((prev) => ({
      ...prev,
      cnpjs: prev.cnpjs.filter((c) => c.id !== id),
    }));
  };

  return (
    <Dialog open onClose={onClose}>
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

              <div>
                <h4>CNPJs</h4>
                {fornecedor.cnpjs.map((cnpj) => (
                  <div key={cnpj.id}>
                    <TextField
                      fullWidth
                      value={cnpj.cnpj}
                      onChange={(e) => handleCnpjChange(cnpj.id, e.target.value)}
                    />
                    <Button onClick={() => handleDeleteCnpj(cnpj.id)}>Excluir</Button>
                  </div>
                ))}
                <Button onClick={handleAddCnpj}>Adicionar CNPJ</Button>
              </div>

              <div>
                <h4>Segmentos</h4>
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
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Cancelar</Button>
              <Button type="submit">Salvar</Button>
            </DialogActions>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};

export default EditModal;