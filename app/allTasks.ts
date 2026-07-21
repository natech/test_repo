export type TaskStatus = 'in_progress' | 'todo' | 'backlog' | 'done';
export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low' | 'none';

export interface TaskRow extends Record<string, unknown> {
  id: string;
  taskId: string;
  title: string;
  subtitle: string;
  status: TaskStatus;
  priority: TaskPriority;
  project: string;
  tags: string[];
  created: string;
  createdISO: string;
  updated: string;
  updatedISO: string;
  assignee: string;
}

export const STATUS_DOT_VARIANT: Record<
  TaskStatus,
  'success' | 'accent' | 'neutral' | 'warning'
> = {
  in_progress: 'accent',
  todo: 'warning',
  backlog: 'neutral',
  done: 'success',
};

export const PRIORITY_COLOR: Record<
  TaskPriority,
  'primary' | 'secondary' | 'disabled'
> = {
  urgent: 'primary',
  high: 'primary',
  medium: 'secondary',
  low: 'disabled',
  none: 'disabled',
};

// Mock data matching a task tracker
export const allTasks: TaskRow[] = [
  {
    id: '1',
    taskId: 'T240180101',
    title: 'Launch analytics overview dashboard',
    subtitle: 'Finalize charts for weekly operations review',
    status: 'in_progress',
    priority: 'high',
    project: 'Operations command center',
    tags: ['Dashboard', 'Frontend'],
    created: 'Jul 14',
    createdISO: '2026-07-14',
    updated: 'Jul 20',
    updatedISO: '2026-07-20',
    assignee: 'Olivia Martin',
  },
  {
    id: '2',
    taskId: 'T240180102',
    title: 'Backfill missing invoice export history',
    subtitle: 'Repair finance exports for Q2 customers',
    status: 'in_progress',
    priority: 'urgent',
    project: 'Billing reliability',
    tags: ['Finance', 'Data Repair'],
    created: 'Jul 15',
    createdISO: '2026-07-15',
    updated: 'Jul 20',
    updatedISO: '2026-07-20',
    assignee: 'Jackson Lee',
  },
  {
    id: '3',
    taskId: 'T240180103',
    title: 'Reduce search latency for workspace queries',
    subtitle: '',
    status: 'in_progress',
    priority: 'medium',
    project: 'Search performance',
    tags: ['Infra'],
    created: 'Jul 12',
    createdISO: '2026-07-12',
    updated: 'Jul 19',
    updatedISO: '2026-07-19',
    assignee: 'Isabella Nguyen',
  },
  {
    id: '4',
    taskId: 'T240180104',
    title: 'Prepare customer migration checklist',
    subtitle: 'Draft rollout steps for enterprise tenants',
    status: 'todo',
    priority: 'high',
    project: 'Platform migration',
    tags: ['Docs'],
    created: 'Jul 11',
    createdISO: '2026-07-11',
    updated: 'Jul 18',
    updatedISO: '2026-07-18',
    assignee: 'William Kim',
  },
  {
    id: '5',
    taskId: 'T240180105',
    title: 'Add retry handling to webhook processor',
    subtitle: 'Prevent dropped partner notifications',
    status: 'todo',
    priority: 'medium',
    project: 'Partner integrations',
    tags: ['Backend', 'Reliability'],
    created: 'Jul 16',
    createdISO: '2026-07-16',
    updated: 'Jul 17',
    updatedISO: '2026-07-17',
    assignee: 'Sofia Davis',
  },
  {
    id: '6',
    taskId: 'T240180106',
    title: 'Design handoff for settings navigation refresh',
    subtitle: '',
    status: 'todo',
    priority: 'low',
    project: 'Navigation cleanup',
    tags: ['Design'],
    created: 'Jul 10',
    createdISO: '2026-07-10',
    updated: 'Jul 16',
    updatedISO: '2026-07-16',
    assignee: 'Mia Wilson',
  },
  {
    id: '7',
    taskId: 'T240180107',
    title: 'Audit role permissions for support team',
    subtitle: 'Review access to account export tools',
    status: 'todo',
    priority: 'urgent',
    project: 'Security hardening',
    tags: ['Security', 'Audit'],
    created: 'Jul 17',
    createdISO: '2026-07-17',
    updated: 'Jul 20',
    updatedISO: '2026-07-20',
    assignee: 'Lucas Brown',
  },
  {
    id: '8',
    taskId: 'T240180108',
    title: 'Prototype template library landing page',
    subtitle: '',
    status: 'backlog',
    priority: 'low',
    project: 'Growth experiments',
    tags: ['Marketing', 'Prototype'],
    created: 'Jul 8',
    createdISO: '2026-07-08',
    updated: 'Jul 12',
    updatedISO: '2026-07-12',
    assignee: 'Ethan Jones',
  },
  {
    id: '9',
    taskId: 'T240180109',
    title: 'Document local setup for new contributors',
    subtitle: '',
    status: 'backlog',
    priority: 'low',
    project: 'Developer experience',
    tags: ['Docs', 'Onboarding'],
    created: 'Jul 9',
    createdISO: '2026-07-09',
    updated: 'Jul 13',
    updatedISO: '2026-07-13',
    assignee: 'Ava Taylor',
  },
  {
    id: '10',
    taskId: 'T240180110',
    title: 'Clean up stale feature flags',
    subtitle: '',
    status: 'backlog',
    priority: 'none',
    project: 'Platform maintenance',
    tags: [],
    created: 'Jul 7',
    createdISO: '2026-07-07',
    updated: 'Jul 11',
    updatedISO: '2026-07-11',
    assignee: 'Noah Garcia',
  },
  {
    id: '11',
    taskId: 'T240180111',
    title: 'Ship keyboard shortcuts help modal',
    subtitle: '',
    status: 'done',
    priority: 'medium',
    project: 'Navigation cleanup',
    tags: ['UX'],
    created: 'Jul 5',
    createdISO: '2026-07-05',
    updated: 'Jul 14',
    updatedISO: '2026-07-14',
    assignee: 'Olivia Martin',
  },
  {
    id: '12',
    taskId: 'T240180112',
    title: 'Create incident review template',
    subtitle: '',
    status: 'done',
    priority: 'medium',
    project: 'Ops enablement',
    tags: ['Process'],
    created: 'Jul 4',
    createdISO: '2026-07-04',
    updated: 'Jul 10',
    updatedISO: '2026-07-10',
    assignee: 'Jackson Lee',
  },
];
