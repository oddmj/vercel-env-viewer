import { DataGrid, type Column } from 'react-data-grid';
import { useMemo } from 'react';
import useEnvsQuery from './hooks/useEnvsQuery';
import 'react-data-grid/lib/styles.css';

interface DataGridRow {
  key: string;
  [target: string]: string;
}

export default function Home() {
  const {
    data: { envs, targets },
  } = useEnvsQuery();

  const columns = useMemo<Column<DataGridRow>[]>(
    () => [
      {
        key: 'key',
        name: 'env Key',
      },
      ...targets.map((target) => ({
        key: target,
        name: target,
      })),
    ],
    [targets],
  );

  return <DataGrid columns={columns} rows={envs} style={{ height: '100vh' }} />;
}
