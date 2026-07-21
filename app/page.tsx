'use client';

import React, {useState, useMemo} from 'react';
import {useResizable, ResizeHandle} from '@astryxdesign/core/Resizable';
import type {ResizableProps} from '@astryxdesign/core/Resizable';
import {
  Layout,
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
  LayoutPanel,
  VStack,
  HStack,
  StackItem,
} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {TextInput} from '@astryxdesign/core/TextInput';
import {Button} from '@astryxdesign/core/Button';
import {Badge} from '@astryxdesign/core/Badge';
import {Avatar} from '@astryxdesign/core/Avatar';
import {Selector} from '@astryxdesign/core/Selector';
import {PowerSearch} from '@astryxdesign/core/PowerSearch';
import type {PowerSearchConfig, PowerSearchFilter} from '@astryxdesign/core/PowerSearch';
import {Dialog, DialogHeader} from '@astryxdesign/core/Dialog';
import {Popover} from '@astryxdesign/core/Popover';
import {RadioList, RadioListItem} from '@astryxdesign/core/RadioList';
import {DropdownMenu} from '@astryxdesign/core/DropdownMenu';
import {Center} from '@astryxdesign/core/Center';
import {Icon} from '@astryxdesign/core/Icon';
import {StatusDot} from '@astryxdesign/core/StatusDot';
import {Divider} from '@astryxdesign/core/Divider';
import {MetadataList, MetadataListItem} from '@astryxdesign/core/MetadataList';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableCell,
  proportional,
  pixel,
  resolveColumnWidths,
} from '@astryxdesign/core/Table';
import type {TableColumn} from '@astryxdesign/core/Table';
import {
  ChevronRightIcon,
  ChevronDownIcon,
  PencilIcon,
  DocumentDuplicateIcon,
  ArrowRightIcon,
  TagIcon,
  UserIcon,
  TrashIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline';
import {XMarkIcon} from '@heroicons/react/24/outline';
import {ChartBarIcon} from '@heroicons/react/24/solid';
import {
  allTasks,
  PRIORITY_COLOR,
  STATUS_DOT_VARIANT,
} from './allTasks';
import type {TaskPriority, TaskRow, TaskStatus} from './allTasks';

// Plain inline styles using Astryx design-token CSS variables (declared at
// :root by `@astryxdesign/core/astryx.css`). No StyleX compiler required.
// The group-header background + cursor live on the colSpan TableCell (which
// reliably forwards `style`) so they fill the full row width.
const groupHeaderCell: React.CSSProperties = {
  cursor: 'pointer',
  backgroundColor: 'var(--color-background-muted)',
  padding: 'var(--spacing-3) var(--spacing-4)',
};

const STATUS_LABEL: Record<TaskStatus, string> = {
  in_progress: 'In Progress',
  todo: 'Todo',
  backlog: 'Backlog',
  done: 'Done',
};

const GROUP_ORDER: TaskStatus[] = ['in_progress', 'todo', 'backlog', 'done'];

type GroupByField = 'status' | 'priority' | 'project' | 'assignee' | 'none';

const GROUP_BY_OPTIONS: {value: GroupByField; label: string}[] = [
  {value: 'none', label: 'None'},
  {value: 'status', label: 'Status'},
  {value: 'priority', label: 'Priority'},
  {value: 'project', label: 'Project'},
  {value: 'assignee', label: 'Assignee'},
];

function groupTasks(
  tasks: TaskRow[],
  groupBy: GroupByField,
): Map<string, TaskRow[]> {
  if (groupBy === 'none') {
    return new Map([['All', tasks]]);
  }
  const map = new Map<string, TaskRow[]>();
  for (const task of tasks) {
    const key = String(task[groupBy]) || '—';
    let group = map.get(key);
    if (!group) {
      group = [];
      map.set(key, group);
    }
    group.push(task);
  }
  return map;
}

function getGroupLabel(groupBy: GroupByField, key: string): string {
  if (groupBy === 'status') {
    return STATUS_LABEL[key as TaskStatus] ?? key;
  }
  if (groupBy === 'priority') {
    const labels: Record<string, string> = {
      urgent: 'Urgent',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      none: 'No priority',
    };
    return labels[key] ?? key;
  }
  return key;
}

const columns: TableColumn<TaskRow>[] = [
  {
    key: 'status',
    header: '',
    width: pixel(44),
  },
  {
    key: 'title',
    header: 'Issue',
    width: proportional(1),
  },
  {
    key: 'project',
    header: 'Project',
    width: pixel(180),
  },
  {
    key: 'created',
    header: 'Created',
    width: pixel(72),
  },
  {
    key: 'updated',
    header: 'Updated',
    width: pixel(72),
  },
  {
    key: 'assignee',
    header: 'Assignee',
    width: pixel(52),
  },
  {
    key: 'actions',
    header: '',
    width: pixel(56),
  },
];

const powerSearchConfig: PowerSearchConfig = {
  name: 'IssueSearch',
  fields: [
    {
      key: 'status',
      label: 'Status',
      operators: [
        {
          key: 'is',
          label: 'is',
          value: {
            type: 'enum',
            values: [
              {value: 'in_progress', label: 'In Progress'},
              {value: 'todo', label: 'Todo'},
              {value: 'backlog', label: 'Backlog'},
              {value: 'done', label: 'Done'},
            ],
          },
        },
      ],
    },
    {
      key: 'priority',
      label: 'Priority',
      operators: [
        {
          key: 'is',
          label: 'is',
          value: {
            type: 'enum',
            values: [
              {value: 'urgent', label: 'Urgent'},
              {value: 'high', label: 'High'},
              {value: 'medium', label: 'Medium'},
              {value: 'low', label: 'Low'},
              {value: 'none', label: 'None'},
            ],
          },
        },
      ],
    },
    {
      key: 'title',
      label: 'Title',
      operators: [
        {key: 'contains', label: 'contains', value: {type: 'string'}},
      ],
    },
    {
      key: 'assignee',
      label: 'Assignee',
      operators: [
        {key: 'contains', label: 'contains', value: {type: 'string'}},
      ],
    },
    {
      key: 'project',
      label: 'Project',
      operators: [
        {key: 'contains', label: 'contains', value: {type: 'string'}},
      ],
    },
  ],
};

const PRIORITY_LABEL: Record<TaskPriority, string> = {
  urgent: 'Urgent',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  none: 'None',
};

function TaskDetailPanel({
  task,
  onClose,
  resizable,
}: {
  task: TaskRow | null;
  onClose: () => void;
  resizable: ResizableProps;
}) {
  if (!task) {
    return null;
  }
  return (
    // Panel owns the separator (its full-height left border). The adjacent
    // ResizeHandle is kept divider-less + isAlwaysVisible={false} so its
    // always-on pill doesn't float above the panel as a stray stub.
    <LayoutPanel
      hasDivider
      resizable={resizable}
      padding={4}
      role="complementary"
      label="Task details">
      <VStack gap={4}>
        <HStack gap={2} vAlign="center">
          <StackItem size="fill">
            <Text type="supporting" color="secondary">
              {task.taskId}
            </Text>
          </StackItem>
          <Button
            label="Close panel"
            variant="ghost"
            size="sm"
            icon={<Icon icon={XMarkIcon} size="sm" />}
            isIconOnly
            onClick={onClose}
          />
        </HStack>

        <VStack gap={1}>
          <Heading level={3}>{task.title}</Heading>
          {task.subtitle && (
            <Text type="body" color="secondary">
              {task.subtitle}
            </Text>
          )}
        </VStack>

        <MetadataList label={{position: 'start'}}>
          <MetadataListItem label="Status">
            <HStack gap={2} vAlign="center">
              <StatusDot
                variant={STATUS_DOT_VARIANT[task.status]}
                label={STATUS_LABEL[task.status]}
              />
              <Text type="body">{STATUS_LABEL[task.status]}</Text>
            </HStack>
          </MetadataListItem>
          <MetadataListItem label="Priority">
            <HStack gap={2} vAlign="center">
              <Icon
                icon={ChartBarIcon}
                size="sm"
                color={PRIORITY_COLOR[task.priority]}
              />
              <Text type="body">{PRIORITY_LABEL[task.priority]}</Text>
            </HStack>
          </MetadataListItem>
          <MetadataListItem label="Assignee">
            <HStack gap={2} vAlign="center">
              <Avatar name={task.assignee} size="xsmall" />
              <Text type="body">{task.assignee}</Text>
            </HStack>
          </MetadataListItem>
          <MetadataListItem label="Project">
            {task.project || '\u2014'}
          </MetadataListItem>
          <MetadataListItem label="Created">
            {task.created}
          </MetadataListItem>
          <MetadataListItem label="Updated">
            {task.updated}
          </MetadataListItem>
        </MetadataList>

        {task.tags.length > 0 && (
          <>
            <Divider />
            <VStack gap={2}>
              <Text type="label">Labels</Text>
              <HStack gap={2}>
                {task.tags.map(tag => (
                  <Badge key={tag} variant="neutral" label={tag} />
                ))}
              </HStack>
            </VStack>
          </>
        )}
      </VStack>
    </LayoutPanel>
  );
}

export default function DataTableTemplate() {
  const [search, _setSearch] = useState('');
  const [priorityFilter, _setPriorityFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskRow | null>(null);
  const [powerSearchFilters, setPowerSearchFilters] = useState<
    ReadonlyArray<PowerSearchFilter>
  >([]);
  const [groupBy, setGroupBy] = useState<GroupByField>('status');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    () => new Set(GROUP_ORDER as string[]),
  );

  const filtered = useMemo(() => {
    let data = allTasks;
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        t =>
          t.title.toLowerCase().includes(q) ||
          t.taskId.toLowerCase().includes(q) ||
          t.subtitle.toLowerCase().includes(q),
      );
    }
    if (priorityFilter !== 'all') {
      data = data.filter(t => t.priority === priorityFilter);
    }
    return data;
  }, [search, priorityFilter]);

  const grouped = useMemo(
    () => groupTasks(filtered, groupBy),
    [filtered, groupBy],
  );

  const groupKeys = useMemo(() => Array.from(grouped.keys()), [grouped]);

  const toggleGroup = (key: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleGroupByChange = (value: string) => {
    const nextGroupBy = value as GroupByField;
    setGroupBy(nextGroupBy);
    setExpandedGroups(new Set(Array.from(groupTasks(filtered, nextGroupBy).keys())));
  };

  const detailPanel = useResizable({
    defaultSize: 360,
    minSizePx: 280,
    maxSizePx: 500,
  });

  const COL_COUNT = columns.length;
  const resolvedWidths = resolveColumnWidths(columns);

  return (
    <>
      <Layout
        height="fill"
        header={
          <LayoutHeader hasDivider padding={4}>
            <VStack gap={4}>
              <HStack gap={3} vAlign="center">
                <StackItem size="fill">
                  <Heading level={1}>All Issues</Heading>
                </StackItem>
                <Button
                  label="Create issue"
                  variant="primary"
                  size="lg"
                  onClick={() => setDialogOpen(true)}
                />
              </HStack>
              <HStack gap={2} vAlign="center">
                <StackItem size="fill">
                  <PowerSearch
                    config={powerSearchConfig}
                    filters={powerSearchFilters}
                    onChange={newFilters => setPowerSearchFilters(newFilters)}
                    placeholder="Filter issues..."
                    resultCount={`${filtered.length} issue${filtered.length !== 1 ? 's' : ''}`}
                  />
                </StackItem>
                <Popover
                  placement="below"
                  alignment="end"
                  width={320}
                  label="Grouping options"
                  content={
                    <VStack gap={4}>
                      <RadioList
                        label="Group by"
                        value={groupBy}
                        onChange={handleGroupByChange}>
                        {GROUP_BY_OPTIONS.map(opt => (
                          <RadioListItem
                            key={opt.value}
                            value={opt.value}
                            label={opt.label}
                          />
                        ))}
                      </RadioList>
                    </VStack>
                  }>
                  <Button
                    label="View Options"
                    variant="secondary"
                    size="md"
                  />
                </Popover>
              </HStack>
            </VStack>
          </LayoutHeader>
        }
        content={
          <LayoutContent role="main" padding={0}>
            <Table
              columns={columns}
              density="balanced"
              dividers="rows"
              textOverflow="truncate"
              hasHover>
              <colgroup>
                {columns.map(col => (
                  <col
                    key={col.key}
                    style={resolvedWidths.columns.get(col.key)?.style}
                  />
                ))}
              </colgroup>
              <TableHeader>
                <TableRow isHeaderRow>
                  {columns.map(col => (
                    <TableHeaderCell key={String(col.key)} scope="col">
                      {col.header}
                    </TableHeaderCell>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupKeys.map(key => {
                  const tasks = grouped.get(key);
                  if (!tasks || tasks.length === 0) {
                    return null;
                  }
                  const isExpanded = expandedGroups.has(key);

                  return (
                    <React.Fragment key={key}>
                      {groupBy !== 'none' && (
                        <TableRow
                          role="button"
                          tabIndex={0}
                          onClick={() => toggleGroup(key)}
                          onKeyDown={e => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              toggleGroup(key);
                            }
                          }}>
                          <TableCell colSpan={COL_COUNT} style={groupHeaderCell}>
                            <HStack gap={2} vAlign="center">
                              <Icon
                                icon={
                                  isExpanded ? ChevronDownIcon : ChevronRightIcon
                                }
                                size="sm"
                                color="secondary"
                              />
                              <Text type="body" weight="bold">
                                {getGroupLabel(groupBy, key)}
                              </Text>
                              <Badge
                                variant="neutral"
                                label={String(tasks.length)}
                              />
                            </HStack>
                          </TableCell>
                        </TableRow>
                      )}
                      {(groupBy === 'none' || isExpanded) &&
                        tasks.map(task => (
                          <TableRow
                            key={task.id}
                            onClick={() => setSelectedTask(task)}>
                            <TableCell>
                              <Center axis="horizontal">
                                <StatusDot
                                  variant={STATUS_DOT_VARIANT[task.status]}
                                  label={STATUS_LABEL[task.status]}
                                />
                              </Center>
                            </TableCell>
                            <TableCell>
                              <HStack gap={3} vAlign="center">
                                <Icon
                                  icon={ChartBarIcon}
                                  size="sm"
                                  color={PRIORITY_COLOR[task.priority]}
                                />
                                <Text type="supporting" color="secondary">
                                  {task.taskId}
                                </Text>
                                <Text type="body" maxLines={1}>
                                  {task.title}
                                </Text>
                                {task.subtitle && (
                                  <Text
                                    type="body"
                                    color="secondary"
                                    maxLines={1}>
                                    › {task.subtitle}
                                  </Text>
                                )}
                              </HStack>
                            </TableCell>
                          <TableCell>
                            {task.project ? (
                              <Text type="body" maxLines={1}>
                                {task.project}
                              </Text>
                            ) : (
                              <Text type="supporting" color="secondary">
                                —
                              </Text>
                            )}
                          </TableCell>
                          <TableCell>
                            <Text type="supporting" color="secondary">
                              {task.created}
                            </Text>
                          </TableCell>
                          <TableCell>
                            <Text type="supporting" color="secondary">
                              {task.updated}
                            </Text>
                          </TableCell>
                          <TableCell>
                            <Avatar name={task.assignee} size="xsmall" />
                          </TableCell>
                          <TableCell>
                            <DropdownMenu
                              button={{
                                label: 'Actions',
                                variant: 'ghost',
                                size: 'sm',
                                icon: (
                                  <Icon
                                    icon={EllipsisHorizontalIcon}
                                    size="sm"
                                  />
                                ),
                                isIconOnly: true,
                              }}
                              hasChevron={false}
                              items={[
                                {
                                  label: 'Edit issue',
                                  icon: PencilIcon,
                                  onClick: () => {},
                                },
                                {
                                  label: 'Assign to...',
                                  icon: UserIcon,
                                  onClick: () => {},
                                },
                                {
                                  label: 'Add label',
                                  icon: TagIcon,
                                  onClick: () => {},
                                },
                                {
                                  label: 'Duplicate',
                                  icon: DocumentDuplicateIcon,
                                  onClick: () => {},
                                },
                                {
                                  label: 'Move to project',
                                  icon: ArrowRightIcon,
                                  onClick: () => {},
                                },
                                {type: 'divider' as const},
                                {
                                  label: 'Delete issue',
                                  icon: TrashIcon,
                                  onClick: () => {},
                                },
                              ]}
                            />
                          </TableCell>
                          </TableRow>
                        ))}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </LayoutContent>
        }
        end={
          selectedTask && (
            <>
              <ResizeHandle
                resizable={detailPanel.props}
                isReversed
                isAlwaysVisible={false}
              />
              <TaskDetailPanel
                task={selectedTask}
                onClose={() => setSelectedTask(null)}
                resizable={detailPanel.props}
              />
            </>
          )
        }
      />
      <Dialog isOpen={dialogOpen} onOpenChange={open => setDialogOpen(open)}>
        <Layout
          header={
            <DialogHeader
              title="Create Issue"
              onOpenChange={open => setDialogOpen(open)}
            />
          }
          content={
            <LayoutContent padding={4}>
              <VStack gap={4}>
                <TextInput
                  label="Title"
                  placeholder="Issue title"
                  value=""
                  onChange={() => {}}
                />
                <Selector
                  label="Status"
                  value="todo"
                  options={[
                    {value: 'in_progress', label: 'In Progress'},
                    {value: 'todo', label: 'Todo'},
                    {value: 'backlog', label: 'Backlog'},
                  ]}
                  onChange={() => {}}
                />
                <Selector
                  label="Priority"
                  value="none"
                  options={[
                    {value: 'urgent', label: 'Urgent'},
                    {value: 'high', label: 'High'},
                    {value: 'medium', label: 'Medium'},
                    {value: 'low', label: 'Low'},
                    {value: 'none', label: 'No priority'},
                  ]}
                  onChange={() => {}}
                />
                <TextInput
                  label="Project"
                  placeholder="Project name"
                  value=""
                  onChange={() => {}}
                />
              </VStack>
            </LayoutContent>
          }
          footer={
            <LayoutFooter hasDivider>
              <HStack gap={2} hAlign="end">
                <Button
                  label="Cancel"
                  variant="secondary"
                  size="md"
                  onClick={() => setDialogOpen(false)}
                />
                <Button
                  label="Create"
                  variant="primary"
                  size="md"
                  onClick={() => setDialogOpen(false)}
                />
              </HStack>
            </LayoutFooter>
          }
        />
      </Dialog>
    </>
  );
}
