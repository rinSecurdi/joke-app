import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('Work-Friendly Joke Generator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders heading and button', () => {
    render(<App />);
    expect(screen.getByText(/Work-Friendly Joke Generator/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Generate New Joke/i })).toBeInTheDocument();
  });

  test('displays loading when fetching a joke', async () => {
    axios.get.mockResolvedValue({
      data: { type: 'single', joke: 'Why did the developer go broke? Because he used up all his cache.' },
    });

    render(<App />);
    fireEvent.click(screen.getByText(/Generate New Joke/i));

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    // Wait for the joke to appear
    await waitFor(() => {
      expect(screen.getByText(/Why did the developer go broke/i)).toBeInTheDocument();
    });
  });

  test('shows fetched joke (single type)', async () => {
    const mockJoke = 'Why do programmers prefer dark mode? Because light attracts bugs.';
    axios.get.mockResolvedValue({
      data: { type: 'single', joke: mockJoke },
    });

    render(<App />);
    fireEvent.click(screen.getByText(/Generate New Joke/i));

    await waitFor(() => {
      expect(screen.getByText(mockJoke)).toBeInTheDocument();
    });
  });

  test('shows fetched joke (twopart type)', async () => {
    axios.get.mockResolvedValue({
      data: {
        type: 'twopart',
        setup: 'Why did the chicken join a band?',
        delivery: 'Because it had the drumsticks!',
      },
    });

    render(<App />);
    fireEvent.click(screen.getByText(/Generate New Joke/i));

    await waitFor(() => {
      expect(screen.getByText(/Why did the chicken join a band\? - Because it had the drumsticks!/i)).toBeInTheDocument();
    });
  });

  test('shows error message on API failure', async () => {
    axios.get.mockRejectedValue(new Error('Network error'));

    render(<App />);
    fireEvent.click(screen.getByText(/Generate New Joke/i));

    await waitFor(() => {
      expect(screen.getByText(/Oops! Something went wrong while fetching the joke./i)).toBeInTheDocument();
    });
  });
});
