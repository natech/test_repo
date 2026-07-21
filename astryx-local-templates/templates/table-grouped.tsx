'use client';

import {useCallback, useState} from 'react';
import {Card} from '@astryxdesign/core/Card';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {
  Table,
  pixel,
  proportional,
  useTableGroupedRows,
} from '@astryxdesign/core/Table';
import type {TableColumn} from '@astryxdesign/core/Table';

interface AccountRow extends Record<string, unknown> {
  id: string;
  owner: string;
  region: string;
  stage: string;
  pipeline: string;
}

const rows: AccountRow[] = [
  {
    id: 'acct_01',
    owner: 'Ava Chen',
    region: 'North America',
    stage: 'Proposal',
    pipeline: '$148K',
  },
  {
    id: 'acct_02',
    owner: 'Mia Cole',
    region: 'North America',
    stage: 'Discovery',
    pipeline: '$62K',
  },
  {
    id: 'acct_03',
    owner: 'Leo Nash',
    region: 'EMEA',
    stage: 'Negotiation',
    pipeline: '$210K',
  },
  {
    id: 'acct_04',
    owner: 'Zoe Vega',
    region: 'EMEA',
    stage: 'Pilot',
    pipeline: '$91K',
  },
  {
    id: 'acct_05',
    owner: 'Max Ross',
    region: 'APAC',
    stage: 'Qualification',
    pipeline: '$84K',
  },
  {
    id: 'acct_06',
    owner: 'Liam Park',
    region: 'APAC',
    stage: 'Closed Won',
    pipeline: '$133K',
  },
];

const columns: TableColumn<AccountRow>[] = [
  {key: 'owner', header: 'Owner', width: proportional(1.5)},
  {key: 'stage', header: 'Stage', width: proportional(1.2)},
  {key: 'pipeline', header: 'Pipeline', width: pixel(120), align: 'end'},
];

export default function TableGrouped() {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const onToggleGroup = useCallback((groupKey: string) => {
    setCollapsedGroups(previous => {
      const next = new Set(previous);
      if (next.has(groupKey)) {
        next.delete(groupKey);
      } else {
        next.add(groupKey);
      }
      return next;
    });
  }, []);

  const grouped = useTableGroupedRows<AccountRow>({
    data: rows,
    groupBy: row => row.region,
    collapsedGroups,
    onToggleGroup,
    getRowKey: row => row.id,
  });

  return (
    <Card className="table-grouped-template" padding={4}>
      <div className="table-grouped-template__header">
        <Text type="label">Regional Pipeline</Text>
        <Heading level={2}>Grouped opportunity table</Heading>
        <Text color="secondary">
          Teams are grouped by region with collapsible headers so dense pipeline
          data stays easy to scan.
        </Text>
      </div>

      <Table
        columns={columns}
        data={grouped.data}
        dividers="grid"
        hasHover
        idKey={grouped.idKey}
        plugins={{grouped: grouped.plugin}}
      />
    </Card>
  );
}
