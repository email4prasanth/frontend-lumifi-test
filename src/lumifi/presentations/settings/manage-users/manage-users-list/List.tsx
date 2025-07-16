import { deleteBlueIcon, pencilIcon } from '@/assets/images';
import { Image } from '@/lib/ui/components/image';
import { ButtonLoader, Loader } from '@/lib/ui/components/loader';
import { TablePagination } from '@/lib/ui/components/table-pagination';
import { t } from '@/lib/utils';
import type { IPaginationProps, IUser } from '@/lumifi/types';
import React, { useCallback } from 'react';

interface IList {
  isLoading: boolean;
  userList: IUser[];
  isUserDeleting: boolean;
  handleDelete: (user: IUser) => void;
  handleEditUser: (userId: string) => void;
  paginationProps: IPaginationProps;
}

export const List = React.memo(
  ({ isLoading, userList, isUserDeleting, handleDelete, handleEditUser, paginationProps }: IList) => {
    const onDelete = useCallback(
      (user: IUser) => {
        handleDelete(user);
      },
      [handleDelete]
    );

    const onEdit = useCallback(
      (userId: string) => {
        handleEditUser(userId);
      },
      [handleEditUser]
    );

    return (
      <>
        <div className='overflow-x-auto relative'>
          <table className='min-w-[800px] md:min-w-full table-auto border-collapse'>
            <thead className='border-b-2 border-[#BBC0C3]'>
              <tr className='text-sm text-[#4E5053] tracking-widest uppercase'>
                <th className='text-left py-3 font-semibold'>{t('lumifi', 'manageUser.tableHeader.first')}</th>
                <th className='text-left py-3 font-semibold'>{t('lumifi', 'manageUser.tableHeader.last')}</th>
                <th className='text-left py-3 font-semibold'>{t('lumifi', 'manageUser.tableHeader.email')}</th>
                <th className='text-left py-3 font-semibold'>{t('lumifi', 'manageUser.tableHeader.role')}</th>
                <th className='text-right py-3 font-semibold'> </th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td
                    colSpan={5}
                    className='py-8 text-center text-[#4E5053]'
                  >
                    <Loader overlay={false} />
                  </td>
                </tr>
              )}

              {!isLoading &&
                (userList ?? []).length > 0 &&
                userList?.map((user) => (
                  <tr
                    key={`user-${user.id}`}
                    className='border-t border-[#D6DBDE] text-[#4E5053] text-base font-medium'
                  >
                    <td className='py-3'> {user.first_name} </td>
                    <td className='py-3 text-start'> {user.last_name} </td>
                    <td className='py-3'> {user.email_id} </td>
                    <td className='py-3'> {user.role} </td>
                    {user?.hasActionMenu && (
                      <td className='py-3'>
                        <div className='flex justify-end gap-4'>
                          <button
                            onClick={() => onDelete(user)}
                            className='text-[#009BDF] text-base font-normal focus:outline-none cursor-pointer'
                          >
                            {isUserDeleting ? (
                              <ButtonLoader
                                size={20}
                                color='#009BDF'
                              />
                            ) : (
                              <>
                                <Image
                                  src={deleteBlueIcon}
                                  alt='delete-icon'
                                  className='w-[16px] h-[16px]p-2'
                                />
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => onEdit(user.id)}
                            className='flex items-center gap-1 focus:outline-none text-[#009BDF] text-base cursor-pointer font-medium'
                          >
                            <Image
                              src={pencilIcon}
                              alt='pencil-icon'
                              className='w-4 h-4'
                            />
                            <span>{t('lumifi', 'common.edit')}</span>
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              {!isLoading && (userList ?? []).length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className='py-8 text-center text-[#4E5053]'
                  >
                    {t('lumifi', 'manageUser.noUsers')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <TablePagination {...paginationProps} />
      </>
    );
  }
);
