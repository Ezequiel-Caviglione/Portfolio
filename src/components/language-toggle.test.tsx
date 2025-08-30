import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { LanguageToggle } from './language-toggle';
import { LanguageProvider } from '@/i18n/LanguageContext';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
    motion: {
        button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    },
}));

describe('LanguageToggle', () => {
    const renderWithProvider = (component: React.ReactElement) => {
        return render(
            <LanguageProvider>
                {component}
            </LanguageProvider>
        );
    };

    it('should render with default language (Spanish)', () => {
        renderWithProvider(<LanguageToggle />);

        expect(screen.getByText('ES')).toBeInTheDocument();
        expect(screen.getByLabelText('Cambiar idioma')).toBeInTheDocument();
    });

    it('should toggle language when clicked', () => {
        renderWithProvider(<LanguageToggle />);

        const button = screen.getByLabelText('Cambiar idioma');

        // Initially should show ES
        expect(screen.getByText('ES')).toBeInTheDocument();

        // Click to switch to English
        fireEvent.click(button);

        // Should now show EN and have English aria-label
        expect(screen.getByText('EN')).toBeInTheDocument();
        expect(screen.getByLabelText('Switch language')).toBeInTheDocument();
    });

    it('should have proper accessibility attributes', () => {
        renderWithProvider(<LanguageToggle />);

        const button = screen.getByRole('button');

        expect(button).toHaveAttribute('aria-label', 'Cambiar idioma');
        expect(button).toHaveAttribute('aria-describedby', 'language-status');
        expect(button).toHaveAttribute('title');

        // Globe icon should be hidden from screen readers
        const globeIcon = button.querySelector('svg');
        expect(globeIcon).toHaveAttribute('aria-hidden', 'true');

        // Language status should have proper id
        expect(screen.getByText('ES')).toHaveAttribute('id', 'language-status');
    });

    it('should update title attribute based on current language', () => {
        renderWithProvider(<LanguageToggle />);

        const button = screen.getByRole('button');

        // Initially should have Spanish title
        expect(button).toHaveAttribute('title', 'Idioma actual: Español');

        // Click to switch to English
        fireEvent.click(button);

        // Should now have English title
        expect(button).toHaveAttribute('title', 'Current language: English');
    });

    it('should throw error when used outside LanguageProvider', () => {
        // Suppress console.error for this test since we expect an error
        const originalConsoleError = console.error;
        console.error = vi.fn();

        expect(() => {
            render(<LanguageToggle />);
        }).toThrow('useLanguageContext must be used within a LanguageProvider');

        console.error = originalConsoleError;
    });
});