import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AddUsersInfo } from './AddUsersInfo';
import { MemoryRouter } from 'react-router-dom';

const mockProps = {
  onNext: vi.fn(),
  onSkip: vi.fn(),
  userStatesList: [],
  userRolesList: [],
};

describe('AddUsersInfo Form', () => {
  it('should render all expected elements', () => {
    render(
      <MemoryRouter>
        <AddUsersInfo {...mockProps} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('userInfo-title')).toBeInTheDocument();
    expect(screen.getByTestId('userInfo-intialmsg')).toBeInTheDocument();
    expect(screen.getByTestId('add-users-button')).toBeInTheDocument();
    expect(screen.getByTestId('main-cancel-button')).toBeInTheDocument();
    expect(screen.getByTestId('main-next-button')).toBeInTheDocument();
  });
});
