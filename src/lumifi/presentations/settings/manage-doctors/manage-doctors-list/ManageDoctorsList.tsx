import { Dialog } from '@/lib/ui/components/dialog';
import { t } from '@/lib/utils';
import { useManageDoctor } from '@/lumifi/hooks';
import { DEFAULT_TABLE_LIMIT, DEFAULT_TABLE_PAGE, type IDoctor, type IPagination } from '@/lumifi/types';
import type { RootState } from '@/store/store';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Header';
import { List } from './List';

export const ManageDoctorsList: React.FC = () => {
  const navigate = useNavigate();
  const practice_account_id = useSelector((state: RootState) => state.me.details?.practice_account_id);
  const { isDoctorListFetching, doctorList, doctorPagination, getDoctorList, isDoctorDeleting, deleteDoctor } =
    useManageDoctor();
  const [deleteModalFlag, setDeleteModalFlag] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<IDoctor | null>(null);

  const fetchDoctorList = useCallback((page: number = DEFAULT_TABLE_PAGE, limit: number = DEFAULT_TABLE_LIMIT) => {
    const mapToRequest = {
      practiceAccountId: practice_account_id ?? '',
      page: page,
      limit: limit,
      role: 'Doctor',
    };
    getDoctorList(mapToRequest);
  }, []);

  useEffect(() => {
    if (practice_account_id) {
      fetchDoctorList();
    }
  }, [practice_account_id]);

  const onPageChange = useCallback(
    (pageNumber: number, limit: number) => {
      fetchDoctorList(pageNumber, limit);
    },
    [doctorPagination?.currentPage, doctorPagination?.rowsPerPage]
  );

  const handleEditDoctor = (doctorId: string) => {
    navigate(`/settings/doctor/${doctorId}/edit`);
  };

  const handleDelete = useCallback((doctor: IDoctor) => {
    setSelectedDoctor(doctor);
    setDeleteModalFlag(true);
  }, []);

  const onCancelDoctorDelete = useCallback(() => {
    setDeleteModalFlag(false);
    setSelectedDoctor(null);
  }, []);

  const refresh = () => {
    fetchDoctorList(doctorPagination?.currentPage, doctorPagination?.rowsPerPage);
  };

  const onDeleteComplete = (status: string) => {
    setDeleteModalFlag(false);
    setSelectedDoctor(null);
    if (status === 'success' && practice_account_id) {
      refresh();
    }
  };

  const onDoctorDelete = (id: string) => {
    deleteDoctor(id, onDeleteComplete);
  };

  return (
    <div className='container mx-auto'>
      <Header mode='list' />
      {deleteModalFlag ? (
        <Dialog
          isOpen={true}
          title={`${t('lumifi', 'common.delete')} ${selectedDoctor?.first_name} ${selectedDoctor?.last_name}`}
          message={t('lumifi', 'manageDoctor.modal.title')}
          onCancel={onCancelDoctorDelete}
          onConfirm={() => onDoctorDelete(selectedDoctor?.id ?? '')}
        />
      ) : (
        <List
          isLoading={isDoctorListFetching}
          doctorList={doctorList}
          isDoctorDeleting={isDoctorDeleting}
          handleDelete={handleDelete}
          handleEditDoctor={handleEditDoctor}
          paginationProps={{
            paginationData: doctorPagination as IPagination,
            handlePagination: onPageChange,
          }}
        />
      )}
    </div>
  );
};
