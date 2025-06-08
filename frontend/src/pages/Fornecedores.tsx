import React, { useEffect, useState } from 'react';
import { Button, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
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

  useEffect(() => {
    api
      .get('/fornecedores?select=*,cnpjs(*),fornecedor_segmentos(segmentos(*))')
      .then((res) => {
        const data = res.data.map((fornecedor: any) => ({
          ...fornecedor,
          segmentos: fornecedor.fornecedor_segmentos.map((fs: any) => fs.segmentos),
        }));
        setFornecedores(data);
      });
  }, []);

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Logo</TableCell>
            <TableCell>CNPJs</TableCell>
            <TableCell>Segmentos</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fornecedores.map((f) => (
            <TableRow key={f.id}>
              <TableCell>{f.nome}</TableCell>
              <TableCell>
                <img src={f.logo} width="50" alt="" />
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
                <Button onClick={() => setSelected(f)}>Editar</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selected && <EditModal fornecedor={selected} onClose={() => setSelected(null)} />}
    </>
  );
};

export default Fornecedores;