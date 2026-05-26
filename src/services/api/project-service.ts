import supabase from '../../lib/supabase-client';
import { TABLES } from '../../lib/db-tables';
import {
  Project,
  ProjectWithRelations,
  ProjectInsert,
  ProjectUpdate,
  ProjectStatus,
  ProjectType,
  ProjectSource
} from '../../types/db_types';

const PROJECT_SELECT = `
  *,
  customer_details:customer(id, first_name, last_name, email, phone_number, street_address, city, state, zipcode),
  service_details:service(id, name, description, default_price),
  project_status:project_status_id(id, name, description),
  project_type:project_type_id(id, name, description),
  project_source:source_id(id, name, description)
`;

export const fetchAllProjects = async (): Promise<ProjectWithRelations[]> => {
  const { data, error } = await supabase
    .from(TABLES.PROJECTS)
    .select(PROJECT_SELECT)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as ProjectWithRelations[];
};

export const fetchProjectById = async (id: string): Promise<ProjectWithRelations> => {
  const { data, error } = await supabase
    .from(TABLES.PROJECTS)
    .select(PROJECT_SELECT)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as ProjectWithRelations;
};

export const fetchProjectStatuses = async (): Promise<ProjectStatus[]> => {
  const { data, error } = await supabase
    .from(TABLES.PROJECT_STATUS)
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data as ProjectStatus[];
};

export const reorderProjectStatuses = async (
  items: { id: number; sort_order: number }[]
): Promise<void> => {
  // Sequential — parallel updates on adjacent sort_order values deadlock on any
  // unique constraint because each UPDATE sees the other row's old value still present.
  for (const { id, sort_order } of items) {
    const { error } = await supabase
      .from(TABLES.PROJECT_STATUS)
      .update({ sort_order })
      .eq('id', id);
    if (error) throw error;
  }
};

export const fetchProjectTypes = async (): Promise<ProjectType[]> => {
  const { data, error } = await supabase
    .from(TABLES.PROJECT_TYPE)
    .select('*')
    .order('id', { ascending: true });

  if (error) throw error;
  return data as ProjectType[];
};

export const fetchProjectSources = async (): Promise<ProjectSource[]> => {
  const { data, error } = await supabase
    .from(TABLES.PROJECT_SOURCE)
    .select('*')
    .order('id', { ascending: true });

  if (error) throw error;
  return data as ProjectSource[];
};

export const createProjectStatus = async (data: {
  name: string;
  description?: string;
}): Promise<ProjectStatus> => {
  const { data: row, error } = await supabase
    .from(TABLES.PROJECT_STATUS)
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return row as ProjectStatus;
};

export const updateProjectStatusItem = async (
  id: number,
  data: { name?: string; description?: string }
): Promise<ProjectStatus> => {
  const { data: row, error } = await supabase
    .from(TABLES.PROJECT_STATUS)
    .update(data)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return row as ProjectStatus;
};

export const deleteProjectStatus = async (id: number): Promise<void> => {
  const { error } = await supabase.from(TABLES.PROJECT_STATUS).delete().eq('id', id);
  if (error) throw error;
};

export const createProjectType = async (data: {
  name: string;
  description?: string;
}): Promise<ProjectType> => {
  const { data: row, error } = await supabase
    .from(TABLES.PROJECT_TYPE)
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return row as ProjectType;
};

export const updateProjectTypeItem = async (
  id: number,
  data: { name?: string; description?: string }
): Promise<ProjectType> => {
  const { data: row, error } = await supabase
    .from(TABLES.PROJECT_TYPE)
    .update(data)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return row as ProjectType;
};

export const deleteProjectType = async (id: number): Promise<void> => {
  const { error } = await supabase.from(TABLES.PROJECT_TYPE).delete().eq('id', id);
  if (error) throw error;
};

export const createProjectSource = async (data: {
  name: string;
  description?: string;
}): Promise<ProjectSource> => {
  const { data: row, error } = await supabase
    .from(TABLES.PROJECT_SOURCE)
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return row as ProjectSource;
};

export const updateProjectSourceItem = async (
  id: number,
  data: { name?: string; description?: string }
): Promise<ProjectSource> => {
  const { data: row, error } = await supabase
    .from(TABLES.PROJECT_SOURCE)
    .update(data)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return row as ProjectSource;
};

export const deleteProjectSource = async (id: number): Promise<void> => {
  const { error } = await supabase.from(TABLES.PROJECT_SOURCE).delete().eq('id', id);
  if (error) throw error;
};

export const createProject = async (project: ProjectInsert): Promise<Project> => {
  const { data, error } = await supabase
    .from(TABLES.PROJECTS)
    .insert(project)
    .select()
    .single();

  if (error) throw error;
  return data as Project;
};

export const updateProject = async (id: string, project: ProjectUpdate): Promise<Project> => {
  const { data, error } = await supabase
    .from(TABLES.PROJECTS)
    .update(project)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Project;
};

export const deleteProject = async (id: string): Promise<void> => {
  const { error } = await supabase.from(TABLES.PROJECTS).delete().eq('id', id);

  if (error) throw error;
};

export const fetchNextProjectNumber = async (): Promise<number> => {
  const { data, error } = await supabase
    .from(TABLES.PROJECTS)
    .select('project_number')
    .order('project_number', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return ((data?.project_number as number) || 0) + 1;
};
