import { deleteBlueIcon, greenTickIcon, pencilIcon, redXIcon } from '@/assets/images';
import { Image } from '@/lib/ui/components/image';
import { ButtonLoader, Loader } from '@/lib/ui/components/loader';
import { TablePagination } from '@/lib/ui/components/table-pagination';
import { t } from '@/lib/utils';
import type { IDoctor, IPaginationProps } from '@/lumifi/types';
import React, { useCallback } from 'react';

interface IList {
  isLoading: boolean;
  doctorList: IDoctor[];
  isDoctorDeleting: boolean;
  handleDelete: (doctor: IDoctor) => void;
  handleEditDoctor: (doctorId: string) => void;
  paginationProps: IPaginationProps;
}

export const List = React.memo(
  ({ isLoading, doctorList, isDoctorDeleting, handleDelete, handleEditDoctor, paginationProps }: IList) => {
    const onDelete = useCallback(
      (doctor: IDoctor) => {
        handleDelete(doctor);
      },
      [handleDelete]
    );

    const onEdit = useCallback(
      (doctorId: string) => {
        handleEditDoctor(doctorId);
      },
      [handleEditDoctor]
    );

    return (
      <>
        <div className='overflow-x-auto relative'>
          <table className='min-w-[800px] md:min-w-full table-auto border-collapse'>
            <thead className='border-b-2 border-[#BBC0C3]'>
              <tr className='text-sm text-[#4E5053] tracking-widest uppercase'>
                <th className='text-left py-3 font-semibold'>{t('lumifi', 'manageDoctor.tableHeader.first')}</th>
                <th className='text-left py-3 font-semibold'>{t('lumifi', 'manageDoctor.tableHeader.last')}</th>
                <th className='text-left py-3 font-semibold'>{t('lumifi', 'manageDoctor.tableHeader.email')}</th>
                <th className='text-left py-3 font-semibold'>{t('lumifi', 'manageDoctor.tableHeader.status')}</th>
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
                (doctorList ?? []).length > 0 &&
                doctorList?.map((doctor) => (
                  <tr
                    key={`doctor-${doctor.id}`}
                    className='border-t border-[#D6DBDE] text-[#4E5053] text-base font-medium'
                  >
                    <td className='py-3'> {doctor.first_name} </td>
                    <td className='py-3 text-start'> {doctor.last_name} </td>
                    <td className='py-3'> {doctor.email_id} </td>
                    <td className='py-3'>
                      {' '}
                      {doctor.account_verified ? (
                        <Image
                          src={greenTickIcon}
                          alt='tick-icon'
                          className='w-4 h-4 ml-4'
                        />
                      ) : (
                        // <span>{t('lumifi', 'common.pending')}</span>
                        <Image
                          src={redXIcon}
                          alt='tick-icon'
                          className='w-3 h-3 ml-4'
                        />
                      )}{' '}
                    </td>
                    <td className='py-3'>
                      <div className='flex justify-end gap-4'>
                        <button
                          onClick={() => onDelete(doctor)}
                          className='text-[#009BDF] text-base font-normal focus:outline-none cursor-pointer'
                        >
                          {isDoctorDeleting ? (
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
                          onClick={() => onEdit(doctor.id)}
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
                  </tr>
                ))}
              {!isLoading && (doctorList ?? []).length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className='py-8 text-center text-[#4E5053]'
                  >
                    {t('lumifi', 'manageDoctor.noDoctors')}
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
