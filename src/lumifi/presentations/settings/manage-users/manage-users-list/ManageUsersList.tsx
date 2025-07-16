import { Dialog } from '@/lib/ui/components/dialog';
import { t } from '@/lib/utils';
import { useManageUser } from '@/lumifi/hooks';
import { DEFAULT_TABLE_LIMIT, DEFAULT_TABLE_PAGE, type IPagination, type IUser } from '@/lumifi/types';
import type { RootState } from '@/store/store';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Header';
import { List } from './List';

export const ManageUsersList: React.FC = () => {
  const navigate = useNavigate();
  const practice_account_id = useSelector((state: RootState) => state.me.details?.practice_account_id);
  const { isUserListFetching, userList, getUserList, isUserDeleting, userPagination, deleteUser } = useManageUser();
  const [deleteModalFlag, setDeleteModalFlag] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const fetchUserList = useCallback((page: number = DEFAULT_TABLE_PAGE, limit: number = DEFAULT_TABLE_LIMIT) => {
    const mapToRequest = {
      practiceAccountId: practice_account_id ?? '',
      page: page,
      limit: limit,
      role: 'All',
    };
    getUserList(mapToRequest);
  }, []);

  useEffect(() => {
    if (practice_account_id) {
      fetchUserList();
    }
  }, [practice_account_id]);

  const onPageChange = useCallback(
    (pageNumber: number, limit: number) => {
      fetchUserList(pageNumber, limit);
    },
    [userPagination?.currentPage, userPagination?.rowsPerPage]
  );

  const handleEditUser = (userId: string) => {
    navigate(`/settings/user/${userId}/edit`);
  };

  const handleDelete = useCallback((user: IUser) => {
    setSelectedUser(user);
    setDeleteModalFlag(true);
  }, []);

  const onCancelUserDelete = useCallback(() => {
    setDeleteModalFlag(false);
    setSelectedUser(null);
  }, []);

  const refresh = () => {
    fetchUserList(userPagination?.currentPage, userPagination?.rowsPerPage);
  };

  const onDeleteComplete = (status: string) => {
    setDeleteModalFlag(false);
    setSelectedUser(null);
    if (status === 'success' && practice_account_id) {
      refresh();
    }
  };

  const onUserDelete = (id: string) => {
    deleteUser(id, onDeleteComplete);
  };

  return (
    <div className='container mx-auto'>
      <Header mode='list' />
      {deleteModalFlag ? (
        <Dialog
          isOpen={true}
          title={`${t('lumifi', 'common.delete')} ${selectedUser?.first_name} ${selectedUser?.last_name}`}
          message={t('lumifi', 'manageUser.modal.title')}
          onCancel={onCancelUserDelete}
          onConfirm={() => onUserDelete(selectedUser?.id ?? '')}
          isProcessing={isUserDeleting}
        />
      ) : (
        <List
          isLoading={isUserListFetching}
          userList={userList}
          isUserDeleting={isUserDeleting}
          handleDelete={handleDelete}
          handleEditUser={handleEditUser}
          paginationProps={{
            paginationData: userPagination as IPagination,
            handlePagination: onPageChange,
          }}
        />
      )}
    </div>
  );
};
