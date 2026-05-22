import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

const MockPaymentButton = ({ onPay }) => (
  <button className="pay-btn" onClick={onPay}>Pay Now</button>
);

describe('Payment Frontend Component', () => {
  it('renders the Pay Now button', () => {
    render(<MockPaymentButton onPay={() => {}} />);
    const buttonElement = screen.getByText(/Pay Now/i);
    expect(buttonElement).toBeInTheDocument();
  });

  it('triggers payment function on click', () => {
    const handleClick = jest.fn();
    render(<MockPaymentButton onPay={handleClick} />);
    const buttonElement = screen.getByText(/Pay Now/i);
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
