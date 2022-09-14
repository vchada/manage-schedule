export interface User {
  isSelected: boolean;
  userId: string;
  userName: string;
  role: string;
  description: string;
  isEdit: boolean;
  isAdd: boolean;
}

export const UserColumns = [
  // {
  //   key: 'isSelected',
  //   type: 'isSelected',
  //   label: '',
  // },
  
  // "userId": "1",
  //       "userName": "Venkat Chada",
  //       "role": "Manager",
  //       "description": "New user inserted",
  
  {
    key: 'userId',
    type: 'text',
    label: 'User Id',
  },
  {
    key: 'userName',
    type: 'text',
    label: 'User Name',
  },
  {
    key: 'role',
    type: 'text',
    label: 'Role',
  },
  {
    key: 'description',
    type: 'text',
    label: 'Description',
  },
  {
    key: 'isEdit',
    type: 'isEdit',
    label: '',
  },
];
