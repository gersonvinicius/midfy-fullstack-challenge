import React, { useEffect, useState } from 'react';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper, Typography, IconButton, Box, TextField } from '@mui/material';
import { Edit } from '@mui/icons-material';
import api from '../services/api';
import EditModal from '../components/EditModal';

const Fornecedores = () => {
  const [fornecedores, setFornecedores] = useState<
    { id: string; nome: string; logo: string; cnpjs: { id: string; cnpj: string }[]; segmentos: { id: string; nome: string }[] }[]
  >([]);
  const [selected, setSelected] = useState<{
    id: string;
    nome: string;
    logo: string;
    cnpjs: { id: string; cnpj: string }[];
    segmentos: { id: string; nome: string }[];
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Função para buscar fornecedores
  const fetchFornecedores = async () => {
    const response = await api.get('/fornecedores?select=*,cnpjs(*),fornecedor_segmentos(segmentos(*))');
    const data = response.data.map((fornecedor: any) => ({
      ...fornecedor,
      segmentos: fornecedor.fornecedor_segmentos.map((fs: any) => fs.segmentos), // Mapear segmentos para o formato correto
    }));
    setFornecedores(data);
  };

  // Carrega os fornecedores ao montar o componente
  useEffect(() => {
    fetchFornecedores();
  }, []);

  // Filtro para pesquisa dinâmica
  const filteredFornecedores = fornecedores.filter((f) => {
    const lowerCaseTerm = searchTerm.toLowerCase();
    const matchesNome = f.nome.toLowerCase().includes(lowerCaseTerm);
    const matchesCnpj = f.cnpjs.some((cnpj) => cnpj.cnpj.includes(lowerCaseTerm));
    const matchesSegmento = f.segmentos.some((segmento) =>
      segmento.nome.toLowerCase().includes(lowerCaseTerm)
    );
    return matchesNome || matchesCnpj || matchesSegmento;
  });

  return (
    <Box sx={{ padding: 3 }}>
      {/* Título */}
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Gerenciamento de Fornecedores
      </Typography>

      {/* Campo de Pesquisa */}
      <TextField
        fullWidth
        label="Pesquisar"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Pesquise por nome, CNPJ ou segmento..."
        sx={{ marginBottom: 3 }}
      />

      {/* Tabela */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Nome</strong></TableCell>
              <TableCell><strong>Logo</strong></TableCell>
              <TableCell><strong>CNPJs</strong></TableCell>
              <TableCell><strong>Segmentos</strong></TableCell>
              <TableCell><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredFornecedores.map((f) => (
              <TableRow key={f.id}>
                <TableCell>{f.nome}</TableCell>
                <TableCell>
                  <img
                    src={f.logo}
                    width="50"
                    alt={f.nome}
                    style={{ borderRadius: '5px', border: '1px solid #ccc' }}
                  />
                </TableCell>
                <TableCell>
                  {f.cnpjs?.map((cnpj) => (
                    <div key={cnpj.id}>{cnpj.cnpj}</div>
                  ))}
                </TableCell>
                <TableCell>
                  {f.segmentos?.map((segmento) => (
                    <div key={segmento.id}>{segmento.nome}</div>
                  ))}
                </TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => setSelected(f)}>
                    <Edit />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de Edição */}
      {selected && (
        <EditModal
          fornecedor={selected}
          onClose={() => setSelected(null)}
          onFetchFornecedores={fetchFornecedores}
        />
      )}
    </Box>
  );
};

export default Fornecedores;