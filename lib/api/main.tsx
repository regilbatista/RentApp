import { Get, Post, Patch, Delete } from './axiosInstance';

const project = '';

export const apiGet = ({ path, id, sts, data, token }: any) => Get({ path, id, project, sts, data, token });
export const apiPost = ({ path, data }: any) => Post({ path, data, project });
export const apiPatch = ({ path, id, data }: any) => Patch({ path, id, data, project });
export const apiDelete = ({ path, id }: any) => Delete({ path, id, project });

export const authGet = ({ path, id, sts }: any) => Get({ path, id, project: '', sts });
export const authPost = ({ path, data }: any) => Post({ path, data, project: '' });
